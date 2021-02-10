import { Source } from './source';

// Enum values here are the exact names of functions that should be exported from the extension's code
export enum Event {
  onDidQueryChange = 'onDidQueryChange',
  getSources = 'getSources',
}

export enum EventError {
  UnknownEvent = 'UnknownEvent',
  EventError = 'EventError',
}

export interface EventInput {
  [Event.onDidQueryChange]: { query: string, sources?: Source[] };
  [Event.getSources]: {};
};

export interface Result {
  id: string;
  data: {
    title: string;
    body: string;
  }
}

export interface EventOutput {
  [Event.onDidQueryChange]: { results: Result[] };
  [Event.getSources]: { sources: Source[] };
};
