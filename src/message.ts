import {
  Call,
  CallError,
} from './call';
import {
  Status,
  StatusError,
} from './status';

export enum Message {
  Call = 'Call',

  CallReturn = 'CallReturn',
  CallError = 'CallError',

  Status = 'Status',
  StatusError = 'StatusError',
};

interface MessageBase<D> {
  id: string;
  type: Message;
  data: D;
}

export interface CallMessage<D> extends MessageBase<D> {
  type: Message.Call;
  callType: Call;
}

export interface CallReturnMessage<D> extends MessageBase<D> {
  type: Message.CallReturn;
  callType: Call;
}

export interface CallErrorMessage<D> extends MessageBase<D> {
  type: Message.CallError;
  error: CallError;
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
  CallMessage<D>;

export type FromExtensionMessage<D> =
  CallReturnMessage<D> |
  CallErrorMessage<D> |
  StatusMessage<D> |
  ErrorStatusMessage;
