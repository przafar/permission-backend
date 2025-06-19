import { connect, StringCodec, NatsConnection } from 'nats';
import {
  GrantRequest,
  RevokeRequest,
  CheckRequest,
  ListRequest,
  StatusResponse,
  CheckResponse,
  ListResponse,
  ErrorPayload
} from '../types';

const sc = StringCodec();


export class PermissionsClient {
  private nc?: NatsConnection;

  constructor(private natsUrl: string) {}


  async init(): Promise<void> {
    this.nc = await connect({ servers: this.natsUrl });
  }

  private get connection(): NatsConnection {
    if (!this.nc) {
      throw new Error('NATS connection is not initialized. Call init() first.');
    }
    return this.nc;
  }
  async grant(req: GrantRequest): Promise<StatusResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.grant',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }
  async revoke(req: RevokeRequest): Promise<StatusResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.revoke',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }
  async check(req: CheckRequest): Promise<CheckResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.check',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }
  async list(req: ListRequest): Promise<ListResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.list',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }
}

export * from '../types';