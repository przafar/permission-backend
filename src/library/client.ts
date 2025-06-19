import { connect, StringCodec, NatsConnection } from 'nats';
import {
  Module,
  Action,
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

  async grant<M extends Module>(
    req: GrantRequest<M>
  ): Promise<StatusResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.grant',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }

  async revoke<M extends Module>(
    req: RevokeRequest<M>
  ): Promise<StatusResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.revoke',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }

  async check<M extends Module>(
    req: CheckRequest<M>
  ): Promise<CheckResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.check',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }

  async list(
    req: ListRequest
  ): Promise<ListResponse | ErrorPayload> {
    const msg = await this.connection.request(
      'permissions.list',
      sc.encode(JSON.stringify(req))
    );
    return JSON.parse(sc.decode(msg.data));
  }
}

export * from '../types';