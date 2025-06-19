import { insertPermission, fetchPermissions } from '../repositories/permissions.repo';
import { setCachedPermissions } from '../cache/permissions.cache';
import { logger } from '../utils/logger';
import { NatsConnection } from 'nats';
import { ErrorCode, ServiceError, toErrorPayload } from '../utils/errors';

export async function grantService(nc: NatsConnection, req: any): Promise<any> {
  try {
    await insertPermission(req.apiKey, req.module, req.action);
    const perms = await fetchPermissions(req.apiKey);
    await setCachedPermissions(nc, req.apiKey, perms);
    logger.info({ event: 'grant', apiKey: req.apiKey, perms });
    return { status: 'ok' };
  } catch (err: any) {
    logger.error({ event: 'grant_error', err });
    return toErrorPayload(new ServiceError(ErrorCode.db_error, err.message));
  }
}