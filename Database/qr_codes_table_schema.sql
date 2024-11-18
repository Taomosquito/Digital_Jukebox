DROP TABLE IF EXISTS qr_codes CASCADE;

CREATE TABLE qr_codes (
  id SERIAL PRIMARY KEY,
  link VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);