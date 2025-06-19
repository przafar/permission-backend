import { fetchPermissions } from '../repositories/permissions.repo';
import { getCachedPermissions, setCachedPermissions } from '../cache/permissions.cache';
import { logger } from '../utils/logger';
import { NatsConnection } from 'nats';
import { ErrorPayload, ErrorCode, ServiceError, toErrorPayload } from '../utils/errors';

export async function checkService(nc: NatsConnection, req: any): Promise<{ allowed: boolean } | ErrorPayload> {
  try {
    const cached = await getCachedPermissions(nc, req.apiKey);

    let perms: any[];
    if (cached) {
      perms = cached;
    } else {
      perms = await fetchPermissions(req.apiKey);
      await setCachedPermissions(nc, req.apiKey, perms);
      logger.info({ event: 'cache_load', apiKey: req.apiKey, permsCount: perms.length });
    }
    const allowed = perms.some(p => p.module === req.module && p.action === req.action);
    return { allowed };
  } catch (err: any) {
    logger.error({ event: 'check_error', err });
    return toErrorPayload(new ServiceError(ErrorCode.unexpected, err.message));
  }
}