/*
  # User Registration System Schema

  1. Updates
    - Add username field to profiles table
    - Add email verification fields
    - Add rate limiting fields
    - Add security fields

  2. Security
    - Enable RLS
    - Add policies for data access
    - Add constraints and validations
*/

-- Add new fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verification_token text,
ADD COLUMN IF NOT EXISTS email_verification_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_failed_login_at timestamptz,
ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Add username validation
ALTER TABLE profiles
ADD CONSTRAINT username_format CHECK (
  username ~ '^[a-zA-Z0-9_]{3,20}$'
);

-- Create function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Add email validation to auth.users
ALTER TABLE auth.users
ADD CONSTRAINT valid_email CHECK (
  is_valid_email(email)
);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_max_attempts integer DEFAULT 5,
  p_lockout_minutes integer DEFAULT 15
)
RETURNS boolean AS $$
DECLARE
  v_current_attempts integer;
  v_locked_until timestamptz;
BEGIN
  SELECT failed_login_attempts, locked_until
  INTO v_current_attempts, v_locked_until
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user is locked out
  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RETURN false;
  END IF;

  -- Reset attempts if lockout has expired
  IF v_locked_until IS NOT NULL AND v_locked_until <= now() THEN
    UPDATE profiles
    SET failed_login_attempts = 1,
        last_failed_login_at = now(),
        locked_until = NULL
    WHERE id = p_user_id;
    RETURN true;
  END IF;

  -- Increment attempts and check for lockout
  IF v_current_attempts >= p_max_attempts THEN
    UPDATE profiles
    SET locked_until = now() + (p_lockout_minutes || ' minutes')::interval,
        failed_login_attempts = 0
    WHERE id = p_user_id;
    RETURN false;
  END IF;

  -- Increment attempts
  UPDATE profiles
  SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
      last_failed_login_at = now()
  WHERE id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  _name text;
  _username text;
BEGIN
  -- Generate username from email
  _username := split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4);
  
  -- Get the name from metadata or fallback to email
  _name := COALESCE(
    new.raw_user_meta_data->>'name',
    new.email
  );

  -- Insert into profiles with conflict handling
  BEGIN
    INSERT INTO public.profiles (
      id, 
      name,
      username,
      email_verification_token,
      email_verification_sent_at
    )
    VALUES (
      new.id, 
      _name,
      _username,
      encode(gen_random_bytes(32), 'hex'),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        username = EXCLUDED.username;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
  END;

  -- Create default wishlist with conflict handling
  BEGIN
    INSERT INTO public.wishlists (user_id, name, is_public)
    VALUES (new.id, 'Default', false)
    ON CONFLICT (user_id, name) WHERE name = 'Default'
    DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error creating wishlist for user %: %', new.id, SQLERRM;
  END;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Unexpected error in handle_new_user for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verification_token ON profiles(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_profiles_locked_until ON profiles(locked_until);

-- Update RLS policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;