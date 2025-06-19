import { Pool, QueryResult, QueryResultRow } from 'pg';
import { POSTGRES_URL } from './config';

const pool = new Pool({ connectionString: POSTGRES_URL });

export async function query<T extends QueryResultRow = any>
  (
    text: string,
    params?: any[]
  )
  : 
  Promise<QueryResult<T>> {
    try {
      return await pool.query<T>(text, params);
    } catch (err: any) {
      throw new Error('DB_ERROR: ' + err.message);
    }
}