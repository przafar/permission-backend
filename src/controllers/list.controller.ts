import { StringCodec, Msg, NatsConnection } from 'nats';
import { listService } from '../services/list.service';
import { toErrorPayload, ErrorCode } from '../utils/errors';

const sc = StringCodec();

export async function handleList(nc: NatsConnection, msg: Msg) {
  let req: any;
  try {
    req = JSON.parse(sc.decode(msg.data));
  } catch {
    return msg.respond(sc.encode(JSON.stringify(
      toErrorPayload(new Error(ErrorCode.invalid_payload) as any)
    )));
  }

  try {
    const resp = await listService(nc, req);
    msg.respond(sc.encode(JSON.stringify(resp)));
  } catch (err: any) {
    msg.respond(sc.encode(JSON.stringify(
      toErrorPayload(new Error(err.message) as any)
    )));
  }
}