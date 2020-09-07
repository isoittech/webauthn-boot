-- User table  --
CREATE TABLE m_user (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  email VARCHAR(64) NOT NULL UNIQUE,
  challenge VARCHAR(128) NOT NULL,
  rp_name VARCHAR(64) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  attestation VARCHAR(64) NOT NULL,
  authenticator VARCHAR(10240),
  primary key(id)
);
