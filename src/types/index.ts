export interface GrantRequest  { apiKey: string; module: string; action: string; }
export interface RevokeRequest { apiKey: string; module: string; action: string; }
export interface CheckRequest  { apiKey: string; module: string; action: string; }
export interface ListResponse   { permissions: { module: string; action: string }[]; }
export interface ErrorPayload { error: { code: ErrorCode; message: string } }
export interface ListRequest   { apiKey: string; }
export interface StatusResponse { status: 'ok'; }
export interface CheckResponse  { allowed: boolean; }
export enum ErrorCode {
  apiKey_not_found  = 'apiKey_not_found',
  db_error          = 'db_error',
  cache_error       = 'cache_error',
  invalid_payload   = 'invalid_payload',
  unexpected        = 'unexpected',
}