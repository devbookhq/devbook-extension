import {
  Input,
  InputData,
  OutputData,
} from './types';

class ExtensionModuleHandler {
  private exports: { [handler in Input]: <I, O>(data: I) => Promise<O> | O };

  public constructor(extensionModulePath: string) {
    this.exports = require(extensionModulePath);
  }

  public getInputHandler(inputType: Input) {
    type RequestDataType = InputData[typeof inputType];
    type ResponseDataType = OutputData[typeof inputType];

    return (data: RequestDataType) => this.exports[inputType]<RequestDataType, ResponseDataType>(data);
  }
}

export default ExtensionModuleHandler;
