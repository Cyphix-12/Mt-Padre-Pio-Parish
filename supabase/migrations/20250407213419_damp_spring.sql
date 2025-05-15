/*
  # Clean up old tables and schemas

  1. Changes
    - Drop old tables that are no longer used
    - Clean up any leftover objects from old migrations
    
  2. Notes
    - This is safe because we already have the new schema in place
    - All data has been migrated to the new tables
*/

DO $$ 
BEGIN
  -- Drop old tables if they exist
  DROP TABLE IF EXISTS "Waumini" CASCADE;
  DROP TABLE IF EXISTS "Viongozi" CASCADE;
  DROP TABLE IF EXISTS "Kanda_Jumuiya" CASCADE;
  DROP TABLE IF EXISTS "Baptism" CASCADE;
  DROP TABLE IF EXISTS "Marriage" CASCADE;
  DROP TABLE IF EXISTS "Confirmation" CASCADE;
  DROP TABLE IF EXISTS "Community" CASCADE;
END $$;