import path from 'path';

import {
  Message,
  ToExtensionMessage,
  Status,
  StatusMessage,
  OutputError,
  InputData,
} from './types';
import OutputHandler from './OutputHandler';
import ExtensionModuleHandler from './ExtensionModuleHandler';

export class ExtensionProcess {
  private extensionModule: ExtensionModuleHandler;

  public constructor() {
    if (!process.send) {
      console.error('Process has no parent.');
      process.exit(1);
    }

    if (!process.env.EXTENSION_ID) {
      this.sendStatus(Status.Exit, { reason: `Environment variable "EXTENSION_ID" is not defined` });
      process.exit(1);
    }

    if (!process.env.EXTENSION_MODULE_PATH) {
      this.sendStatus(Status.Exit, { reason: `Environment variable "EXTENSION_MODULE_PATH" is not defined` });
      process.exit(1);
    }

    process.on('message', async <D>(message: ToExtensionMessage<D>) => {
      if (message.type !== Message.Input) return;

      type RequestDataType = InputData[typeof message.inputType];

      const responseHandler = new OutputHandler(message);
      const requestHandler = this.extensionModule.getInputHandler(message.inputType);

      if (!requestHandler) {
        return responseHandler.sendOutputError(
          OutputError.UnknownInputMessage,
          { reason: `"${message.inputType}" handler is not present in the extension` });
      }

      try {
        const responseData = await requestHandler(message.data as unknown as RequestDataType);
        return responseHandler.sendOutput(responseData);
      } catch (error) {
        return responseHandler.sendOutputError(
          OutputError.InputHandlingError,
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
        { reason: `Cannot load extension module from path "${extensionModulePath}"` },
      );
      process.exit(1);
    }
  }

  private sendStatus<D>(status: Status, data: D) {
    if (!process.send) throw new Error('Process has no parent to send response to.');

    const statusMessage: StatusMessage<D> = {
      status,
      data,
      type: Message.Status,
    };
    process.send(statusMessage);
  }
}

export default ExtensionProcess;
