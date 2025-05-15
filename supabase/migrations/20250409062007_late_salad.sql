/*
  # User Management System

  1. New Tables
    - `roles` - Stores user role definitions
      - `id` (uuid, primary key)
      - `name` (text) - Role name (Admin, Community Leader, Leader)
      - `description` (text)
      - `permissions` (jsonb) - Role permissions
      - `created_at` (timestamp)

    - `user_roles` - Links users to roles
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `role_id` (uuid) - References roles
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for role-based access
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('Admin', 'Full system access', '{
    "users": {"create": true, "read": true, "update": true, "delete": true},
    "roles": {"create": true, "read": true, "update": true, "delete": true},
    "members": {"create": true, "read": true, "update": true, "delete": true}
  }'),
  ('Community Leader', 'Member management access', '{
    "users": {"create": false, "read": false, "update": false, "delete": false},
    "roles": {"create": false, "read": false, "update": false, "delete": false},
    "members": {"create": true, "read": true, "update": true, "delete": false}
  }'),
  ('Leader', 'Read-only access', '{
    "users": {"create": false, "read": false, "update": false, "delete": false},
    "roles": {"create": false, "read": false, "update": false, "delete": false},
    "members": {"create": false, "read": true, "update": false, "delete": false}
  }');

-- Policies for roles table
CREATE POLICY "Allow admin full access to roles"
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

CREATE POLICY "Allow all users to view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_roles table
CREATE POLICY "Allow admin full access to user_roles"
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

CREATE POLICY "Allow users to view their own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());