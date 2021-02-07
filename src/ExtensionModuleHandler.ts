import {
  Call,
  CallInput,
  CallOutput,
} from './call';

export type ExtensionExports = {
  [Call.Search]: (data: CallInput[Call.Search]) => (Promise<CallOutput[Call.Search]> | CallOutput[Call.Search]);
  [Call.GetSources]: (data: CallInput[Call.GetSources]) => (Promise<CallOutput[Call.GetSources]> | CallOutput[Call.GetSources]);
}

class ExtensionModuleHandler {
  private exports: { [handler in Call]: <I, O>(data: I) => Promise<O> | O };

  public constructor(extensionModulePath: string) {
    this.exports = require(extensionModulePath);
  }

  public getCallHandler(callType: Call) {
    type CurrentCallInput = CallInput[typeof callType];
    type CurrentCallOutput = CallOutput[typeof callType];

    return (data: CurrentCallInput) => this.exports[callType]<CurrentCallInput, CurrentCallOutput>(data);
  }
}

export default ExtensionModuleHandler;
