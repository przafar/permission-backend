
DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'user') THEN
    CREATE ROLE "user" WITH LOGIN PASSWORD 'pass';
  END IF;
END
$$;

\connect permissions

GRANT ALL PRIVILEGES ON DATABASE permissions TO "user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";

CREATE TABLE IF NOT EXISTS permissions (
  api_key VARCHAR NOT NULL,
  module  VARCHAR NOT NULL,
  action  VARCHAR NOT NULL,
  PRIMARY KEY (api_key, module, action)
);