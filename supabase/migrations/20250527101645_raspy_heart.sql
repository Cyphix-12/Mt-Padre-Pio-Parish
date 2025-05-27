/*
  # Add Member Details View

  1. New View
    - `member_details` - Comprehensive view of member information
      - Combines data from waumini, baptized, confirmation, married, and community tables
      - Provides a single source for all member information
      - Optimized for efficient querying

  2. Security
    - Enable RLS on view
    - Add policies for authenticated users
*/

-- Create comprehensive member details view
CREATE OR REPLACE VIEW member_details AS
SELECT 
  w.member_id as id,
  w.name,
  w.gender,
  w.birth_date,
  w.residence,
  w.phone_no,
  w.occupation,
  w.household,
  w.household_position,
  c.community,
  c.zone,
  b.baptized,
  b.date_baptized,
  b.baptism_no,
  b.church_baptized,
  cf.confirmed,
  cf.confirmation_date,
  cf.confirmation_no,
  cf.church_confirmed,
  m.marriage_status,
  m.marriage_date,
  m.marriage_no,
  m.church_married,
  w.created_at
FROM waumini w
LEFT JOIN community c ON w.member_id = c.member_id
LEFT JOIN baptized b ON w.member_id = b.member_id
LEFT JOIN confirmation cf ON w.member_id = cf.member_id
LEFT JOIN married m ON w.member_id = m.member_id;

-- Enable RLS on the view
ALTER VIEW member_details SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT SELECT ON member_details TO authenticated;

-- Create policy for the view
CREATE POLICY "Enable read access for authenticated users"
ON member_details
FOR SELECT
TO authenticated
USING (true);