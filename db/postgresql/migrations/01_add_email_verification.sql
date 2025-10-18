-- Add email and verification fields to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_verified" BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "verification_token" VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT FALSE;

-- Create indexes
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user"("email");
CREATE INDEX IF NOT EXISTS "user_verification_token_idx" ON "user"("verification_token");

-- Add unique constraint on email
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user"("email") WHERE "email" IS NOT NULL;
