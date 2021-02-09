import {
  Event,
  EventError,
} from './event';
import {
  Status,
  StatusError,
} from './status';

export enum Message {
  Event = 'Event',

  EventReturn = 'EventReturn',
  EventError = 'EventError',

  Status = 'Status',
  StatusError = 'StatusError',
};

interface MessageBase<D> {
  id: string;
  type: Message;
  data: D;
}

export interface EventMessage<D> extends MessageBase<D> {
  type: Message.Event;
  eventType: Event;
}

export interface EventReturnMessage<D> extends MessageBase<D> {
  type: Message.EventReturn;
  eventType: Event;
}

export interface EventErrorMessage<D> extends MessageBase<D> {
  type: Message.EventError;
  error: EventError;
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
  EventMessage<D>;

export type FromExtensionMessage<D> =
  EventReturnMessage<D> |
  EventErrorMessage<D> |
  StatusMessage<D> |
  ErrorStatusMessage;
