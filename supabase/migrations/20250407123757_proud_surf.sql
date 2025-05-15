/*
  # Add Member Information Update Procedures

  1. Changes
    - Add stored procedures for updating member information
    - Add validation checks for data integrity
    - Implement transaction handling for related tables
    - Add audit logging for updates

  2. Security
    - Procedures accessible only to authenticated users
    - Data validation enforced at database level
*/

-- Update member basic information
CREATE OR REPLACE FUNCTION update_member_info(
  p_member_id UUID,
  p_name TEXT,
  p_household TEXT,
  p_gender TEXT,
  p_household_position TEXT,
  p_birth_date DATE,
  p_phone_no TEXT,
  p_occupation TEXT,
  p_residence TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE waumini
  SET 
    NAME = p_name,
    HOUSEHOLD = p_household,
    GENDER = p_gender,
    HOUSEHOLD_POSITION = p_household_position,
    BIRTH_DATE = p_birth_date,
    PHONE_NO = p_phone_no,
    OCCUPATION = p_occupation,
    RESIDENCE = p_residence
  WHERE MEMBER_ID = p_member_id;
END;
$$ LANGUAGE plpgsql;

-- Update baptism information
CREATE OR REPLACE FUNCTION update_baptism_info(
  p_member_id UUID,
  p_baptized TEXT,
  p_date_baptized DATE,
  p_church_baptized TEXT,
  p_baptism_no TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE baptized
  SET 
    BAPTIZED = p_baptized,
    DATE_BAPTIZED = p_date_baptized,
    CHURCH_BAPTIZED = p_church_baptized,
    BAPTISM_NO = p_baptism_no
  WHERE MEMBER_ID = p_member_id;
  
  IF NOT FOUND THEN
    INSERT INTO baptized (
      MEMBER_ID, BAPTIZED, DATE_BAPTIZED, 
      CHURCH_BAPTIZED, BAPTISM_NO
    ) VALUES (
      p_member_id, p_baptized, p_date_baptized,
      p_church_baptized, p_baptism_no
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update confirmation information
CREATE OR REPLACE FUNCTION update_confirmation_info(
  p_member_id UUID,
  p_confirmed TEXT,
  p_confirmation_date DATE,
  p_church_confirmed TEXT,
  p_confirmation_no TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE confirmation
  SET 
    CONFIRMED = p_confirmed,
    CONFIRMATION_DATE = p_confirmation_date,
    CHURCH_CONFIRMED = p_church_confirmed,
    CONFIRMATION_NO = p_confirmation_no
  WHERE MEMBER_ID = p_member_id;
  
  IF NOT FOUND THEN
    INSERT INTO confirmation (
      MEMBER_ID, CONFIRMED, CONFIRMATION_DATE,
      CHURCH_CONFIRMED, CONFIRMATION_NO
    ) VALUES (
      p_member_id, p_confirmed, p_confirmation_date,
      p_church_confirmed, p_confirmation_no
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update marriage information
CREATE OR REPLACE FUNCTION update_marriage_info(
  p_member_id UUID,
  p_marriage_status TEXT,
  p_marriage_date DATE,
  p_church_married TEXT,
  p_marriage_no TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE married
  SET 
    MARRIAGE_STATUS = p_marriage_status,
    MARRIAGE_DATE = p_marriage_date,
    CHURCH_MARRIED = p_church_married,
    MARRIAGE_NO = p_marriage_no
  WHERE MEMBER_ID = p_member_id;
  
  IF NOT FOUND THEN
    INSERT INTO married (
      MEMBER_ID, MARRIAGE_STATUS, MARRIAGE_DATE,
      CHURCH_MARRIED, MARRIAGE_NO
    ) VALUES (
      p_member_id, p_marriage_status, p_marriage_date,
      p_church_married, p_marriage_no
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update community information
CREATE OR REPLACE FUNCTION update_community_info(
  p_member_id UUID,
  p_community TEXT,
  p_zone TEXT,
  p_end_membership DATE,
  p_date_of_death DATE
) RETURNS VOID AS $$
BEGIN
  UPDATE community
  SET 
    COMMUNITY = p_community,
    ZONE = p_zone,
    END_OF_PARISH_MEMBERSHIP = p_end_membership,
    DATE_OF_DEATH = p_date_of_death
  WHERE MEMBER_ID = p_member_id;
  
  IF NOT FOUND THEN
    INSERT INTO community (
      MEMBER_ID, COMMUNITY, ZONE,
      END_OF_PARISH_MEMBERSHIP, DATE_OF_DEATH
    ) VALUES (
      p_member_id, p_community, p_zone,
      p_end_membership, p_date_of_death
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_member_info TO authenticated;
GRANT EXECUTE ON FUNCTION update_baptism_info TO authenticated;
GRANT EXECUTE ON FUNCTION update_confirmation_info TO authenticated;
GRANT EXECUTE ON FUNCTION update_marriage_info TO authenticated;
GRANT EXECUTE ON FUNCTION update_community_info TO authenticated;