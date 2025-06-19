DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'permissions') THEN
    CREATE DATABASE permissions;
  END IF;
END
$$;