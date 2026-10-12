CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  username VARCHAR NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Applied',
  job_url TEXT,
  location VARCHAR,
  salary VARCHAR,
  applied_at DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);