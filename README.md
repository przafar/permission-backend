## Permission-Backend Microservice

This repository contains a Node.js + TypeScript microservice for managing API key permissions via RPC over NATS.io, with PostgreSQL as storage and NATS Key-Value for caching.

### Run with Docker

1. **Start dependencies and service**

   ```bash
   docker compose up -d
   ```

### Smoke Test


```bash
docker exec -it permission-backend-app npx ts-node test.ts
```

