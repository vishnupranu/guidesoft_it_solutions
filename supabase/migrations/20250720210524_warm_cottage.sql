/*
  # Create Enrollments and Progress System

  1. New Tables
    - `enrollments`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `course_id` (uuid, references courses)
      - `enrolled_at` (timestamp)
      - `completed_at` (timestamp, optional)
      - `progress_percentage` (integer, 0-100)

    - `lesson_progress`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `lesson_id` (uuid, references lessons)
      - `completed_at` (timestamp, optional)
      - `time_spent_minutes` (integer)

    - `course_reviews`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `course_id` (uuid, references courses)
      - `rating` (integer, 1-5)
      - `review_text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Students can only see their own enrollments and progress
    - Instructors can see enrollments for their courses
*/

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(student_id, course_id)
);

-- Create lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at timestamptz,
  time_spent_minutes integer DEFAULT 0,
  UNIQUE(student_id, lesson_id)
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Enrollments policies
CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can view enrollments for their courses"
  ON enrollments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = enrollments.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lesson progress policies
CREATE POLICY "Students can manage their own lesson progress"
  ON lesson_progress FOR ALL TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Instructors can view progress for their course lessons"
  ON lesson_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN course_modules cm ON cm.id = l.module_id
      JOIN courses c ON c.id = cm.course_id
      WHERE l.id = lesson_progress.lesson_id AND c.instructor_id = auth.uid()
    )
  );

-- Course reviews policies
CREATE POLICY "Anyone can view course reviews"
  ON course_reviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students can create reviews for enrolled courses"
  ON course_reviews FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE student_id = auth.uid() AND course_id = course_reviews.course_id
    )
  );

CREATE POLICY "Students can update their own reviews"
  ON course_reviews FOR UPDATE TO authenticated
  USING (student_id = auth.uid());