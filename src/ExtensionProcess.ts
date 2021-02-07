import path from 'path';

import {
  Message,
  ToExtensionMessage,
  StatusMessage,
} from './message';
import {
  CallError,
  CallInput,
} from './call';
import { Status } from './status';
import CallReturnHandler from './CallReturnHandler';
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
      if (message.type !== Message.Call) return;

      type CurrentCallInput = CallInput[typeof message.callType];

      const callHandler = this.extensionModule.getCallHandler(message.callType);
      const callReturnHandler = new CallReturnHandler(message);

      if (!callHandler) {
        return callReturnHandler.sendCallError(
          CallError.UnknownCall,
          { reason: `"${message.callType}" handler is not present in the extension.` });
      }

      try {
        const callReturnData = await callHandler(message.data as unknown as CurrentCallInput);
        return callReturnHandler.sendCallReturn(callReturnData);
      } catch (error) {
        return callReturnHandler.sendCallError(
          CallError.CallHandlingError,
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
