/*
  # Add Views and Functions for Church Management

  1. New Views
    - `member_details` - Comprehensive view of member information
    - `community_summary` - Summary of communities and their members
    - `sacrament_status` - Members' sacramental status with residence information

  2. New Functions
    - `get_community_members` - Get members of a specific community
    - `get_zone_statistics` - Get statistics for a specific zone
    - `search_members` - Search members by various criteria

  3. Security
    - Enable RLS on views
    - Grant appropriate permissions to authenticated users
*/

-- Create comprehensive member details view
CREATE OR REPLACE VIEW member_details AS
SELECT 
  w.MEMBER_ID,
  w.NAME,
  w.GENDER,
  w.HOUSEHOLD,
  w.HOUSEHOLD_POSITION,
  w.BIRTH_DATE,
  w.PHONE_NO,
  w.OCCUPATION,
  w.RESIDENCE,
  c.COMMUNITY,
  c.ZONE,
  b.BAPTIZED,
  b.DATE_BAPTIZED,
  b.CHURCH_BAPTIZED,
  cf.CONFIRMED,
  cf.CONFIRMATION_DATE,
  cf.CHURCH_CONFIRMED,
  m.MARRIAGE_STATUS,
  m.MARRIAGE_DATE,
  m.CHURCH_MARRIED
FROM waumini w
LEFT JOIN community c ON w.MEMBER_ID = c.MEMBER_ID
LEFT JOIN baptized b ON w.MEMBER_ID = b.MEMBER_ID
LEFT JOIN confirmation cf ON w.MEMBER_ID = cf.MEMBER_ID
LEFT JOIN married m ON w.MEMBER_ID = m.MEMBER_ID;

-- Create community summary view
CREATE OR REPLACE VIEW community_summary AS
SELECT 
  c.COMMUNITY,
  c.ZONE,
  COUNT(DISTINCT w.MEMBER_ID) as total_members,
  COUNT(DISTINCT CASE WHEN b.BAPTIZED = 'Yes' THEN w.MEMBER_ID END) as baptized_members,
  COUNT(DISTINCT CASE WHEN cf.CONFIRMED = 'Yes' THEN w.MEMBER_ID END) as confirmed_members,
  COUNT(DISTINCT CASE WHEN m.MARRIAGE_STATUS = 'Married' THEN w.MEMBER_ID END) as married_members
FROM community c
LEFT JOIN waumini w ON c.MEMBER_ID = w.MEMBER_ID
LEFT JOIN baptized b ON w.MEMBER_ID = b.MEMBER_ID
LEFT JOIN confirmation cf ON w.MEMBER_ID = cf.MEMBER_ID
LEFT JOIN married m ON w.MEMBER_ID = m.MEMBER_ID
GROUP BY c.COMMUNITY, c.ZONE;

-- Create sacrament status view with residence
CREATE OR REPLACE VIEW sacrament_status AS
SELECT 
  w.member_id,
  w.name,
  w.gender,
  w.residence,
  c.community,
  c.zone,

  -- Normalize baptism status
  CASE 
    WHEN b.baptized IS NOT NULL AND b.baptized = 'Yes' THEN 'Yes'
    ELSE 'No'
  END AS baptism_status,

  -- Normalize confirmation status
  CASE 
    WHEN cf.confirmed IS NOT NULL AND cf.confirmed = 'Yes' THEN 'Yes'
    ELSE 'No'
  END AS confirmation_status,

  -- Normalize marriage status
  CASE 
    WHEN m.marriage_status IS NULL THEN 'Not Married'
    WHEN m.marriage_status IN ('Married', 'Not Married', 'Divorced', 'Separated', 'Widowed') THEN m.marriage_status
    ELSE 'Not Married'
  END AS marriage_status

FROM waumini w
LEFT JOIN community c ON w.member_id = c.member_id
LEFT JOIN baptized b ON w.member_id = b.member_id
LEFT JOIN confirmation cf ON w.member_id = cf.member_id
LEFT JOIN married m ON w.member_id = m.member_id;


-- Function to get community members
CREATE OR REPLACE FUNCTION get_community_members(p_community TEXT)
RETURNS TABLE (
  member_id UUID,
  name TEXT,
  gender TEXT,
  household TEXT,
  baptized TEXT,
  confirmed TEXT,
  marriage_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.MEMBER_ID,
    w.NAME,
    w.GENDER,
    w.HOUSEHOLD,
    COALESCE(b.BAPTIZED, 'No') as baptized,
    COALESCE(cf.CONFIRMED, 'No') as confirmed,
    COALESCE(m.MARRIAGE_STATUS, 'Not Married') as marriage_status
  FROM waumini w
  JOIN community c ON w.MEMBER_ID = c.MEMBER_ID
  LEFT JOIN baptized b ON w.MEMBER_ID = b.MEMBER_ID
  LEFT JOIN confirmation cf ON w.MEMBER_ID = cf.MEMBER_ID
  LEFT JOIN married m ON w.MEMBER_ID = m.MEMBER_ID
  WHERE c.COMMUNITY = p_community;
END;
$$ LANGUAGE plpgsql;

-- Function to get zone statistics
CREATE OR REPLACE FUNCTION get_zone_statistics(p_zone TEXT)
RETURNS TABLE (
  community TEXT,
  total_members BIGINT,
  baptized_members BIGINT,
  confirmed_members BIGINT,
  married_members BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.COMMUNITY,
    COUNT(DISTINCT w.MEMBER_ID) as total_members,
    COUNT(DISTINCT CASE WHEN b.BAPTIZED = 'Yes' THEN w.MEMBER_ID END) as baptized_members,
    COUNT(DISTINCT CASE WHEN cf.CONFIRMED = 'Yes' THEN w.MEMBER_ID END) as confirmed_members,
    COUNT(DISTINCT CASE WHEN m.MARRIAGE_STATUS = 'Married' THEN w.MEMBER_ID END) as married_members
  FROM community c
  LEFT JOIN waumini w ON c.MEMBER_ID = w.MEMBER_ID
  LEFT JOIN baptized b ON w.MEMBER_ID = b.MEMBER_ID
  LEFT JOIN confirmation cf ON w.MEMBER_ID = cf.MEMBER_ID
  LEFT JOIN married m ON w.MEMBER_ID = m.MEMBER_ID
  WHERE c.ZONE = p_zone
  GROUP BY c.COMMUNITY;
END;
$$ LANGUAGE plpgsql;

-- Function to search members
CREATE OR REPLACE FUNCTION search_members(
  p_name TEXT DEFAULT NULL,
  p_community TEXT DEFAULT NULL,
  p_zone TEXT DEFAULT NULL,
  p_baptized TEXT DEFAULT NULL,
  p_confirmed TEXT DEFAULT NULL,
  p_marriage_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  member_id UUID,
  name TEXT,
  gender TEXT,
  community TEXT,
  zone TEXT,
  baptism_status TEXT,
  confirmation_status TEXT,
  marriage_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM sacrament_status
  WHERE 
    (p_name IS NULL OR name ILIKE '%' || p_name || '%') AND
    (p_community IS NULL OR community = p_community) AND
    (p_zone IS NULL OR zone = p_zone) AND
    (p_baptized IS NULL OR LOWER(baptism_status) = LOWER(p_baptized)) AND
    (p_confirmed IS NULL OR LOWER(confirmation_status) = LOWER(p_confirmed)) AND
    (p_marriage_status IS NULL OR LOWER(marriage_status) = LOWER(p_marriage_status));
END;
$$ LANGUAGE plpgsql;


-- Enable RLS on views
ALTER VIEW member_details SECURITY INVOKER;
ALTER VIEW community_summary SECURITY INVOKER;
ALTER VIEW sacrament_status SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT SELECT ON member_details TO authenticated;
GRANT SELECT ON community_summary TO authenticated;
GRANT SELECT ON sacrament_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_community_members TO authenticated;
GRANT EXECUTE ON FUNCTION get_zone_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION search_members TO authenticated;