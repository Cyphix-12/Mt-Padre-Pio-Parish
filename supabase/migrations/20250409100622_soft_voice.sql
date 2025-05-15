/*
  # Add Role Management Policies

  1. Changes
    - Add policies for role management
    - Grant necessary permissions to authenticated users
    - Enable RLS for role-related operations

  2. Security
    - Only admin users can manage roles
    - All authenticated users can view roles
*/

-- Create policy to allow admins to manage roles
CREATE POLICY "Allow admins to manage roles"
ON roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'Admin'
  )
);

-- Create policy to allow all authenticated users to view roles
CREATE POLICY "Allow authenticated users to view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Create policy for user role assignments
CREATE POLICY "Allow admins to manage user roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'Admin'
  )
);

-- Create policy to allow users to view their own roles
CREATE POLICY "Allow users to view their own roles"
ON user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'Admin'
  )
);