import { query } from '../db';
import { logger } from '../utils/logger';
import { ServiceError } from '../utils/errors';
import { ErrorCode } from '../utils/errors';

export interface PermissionRow {
  module: string;
  action: string;
}


export async function insertPermission(
  apiKey: string,
  moduleName: string,
  action: string
): Promise<void> {
  const sql = `
    INSERT INTO permissions(api_key, module, action)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
  `;

  try {
    await query(sql, [apiKey, moduleName, action]);
    logger.info({ event: 'db_insert', apiKey, moduleName, action });
  } catch (err: any) {
    logger.error({ event: 'db_insert_error', apiKey, moduleName, action, message: err.message });
    throw new ServiceError(
      ErrorCode.db_error,
      `Не удалось добавить право: ${err.message}`
    );
  }
}


export async function deletePermission(
  apiKey: string,
  moduleName: string,
  action: string
): Promise<void> {
  const sql = `
    DELETE FROM permissions
    WHERE api_key = $1 AND module = $2 AND action = $3
  `;

  try {
    await query(sql, [apiKey, moduleName, action]);
    logger.info({ event: 'db_delete', apiKey, moduleName, action });
  } catch (err: any) {
    logger.error({ event: 'db_delete_error', apiKey, moduleName, action, message: err.message });
    throw new ServiceError(
      ErrorCode.db_error,
      `Не удалось удалить право: ${err.message}`
    );
  }
}


export async function fetchPermissions(
  apiKey: string
): Promise<PermissionRow[]> {
  const sql = `
    SELECT module, action
    FROM permissions
    WHERE api_key = $1
  `;

  try {
    const res = await query<PermissionRow>(sql, [apiKey]);
    logger.info({ event: 'db_fetch', apiKey, count: res.rows.length });
    return res.rows;
  } catch (err: any) {
    logger.error({ event: 'db_fetch_error', apiKey, message: err.message });
    throw new ServiceError(
      ErrorCode.db_error,
      `Не удалось прочитать права из базы: ${err.message}`
    );
  }
}