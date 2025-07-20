/*
  # Create Calendar and Events System

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `event_type` (enum: class, assignment, exam, meeting)
      - `course_id` (uuid, references courses, optional)
      - `created_by` (uuid, references user_profiles)
      - `is_public` (boolean)
      - `created_at` (timestamp)

    - `event_attendees`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references user_profiles)
      - `status` (enum: invited, accepted, declined)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can view public events and events they're invited to
    - Users can create events and invite others
*/

-- Create enums
CREATE TYPE event_type AS ENUM ('class', 'assignment', 'exam', 'meeting', 'other');
CREATE TYPE attendance_status AS ENUM ('invited', 'accepted', 'declined');

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  event_type event_type DEFAULT 'other',
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_by uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  status attendance_status DEFAULT 'invited',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view public events"
  ON events FOR SELECT TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view events they created"
  ON events FOR SELECT TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view events they're invited to"
  ON events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_attendees
      WHERE event_id = events.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view course events for enrolled courses"
  ON events FOR SELECT TO authenticated
  USING (
    course_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE course_id = events.course_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events"
  ON events FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- Event attendees policies
CREATE POLICY "Users can view attendees of events they can see"
  ON event_attendees FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE id = event_attendees.event_id AND (
        is_public = true OR
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM event_attendees ea2
          WHERE ea2.event_id = events.id AND ea2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Event creators can manage attendees"
  ON event_attendees FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE id = event_attendees.event_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own attendance status"
  ON event_attendees FOR UPDATE TO authenticated
  USING (user_id = auth.uid());