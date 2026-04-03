DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'membership_roles'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'membership_roles'
        AND e.enumlabel = 'admin'
    ) THEN
      ALTER TYPE "membership_roles" ADD VALUE 'admin';
    END IF;
  END IF;
END$$;
