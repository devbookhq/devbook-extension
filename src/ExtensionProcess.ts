import path from 'path';

import {
  Message,
  ToExtensionMessage,
  StatusMessage,
} from './message';
import {
  EventError,
  EventInput,
} from './event';
import { Status } from './status';
import EventReturnHandler from './EventReturnHandler';
import ExtensionModuleHandler from './ExtensionModuleHandler';

export class ExtensionProcess {
  private extensionModule: ExtensionModuleHandler;

  public constructor() {
    if (!process.send) {
      console.error('Process has no parent.');
      process.exit(1);
    }

    if (!process.env.EXTENSION_ID) {
      this.sendStatus(Status.Exit, { reason: `Environment variable "EXTENSION_ID" is not defined.` });
      process.exit(1);
    }

    if (!process.env.EXTENSION_MODULE_PATH) {
      this.sendStatus(Status.Exit, { reason: `Environment variable "EXTENSION_MODULE_PATH" is not defined.` });
      process.exit(1);
    }

    process.on('message', async <D>(message: ToExtensionMessage<D>) => {
      if (message.type !== Message.Event) return;

      type CurrentEventInput = EventInput[typeof message.eventType];

      const eventHandler = this.extensionModule.getEventHandler(message.eventType);
      const eventReturnHandler = new EventReturnHandler(message);

      if (!eventHandler) {
        return eventReturnHandler.sendError(
          EventError.UnknownEvent,
          { reason: `"${message.eventType}" handler is not present in the extension.` });
      }

      try {
        const eventReturnData = await eventHandler(message.data as unknown as CurrentEventInput);
        return eventReturnHandler.sendReturn(eventReturnData);
      } catch (error) {
        return eventReturnHandler.sendError(
          EventError.EventError,
          { reason: error.message },
        );
      }
    });

    const extensionModulePath = path.resolve(process.env.EXTENSION_MODULE_PATH);

    try {
      this.extensionModule = new ExtensionModuleHandler(extensionModulePath);
      this.sendStatus(Status.Ready, undefined);
    } catch (error) {
      this.sendStatus(
        Status.Exit,
        { reason: `Cannot load extension module from path "${extensionModulePath}".` },
      );
      process.exit(1);
    }
  }

  private sendStatus<D>(status: Status, data: D) {
    if (!process.send) throw new Error('Process has no parent to send status to.');

    const statusMessage: StatusMessage<D> = {
      status,
      data,
      type: Message.Status,
    };
    process.send(statusMessage);
  }
}

export default ExtensionProcess;
