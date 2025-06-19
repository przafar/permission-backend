import { fetchPermissions } from '../repositories/permissions.repo';
import { getCachedPermissions, setCachedPermissions } from '../cache/permissions.cache';
import { logger } from '../utils/logger';
import { NatsConnection } from 'nats';
import { ErrorPayload, ErrorCode, ServiceError, toErrorPayload } from '../utils/errors';
import { ListResponse } from '../types';

export async function listService(
  nc: NatsConnection,
  req: any
): Promise<ListResponse | ErrorPayload> {
  try {
    // Получаем из кэша (может вернуть null)
    const cached = await getCachedPermissions(nc, req.apiKey);

    // Гарантируем, что perms — массив
    let perms: any[];
    if (cached) {
      perms = cached;
    } else {
      // Если в кэше нет — из БД и сразу кладём в кэш
      perms = await fetchPermissions(req.apiKey);
      await setCachedPermissions(nc, req.apiKey, perms);
      logger.info({ event: 'cache_load', apiKey: req.apiKey, count: perms.length });
    }

    return { permissions: perms };
  } catch (err: any) {
    logger.error({ event: 'list_error', err });
    return toErrorPayload(new ServiceError(ErrorCode.unexpected, err.message));
  }
}