/*
  # Smart Todo List Database Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `category` (text, default 'Work')
      - `priority` (text, default 'medium')
      - `deadline` (date)
      - `status` (text, default 'pending')
      - `user_id` (uuid, references auth.users)
      - `context_id` (uuid, optional reference to contexts)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contexts`
      - `id` (uuid, primary key)
      - `content` (text, required)
      - `source_type` (text, required)
      - `processed_at` (timestamp)
      - `extracted_tasks` (integer, default 0)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'Work',
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  deadline date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  context_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contexts table
CREATE TABLE IF NOT EXISTS contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('email', 'message', 'note', 'meeting')),
  processed_at timestamptz DEFAULT now(),
  extracted_tasks integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for context_id in tasks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_context_id_fkey'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_context_id_fkey 
    FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for contexts
CREATE POLICY "Users can read own contexts"
  ON contexts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contexts"
  ON contexts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contexts"
  ON contexts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contexts"
  ON contexts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_deadline_idx ON tasks(deadline);
CREATE INDEX IF NOT EXISTS contexts_user_id_idx ON contexts(user_id);
CREATE INDEX IF NOT EXISTS contexts_source_type_idx ON contexts(source_type);

-- Create updated_at trigger for tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();