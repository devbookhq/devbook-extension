import {
  Message,
  ToExtensionMessage,
  OutputMessage,
  OutputErrorMessage,
  OutputError,
} from './types';

class OutputHandler<I, O> {
  private hasResponded = false;

  public constructor(private message: ToExtensionMessage<I>) {
    if (message.type !== Message.Input) throw new Error('Message must be of the type request');
  }

  public sendOutput(data: O) {
    if (this.hasResponded) throw new Error('Input message was already responded to.');
    if (!process.send) throw new Error('Process has no parent to send response to.');

    const responseMessage: OutputMessage<O> = {
      id: this.message.id,
      inputType: this.message.inputType,
      type: Message.Output,
      data,
    };
    process.send(responseMessage);
  }

  public sendOutputError<D>(error: OutputError, data: D) {
    if (this.hasResponded) throw new Error('Input message was already responded to.');
    if (!process.send) throw new Error('Process has no parent to send response to.');

    const errorResponse: OutputErrorMessage<D> = {
      id: this.message.id,
      type: Message.OutputError,
      error,
      data,
    };
    process.send(errorResponse);
  }
}

export default OutputHandler;
