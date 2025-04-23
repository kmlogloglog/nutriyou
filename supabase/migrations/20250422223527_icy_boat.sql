/*
  # Add Chat System

  1. New Tables
    - `messages` for storing chat messages between users and admins
    
  2. Security
    - Enable RLS
    - Add policies for message access
*/

-- Create messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
    CREATE TABLE public.messages (
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
    CREATE INDEX messages_sender_id_idx ON public.messages(sender_id);
    CREATE INDEX messages_receiver_id_idx ON public.messages(receiver_id);
    CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);

    -- Create policies
    CREATE POLICY "Users can read their messages" 
      ON public.messages FOR SELECT 
      TO authenticated 
      USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
      );

    CREATE POLICY "Users can send messages" 
      ON public.messages FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = sender_id);

    CREATE POLICY "Users can mark messages as read" 
      ON public.messages FOR UPDATE 
      TO authenticated 
      USING (auth.uid() = receiver_id)
      WITH CHECK (auth.uid() = receiver_id);

    CREATE POLICY "Admins have full access" 
      ON public.messages FOR ALL 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE id = auth.uid() 
          AND raw_user_meta_data->>'is_admin' = 'true'
        )
      );
  END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.messages TO authenticated;