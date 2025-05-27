/*
  # Initial Database Schema Setup

  1. New Tables
    - `waumini` - Stores member information
    - `baptized` - Stores baptism records
    - `community` - Stores community information
    - `confirmation` - Stores confirmation records
    - `married` - Stores marriage records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create waumini table
CREATE TABLE IF NOT EXISTS "waumini" (
  MEMBER_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  NAME text NOT NULL,
  HOUSEHOLD text,
  GENDER text NOT NULL CHECK (GENDER IN ('Male', 'Female')),
  HOUSEHOLD_POSITION text,
  BIRTH_DATE date,
  PHONE_NO text,
  OCCUPATION text,
  RESIDENCE text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_waumini_name ON "waumini"(NAME);
CREATE INDEX idx_waumini_household ON "waumini"(HOUSEHOLD);

-- Create baptized table
CREATE TABLE IF NOT EXISTS "baptized" (
  BAPTISM_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  MEMBER_ID uuid REFERENCES "waumini"(MEMBER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  BAPTIZED text NOT NULL CHECK (BAPTIZED IN ('Yes', 'No')),
  DATE_BAPTIZED date,
  CHURCH_BAPTIZED text,
  BAPTISM_NO text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_baptized_member ON "baptized"(MEMBER_ID);

-- Create community table
CREATE TABLE IF NOT EXISTS "community" (
  COMMUNITY_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  MEMBER_ID uuid REFERENCES "waumini"(MEMBER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  COMMUNITY text,
  ZONE text,
  END_OF_PARISH_MEMBERSHIP date,
  DATE_OF_DEATH date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_community_member ON "community"(MEMBER_ID);
CREATE INDEX idx_community_zone ON "community"(ZONE);

-- Create confirmation table
CREATE TABLE IF NOT EXISTS "confirmation" (
  CONFIRMATION_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  MEMBER_ID uuid REFERENCES "waumini"(MEMBER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONFIRMED text NOT NULL CHECK (CONFIRMED IN ('Yes', 'No')),
  CONFIRMATION_DATE date,
  CHURCH_CONFIRMED text,
  CONFIRMATION_NO text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_confirmation_member ON "confirmation"(MEMBER_ID);

-- Create married table
CREATE TABLE IF NOT EXISTS "married" (
  MARRIAGE_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  MEMBER_ID uuid REFERENCES "waumini"(MEMBER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  MARRIAGE_STATUS text NOT NULL CHECK (MARRIAGE_STATUS IN ('Not Married', 'Married', 'Widowed', 'Divorced', 'Separated')),
  MARRIAGE_DATE date,
  CHURCH_MARRIED text,
  MARRIAGE_NO text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_married_member ON "married"(MEMBER_ID);
CREATE INDEX idx_married_status ON "married"(MARRIAGE_STATUS);

-- Enable Row Level Security
ALTER TABLE "waumini" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "baptized" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "community" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "confirmation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "married" ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DO $$ 
BEGIN
  -- Waumini policies
  EXECUTE 'CREATE POLICY "Enable read access for authenticated users" ON "waumini" FOR SELECT TO authenticated USING (true)';
  EXECUTE 'CREATE POLICY "Enable insert access for authenticated users" ON "waumini" FOR INSERT TO authenticated WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Enable update access for authenticated users" ON "waumini" FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';

  -- Baptized policies
  EXECUTE 'CREATE POLICY "Enable read access for authenticated users" ON "baptized" FOR SELECT TO authenticated USING (true)';
  EXECUTE 'CREATE POLICY "Enable insert access for authenticated users" ON "baptized" FOR INSERT TO authenticated WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Enable update access for authenticated users" ON "baptized" FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';

  -- Community policies
  EXECUTE 'CREATE POLICY "Enable read access for authenticated users" ON "community" FOR SELECT TO authenticated USING (true)';
  EXECUTE 'CREATE POLICY "Enable insert access for authenticated users" ON "community" FOR INSERT TO authenticated WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Enable update access for authenticated users" ON "community" FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';

  -- Confirmation policies
  EXECUTE 'CREATE POLICY "Enable read access for authenticated users" ON "confirmation" FOR SELECT TO authenticated USING (true)';
  EXECUTE 'CREATE POLICY "Enable insert access for authenticated users" ON "confirmation" FOR INSERT TO authenticated WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Enable update access for authenticated users" ON "confirmation" FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';

  -- Married policies
  EXECUTE 'CREATE POLICY "Enable read access for authenticated users" ON "married" FOR SELECT TO authenticated USING (true)';
  EXECUTE 'CREATE POLICY "Enable insert access for authenticated users" ON "married" FOR INSERT TO authenticated WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Enable update access for authenticated users" ON "married" FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
END $$;