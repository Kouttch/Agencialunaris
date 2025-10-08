-- Remove duplicate roles, keeping only the non-'user' role for users with multiple roles
DELETE FROM user_roles
WHERE id IN (
  SELECT ur1.id
  FROM user_roles ur1
  INNER JOIN user_roles ur2 ON ur1.user_id = ur2.user_id
  WHERE ur1.role = 'user' AND ur2.role != 'user'
);

-- Add unique constraint on user_id to prevent multiple roles per user
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);