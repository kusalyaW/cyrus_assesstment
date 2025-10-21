-- Add OAuth support to users table
USE taskmanager;

-- Make password_hash optional for OAuth users
ALTER TABLE users 
  MODIFY password_hash VARCHAR(255) NULL;

-- Add OAuth fields
ALTER TABLE users 
  ADD COLUMN oauth_provider VARCHAR(50) NULL,
  ADD COLUMN oauth_id VARCHAR(255) NULL,
  ADD UNIQUE KEY unique_oauth (oauth_provider, oauth_id);
