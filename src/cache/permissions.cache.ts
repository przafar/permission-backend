import { JSONCodec, NatsConnection } from 'nats';
import { KV_BUCKET } from '../config';

const codec = JSONCodec<any[]>();

export async function getCachedPermissions(
  nc: NatsConnection,
  apiKey: string
): Promise<any[] | null> {
  const js = nc.jetstream();
  const kv = await js.views.kv(KV_BUCKET);

  const entry = await kv.get(apiKey);
  if (!entry) return null;

  return codec.decode(entry.value);
}

export async function setCachedPermissions(
  nc: NatsConnection,
  apiKey: string,
  perms: any[]
): Promise<void> {
  const js = nc.jetstream();
  const kv = await js.views.kv(KV_BUCKET);

  await kv.put(apiKey, codec.encode(perms));
}