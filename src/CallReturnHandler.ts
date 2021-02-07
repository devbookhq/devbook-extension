import { CallError } from './call';
import {
  Message,
  ToExtensionMessage,
  CallReturnMessage,
  CallErrorMessage,
} from './message';

class CallReturnHandler<I, O> {
  private hasReturned = false;

  public constructor(private message: ToExtensionMessage<I>) {
    if (message.type !== Message.Call) throw new Error('Message must be of the type `Message.Call`.');
  }

  public sendCallReturn(data: O) {
    if (this.hasReturned) throw new Error('Call message already returned a result.');
    if (!process.send) throw new Error('Process has no parent to send result to.');

    const returnMessage: CallReturnMessage<O> = {
      id: this.message.id,
      callType: this.message.callType,
      type: Message.CallReturn,
      data,
    };
    process.send(returnMessage);
  }

  public sendCallError<D>(error: CallError, data: D) {
    if (this.hasReturned) throw new Error('Call message already returned a result.');
    if (!process.send) throw new Error('Process has no parent to send error to.');

    const callErrorMessage: CallErrorMessage<D> = {
      id: this.message.id,
      type: Message.CallError,
      error,
      data,
    };
    process.send(callErrorMessage);
  }
}

export default CallReturnHandler;
