import {
  Event,
  EventInput,
  EventOutput,
} from './event';

export type ExtensionEventHandlers = {
  [Event.onDidQueryChange]: (data: EventInput[Event.onDidQueryChange]) => (Promise<EventOutput[Event.onDidQueryChange]> | EventOutput[Event.onDidQueryChange]);
  [Event.getSources]?: (data: EventInput[Event.getSources]) => (Promise<EventOutput[Event.getSources]> | EventOutput[Event.getSources]);
}

class ExtensionModuleHandler {
  private exports: { [handler in Event]: <I, O>(data: I) => Promise<O> | O };

  public constructor(extensionModulePath: string) {
    this.exports = require(extensionModulePath).default;
  }

  public getEventHandler(eventType: Event) {
    type CurrentEventInput = EventInput[typeof eventType];
    type CurrentEventOutput = EventOutput[typeof eventType];

    return (data: CurrentEventInput) => this.exports[eventType]<CurrentEventInput, CurrentEventOutput>(data);
  }
}

export default ExtensionModuleHandler;
