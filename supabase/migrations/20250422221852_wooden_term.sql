/*
  # Add Chat Functionality

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamp)
      - `read_at` (timestamp, nullable)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Users can read their own messages
      - Users can send messages
      - Users can mark received messages as read
      - Admins have full access
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  CONSTRAINT messages_content_length CHECK (char_length(content) > 0)
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- Create policies
DO $$
BEGIN
  -- Users can read messages they're involved in
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can read their messages'
  ) THEN
    CREATE POLICY "Users can read their messages"
      ON public.messages
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
      );
  END IF;

  -- Users can send messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can send messages'
  ) THEN
    CREATE POLICY "Users can send messages"
      ON public.messages
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = sender_id);
  END IF;

  -- Users can mark messages as read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can mark messages as read'
  ) THEN
    CREATE POLICY "Users can mark messages as read"
      ON public.messages
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = receiver_id)
      WITH CHECK (auth.uid() = receiver_id);
  END IF;

  -- Admins have full access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Admins have full access'
  ) THEN
    CREATE POLICY "Admins have full access"
      ON public.messages
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND (
            auth.users.raw_user_meta_data->>'is_admin' = 'true'
          )
        )
      );
  END IF;
END
$$;

-- Grant necessary permissions
GRANT ALL ON public.messages TO authenticated;