import { connect, StringCodec, NatsConnection, Msg } from 'nats';
import { handleGrant }  from './controllers/grant.controller';
import { handleRevoke } from './controllers/revoke.controller';
import { handleCheck }  from './controllers/check.controller';
import { handleList }   from './controllers/list.controller';
import { NATS_URL }     from './config';

async function main() {
  const nc: NatsConnection = await connect({ servers: NATS_URL });
  const sc = StringCodec();

  (async () => {
    const sub = nc.subscribe('permissions.grant');
    for await (const msg of sub) {
      await handleGrant(nc, msg);
    }
  })();

  (async () => {
    const sub = nc.subscribe('permissions.revoke');
    for await (const msg of sub) {
      await handleRevoke(nc, msg);
    }
  })();

  (async () => {
    const sub = nc.subscribe('permissions.check');
    for await (const msg of sub) {
      await handleCheck(nc, msg);
    }
  })();

  (async () => {
    const sub = nc.subscribe('permissions.list');
    for await (const msg of sub) {
      await handleList(nc, msg);
    }
  })();

  console.log('Permissions service started');
}

main().catch(err => {
  console.error('Fatal error starting service:', err);
  process.exit(1);
});