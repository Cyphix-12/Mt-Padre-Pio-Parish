/*
  # Add Delete Policy for Waumini Table

  1. Changes
    - Add RLS policy for delete operations on waumini table
    - Only allow Admin users to delete records
    - Ensure cascading deletes work properly

  2. Security
    - Policy checks user role through user_with_role view
    - Only Admin role can delete records
*/

-- Create policy to allow admins to delete records
CREATE POLICY "Allow admins to delete records"
ON waumini
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role
    WHERE user_id = auth.uid()
    AND role_name = 'Admin'
  )
);