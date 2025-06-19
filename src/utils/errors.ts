export enum ErrorCode {
  apiKey_not_found = 'apiKey_not_found',
  db_error         = 'db_error',
  cache_error      = 'cache_error',
  invalid_payload  = 'invalid_payload',
  unexpected       = 'unexpected'
}
export interface ErrorPayload {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export class ServiceError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message);
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

export function toErrorPayload(err: ServiceError): ErrorPayload {
  return {
    error: {
      code: err.code,
      message: err.message
    }
  };
}