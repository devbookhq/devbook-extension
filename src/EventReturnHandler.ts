import { EventError } from './event';
import {
  Message,
  ToExtensionMessage,
  EventReturnMessage,
  EventErrorMessage,
} from './message';

class EventReturnHandler<I, O> {
  private hasReturned = false;

  public constructor(private message: ToExtensionMessage<I>) {
    if (message.type !== Message.Event) throw new Error('Message must be of the type `Message.Event`.');
  }

  public sendReturn(data: O) {
    if (this.hasReturned) throw new Error('Event message already returned a result.');
    if (!process.send) throw new Error('Process has no parent to send result to.');

    const returnMessage: EventReturnMessage<O> = {
      id: this.message.id,
      eventType: this.message.eventType,
      type: Message.EventReturn,
      data,
    };
    process.send(returnMessage);
  }

  public sendError<D>(error: EventError, data: D) {
    if (this.hasReturned) throw new Error('Event message already returned a result.');
    if (!process.send) throw new Error('Process has no parent to send error to.');

    const eventError: EventErrorMessage<D> = {
      id: this.message.id,
      type: Message.EventError,
      error,
      data,
    };
    process.send(eventError);
  }
}

export default EventReturnHandler;
