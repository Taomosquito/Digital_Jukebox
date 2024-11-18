DROP TABLE IF EXISTS administrators CASCADE;

CREATE TABLE administrators (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_digest VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  qr_code_id INTEGER,
  FOREIGN KEY(qr_code_id) REFERENCES qr_codes(id)
);