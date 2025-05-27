/*
  # Add Delete Policies for All Tables

  1. Changes
    - Add delete policies for all tables
    - Ensure only Admin users can delete records
    - Maintain data integrity through cascading deletes

  2. Security
    - Policies restricted to authenticated users with Admin role
    - Uses user_with_role view for role verification
*/

-- Create delete policy for baptized table
CREATE POLICY "Allow admins to delete baptism records"
ON baptized
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role
    WHERE user_id = auth.uid()
    AND role_name = 'Admin'
  )
);

-- Create delete policy for community table
CREATE POLICY "Allow admins to delete community records"
ON community
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role
    WHERE user_id = auth.uid()
    AND role_name = 'Admin'
  )
);

-- Create delete policy for confirmation table
CREATE POLICY "Allow admins to delete confirmation records"
ON confirmation
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role
    WHERE user_id = auth.uid()
    AND role_name = 'Admin'
  )
);

-- Create delete policy for married table
CREATE POLICY "Allow admins to delete marriage records"
ON married
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role
    WHERE user_id = auth.uid()
    AND role_name = 'Admin'
  )
);