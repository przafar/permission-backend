import 'dotenv/config';
import assert from 'assert';
import { PermissionsClient } from './src/library/client';
import { NATS_URL } from './src/config';

type Permission = { apiKey: string; module: string; action: string; };

async function main() {


  const client = new PermissionsClient(NATS_URL);
  await client.init();

  const apiKey = 'test-key';
  const perm = { module: 'm', action: 'a' } as Omit<Permission, 'apiKey'>;

  await runStep('grant', async () => {
    const res = await client.grant({ apiKey, ...perm });
    console.log('  Response:', res);
    assert.strictEqual((res as any).status, 'ok');
  });

  await runStep('check granted', async () => {
    const res = await client.check({ apiKey, ...perm });
    console.log('Response:', res);
    assert.strictEqual((res as any).allowed, true);
  });

  await runStep('list', async () => {
    const res = await client.list({ apiKey });
    console.log('Response:', res);
    const list = (res as any).permissions as { module: string; action: string }[];
    assert.ok(list.some(p => p.module === perm.module && p.action === perm.action));
  });

  await runStep('revoke', async () => {
    const res = await client.revoke({ apiKey, ...perm });
    console.log('  Response:', res);
    assert.strictEqual((res as any).status, 'ok');
  });

  await runStep('Revoked', async () => {
    const res = await client.check({ apiKey, ...perm });
    console.log('  Response:', res);
    assert.strictEqual((res as any).allowed, false);
  });

  console.log('\nAll tests passed');
}

async function runStep(name: string, fn: () => Promise<void>) {
  process.stdout.write(`Step "${name}": `);
  try {
    await fn();
    console.log('ok');
  } catch (error) {
    console.log('failed');
    console.error(`Error "${name}":`, error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});