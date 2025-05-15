/*
  # Add Member Community View

  1. New View
    - `member_community_view` - Shows community and zone information for members
      - Combines data from community and waumini tables
      - Provides easy access to a member's community affiliations
      - Includes zone information for hierarchical organization

  2. Security
    - Enable RLS on view
    - Add policies for authenticated users
*/

-- Create view for member community information
CREATE OR REPLACE VIEW member_community_view AS
SELECT DISTINCT 
  w.member_id,
  w.name,
  c.community,
  c.zone
FROM waumini w
LEFT JOIN community c ON w.member_id = c.member_id
WHERE c.community IS NOT NULL AND c.zone IS NOT NULL;

-- Enable RLS on the view
ALTER VIEW member_community_view SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT SELECT ON member_community_view TO authenticated;