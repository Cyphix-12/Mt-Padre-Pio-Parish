/*
  # Add User With Role View

  1. New View
    - `user_with_role` - Comprehensive view combining user and role information
      - Includes user details from auth.users
      - Includes role information from roles table
      - Provides easy access to user role data
      - Avoids recursive RLS issues

  2. Security
    - Enable RLS on view
    - Add policies for authenticated users
*/

-- Create view for user role information
CREATE OR REPLACE VIEW user_with_role AS
SELECT 
  au.id as user_id,
  au.email,
  au.created_at as user_created_at,
  r.id as role_id,
  r.name as role_name,
  r.description as role_description,
  r.permissions as role_permissions
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id;

-- Enable RLS on the view
ALTER VIEW user_with_role SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT SELECT ON user_with_role TO authenticated;

-- Create policy for the view
CREATE POLICY "Users can view their own data and admins can view all"
ON user_with_role
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'Admin'
  )
);