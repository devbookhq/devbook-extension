import { Source } from './source';

// Enum values here are the exact names of functions that should be exported from the extension's code
export enum Call {
  Search = 'search',
  GetSources = 'getSources',
}

export enum CallError {
  UnknownCall = 'UnknownCall',
  CallHandlingError = 'CallHandlingError',
}

export interface CallInput {
  [Call.Search]: { query: string, sources?: Source[] };
  [Call.GetSources]: {};
};

export interface CallOutput {
  [Call.Search]: { results: unknown[] };
  [Call.GetSources]: { sources: Source[] };
};
