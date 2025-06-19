import dotenv from 'dotenv';
dotenv.config();

export const NATS_URL     = process.env.NATS_URL     || 'nats://localhost:4222';
export const POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://postgres:pass@localhost:5432/permissions';
export const KV_BUCKET    = process.env.KV_BUCKET    || 'permissions_cache';

console.log('→ Using POSTGRES_URL =', POSTGRES_URL);
console.log('→ Using NATS_URL     =', NATS_URL);