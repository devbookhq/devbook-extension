import {
  Event,
  EventInput,
  EventOutput,
} from './event';

export enum ExtensionMode {
  Production = 'prod',
  Development = 'dev',
}

export type ExtensionEventHandlers = {
  [Event.onDidQueryChange]: (data: EventInput[Event.onDidQueryChange], extensionMode: ExtensionMode, accessToken?: string) => (Promise<EventOutput[Event.onDidQueryChange]> | EventOutput[Event.onDidQueryChange]);
  [Event.getSources]?: (data: EventInput[Event.getSources], extensionMode: ExtensionMode, accessToken?: string) => (Promise<EventOutput[Event.getSources]> | EventOutput[Event.getSources]);
}

class ExtensionModuleHandler {
  private exports: { [handler in Event]?: <I, O>(data: I, extensionMode: ExtensionMode, accessToken?: string) => Promise<O> | O };

  public constructor(extensionModulePath: string) {
    this.exports = require(extensionModulePath).default;
  }

  public getEventHandler(eventType: Event) {
    type CurrentEventInput = EventInput[typeof eventType];
    type CurrentEventOutput = EventOutput[typeof eventType];

    return (data: CurrentEventInput, extensionMode: ExtensionMode, accessToken?: string) =>
      this.exports[eventType]?.<CurrentEventInput, CurrentEventOutput>(data, extensionMode, accessToken);
  }
}

export default ExtensionModuleHandler;
