export enum Message {
  Input = 'Input',

  Output = 'Output',
  OutputError = 'OutputError',

  Status = 'Status',
  StatusError = 'StatusError',
};

interface MessageBase<D> {
  id: string;
  type: Message;
  data: D;
}

export interface InputMessage<D> extends MessageBase<D> {
  type: Message.Input;
  inputType: Input;
}

export interface OutputMessage<D> extends MessageBase<D> {
  type: Message.Output;
  inputType: Input;
}

export interface OutputErrorMessage<D> extends MessageBase<D> {
  type: Message.OutputError;
  error: OutputError;
}

export interface StatusMessage<D> extends Omit<MessageBase<D>, 'id'> {
  type: Message.Status;
  status: Status;
}

export interface ErrorStatusMessage<D = undefined> extends Omit<MessageBase<D>, 'id' | 'data'> {
  type: Message.StatusError;
  error: StatusError;
}

export type ToExtensionMessage<D> =
  InputMessage<D>;

export type FromExtensionMessage<D> =
  OutputMessage<D> |
  OutputErrorMessage<D> |
  StatusMessage<D> |
  ErrorStatusMessage;

export enum Status {
  Ready = 'Ready',
  Exit = 'Exit',
}

export enum OutputError {
  UnknownInputMessage = 'UnknownInputMessage',
  InputHandlingError = 'ErrorHandlingRequest',
}

export enum StatusError {
  CannotLoadExtension = 'CannotLoadExtension',
}

export enum Input {
  Search = 'search',
  GetSources = 'getSources',
}

export interface Source {
  slug: string;
  name: string;
  isIncludedInSearch: boolean;
}

export interface InputData {
  [Input.Search]: { query: string, sources?: Source[] };
  [Input.GetSources]: {};
};

export interface OutputData {
  [Input.Search]: { results: unknown[] };
  [Input.GetSources]: { sources: Source[] };
};

export type ModuleExports = {
  [Input.Search]: (data: InputData[Input.Search]) => (Promise<OutputData[Input.Search]> | OutputData[Input.Search]);
  [Input.GetSources]: (data: InputData[Input.GetSources]) => (Promise<OutputData[Input.GetSources]> | OutputData[Input.GetSources]);
}
