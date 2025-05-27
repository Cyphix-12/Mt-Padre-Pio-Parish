/*
  # Add Delete Policy for Waumini Table

  1. Changes
    - Add policy to allow admin users to delete records
    - Ensure proper RLS for delete operations
    
  2. Security
    - Only admin users can delete records
    - Verify user role through user_with_role view
*/

CREATE POLICY "Enable delete for admin users" 
ON waumini
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_with_role ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_name = 'Admin'
  )
);