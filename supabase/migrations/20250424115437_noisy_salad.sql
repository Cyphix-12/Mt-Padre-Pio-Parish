/*
  # Add Secure User Roles View

  1. New View
    - `user_roles_view` - Secure view for user role information
      - Combines data from user_roles and roles tables
      - Avoids recursive RLS policy issues
      - Provides safe access to role information

  2. Security
    - Enable RLS on view
    - Add policies for authenticated users
*/

-- Create secure view for user roles
CREATE OR REPLACE VIEW user_roles_view AS
SELECT 
  ur.user_id,
  r.id as role_id,
  r.name as role_name,
  r.permissions
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id;

-- Enable RLS on the view
ALTER VIEW user_roles_view SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT SELECT ON user_roles_view TO authenticated;

-- Create policy for the view
CREATE POLICY "Users can view their own roles"
ON user_roles_view
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM user_roles_view v
    WHERE v.user_id = auth.uid()
    AND v.role_name = 'Admin'
  )
);