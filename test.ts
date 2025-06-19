import 'dotenv/config';
import assert from 'assert';
import { PermissionsClient } from './src/library/client';
import { NATS_URL } from './src/config';

import { Permission } from './src/types/permission';
import {
  GrantRequest,
  CheckRequest,
  ListRequest,
  RevokeRequest,
  StatusResponse,
  CheckResponse,
  ListResponse,
  ErrorPayload,
} from './src/types';

function ensureNoError<T extends object>(res: T | ErrorPayload): asserts res is T {
  if ('error' in res) {
    throw new Error(`${res.error.code}: ${res.error.message}`);
  }
}

async function main() {
  const client = new PermissionsClient(NATS_URL);
  await client.init();

  const apiKey = 'test-key';
  type M = 'TRADES';
  const perm: Permission<M> = {
    module: 'TRADES',
    action: 'create',
  };

  await runStep('grant', async () => {
    const res = await client.grant({ apiKey, ...perm } as GrantRequest<M>);
    ensureNoError<StatusResponse>(res);
    assert.strictEqual(res.status, 'ok');
  });

  await runStep('check granted', async () => {
    const res = await client.check({ apiKey, ...perm } as CheckRequest<M>);
    ensureNoError<CheckResponse>(res);
    assert.strictEqual(res.allowed, true);
  });

  await runStep('list', async () => {
    const res = await client.list({ apiKey } as ListRequest);
    ensureNoError<ListResponse>(res);
    assert.ok(
      res.permissions.some(p => p.module === perm.module && p.action === perm.action)
    );
  });

  await runStep('revoke', async () => {
    const res = await client.revoke({ apiKey, ...perm } as RevokeRequest<M>);
    ensureNoError<StatusResponse>(res);
    assert.strictEqual(res.status, 'ok');
  });

  await runStep('Revoked', async () => {
    const res = await client.check({ apiKey, ...perm } as CheckRequest<M>);
    ensureNoError<CheckResponse>(res);
    assert.strictEqual(res.allowed, false);
  });

}

async function runStep(name: string, fn: () => Promise<void>) {
  process.stdout.write(`Step ${name}`);
  try {
    await fn();
  } catch (err) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});