ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "last_login_at" timestamp with time zone;

ALTER TABLE "memberships"
ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;
