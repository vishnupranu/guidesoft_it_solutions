/*
  # Create Assignments and Submissions System

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `max_points` (integer)
      - `created_at` (timestamp)

    - `assignment_submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references assignments)
      - `student_id` (uuid, references user_profiles)
      - `submission_text` (text)
      - `file_url` (text)
      - `submitted_at` (timestamp)
      - `grade` (integer, optional)
      - `feedback` (text, optional)
      - `graded_at` (timestamp, optional)
      - `graded_by` (uuid, references user_profiles)

  2. Security
    - Enable RLS on all tables
    - Students can view assignments for enrolled courses
    - Students can submit their own assignments
    - Instructors can grade submissions for their courses
*/

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  due_date timestamptz NOT NULL,
  max_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  submission_text text,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  grade integer,
  feedback text,
  graded_at timestamptz,
  graded_by uuid REFERENCES user_profiles(id),
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Assignments policies
CREATE POLICY "Students can view assignments for enrolled courses"
  ON assignments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE student_id = auth.uid() AND course_id = assignments.course_id
    )
  );

CREATE POLICY "Instructors can manage assignments for their courses"
  ON assignments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = assignments.course_id AND instructor_id = auth.uid()
    )
  );

-- Assignment submissions policies
CREATE POLICY "Students can view their own submissions"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create their own submissions"
  ON assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN enrollments e ON e.course_id = a.course_id
      WHERE a.id = assignment_submissions.assignment_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own submissions"
  ON assignment_submissions FOR UPDATE TO authenticated
  USING (student_id = auth.uid() AND graded_at IS NULL);

CREATE POLICY "Instructors can view submissions for their course assignments"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = assignment_submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can grade submissions for their courses"
  ON assignment_submissions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = assignment_submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );