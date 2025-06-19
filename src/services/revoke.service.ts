import { deletePermission, fetchPermissions } from '../repositories/permissions.repo';
import { setCachedPermissions } from '../cache/permissions.cache';
import { logger } from '../utils/logger';
import { NatsConnection } from 'nats';
import { ErrorPayload, ErrorCode, ServiceError, toErrorPayload } from '../utils/errors';

export async function revokeService(nc: NatsConnection, req: any): Promise<any> {
  try {
    await deletePermission(req.apiKey, req.module, req.action);
    const perms = await fetchPermissions(req.apiKey);
    await setCachedPermissions(nc, req.apiKey, perms);
    logger.info({ event: 'revoke', apiKey: req.apiKey, perms });
    return { status: 'ok' };
  } catch (err: any) {
    logger.error({ event: 'revoke_error', err });
    return toErrorPayload(new ServiceError(ErrorCode.db_error, err.message));
  }
}