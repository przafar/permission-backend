export * from './permission'
export * from './requests'

export enum ErrorCode {
  apiKey_not_found  = 'apiKey_not_found',
  db_error          = 'db_error',
  cache_error       = 'cache_error',
  invalid_payload   = 'invalid_payload',
  unexpected        = 'unexpected',
}

export interface ErrorPayload {
  error: {
    code: ErrorCode
    message: string
  }
}