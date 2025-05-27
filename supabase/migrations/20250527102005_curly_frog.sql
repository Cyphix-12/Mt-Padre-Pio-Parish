/*
  # Fix Member Details View

  1. Changes
    - Update member_details view to use member_id instead of id
    - Ensure consistent column naming across the view
    - Maintain existing column order and data types

  2. Security
    - Maintain existing RLS policies
    - Keep existing permissions
*/

CREATE OR REPLACE VIEW member_details AS
SELECT 
  w.MEMBER_ID as member_id,
  w.NAME as name,
  w.GENDER as gender,
  w.HOUSEHOLD as household,
  w.HOUSEHOLD_POSITION as household_position,
  w.BIRTH_DATE as birth_date,
  w.PHONE_NO as phone_no,
  w.OCCUPATION as occupation,
  w.RESIDENCE as residence,
  c.COMMUNITY as community,
  c.ZONE as zone,
  b.BAPTIZED as baptized,
  b.DATE_BAPTIZED as date_baptized,
  b.CHURCH_BAPTIZED as church_baptized,
  b.BAPTISM_NO as baptism_no,
  cf.CONFIRMED as confirmed,
  cf.CONFIRMATION_DATE as confirmation_date,
  cf.CHURCH_CONFIRMED as church_confirmed,
  cf.CONFIRMATION_NO as confirmation_no,
  m.MARRIAGE_STATUS as marriage_status,
  m.MARRIAGE_DATE as marriage_date,
  m.CHURCH_MARRIED as church_married,
  m.MARRIAGE_NO as marriage_no
FROM waumini w
LEFT JOIN community c ON w.MEMBER_ID = c.MEMBER_ID
LEFT JOIN baptized b ON w.MEMBER_ID = b.MEMBER_ID
LEFT JOIN confirmation cf ON w.MEMBER_ID = cf.MEMBER_ID
LEFT JOIN married m ON w.MEMBER_ID = m.MEMBER_ID;