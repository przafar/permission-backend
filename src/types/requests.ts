
import { Module, Action, Permission } from './permission';
import { ErrorCode } from './index';

export interface GrantRequest<M extends Module = Module> {
  apiKey: string;
  module: M;
  action: Action<M>;
}

export interface RevokeRequest<M extends Module = Module> {
  apiKey: string;
  module: M;
  action: Action<M>;
}

export interface CheckRequest<M extends Module = Module> {
  apiKey: string;
  module: M;
  action: Action<M>;
}

export interface ListRequest {
  apiKey: string;
}

export interface ListResponse {
  permissions: Permission[];
}

export interface StatusResponse { 
  status: 'ok' 
}
export interface CheckResponse  {
  allowed: boolean 
}
export interface ErrorPayload {
  error: { 
    code: ErrorCode; 
    message: string 
  };
}