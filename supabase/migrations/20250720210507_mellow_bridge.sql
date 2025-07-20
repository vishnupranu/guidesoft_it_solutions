/*
  # Create Courses System

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)

    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor_id` (uuid, references user_profiles)
      - `category_id` (uuid, references categories)
      - `level` (enum: beginner, intermediate, advanced)
      - `price` (decimal)
      - `duration_hours` (integer)
      - `thumbnail_url` (text)
      - `is_published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, references course_modules)
      - `title` (text)
      - `content` (text)
      - `video_url` (text)
      - `duration_minutes` (integer)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role
*/

-- Create enums
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  level course_level NOT NULL DEFAULT 'beginner',
  price decimal(10,2) DEFAULT 0,
  duration_hours integer DEFAULT 0,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "Instructors can view their own courses"
  ON courses FOR SELECT TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (
    instructor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update their own courses"
  ON courses FOR UPDATE TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course modules policies
CREATE POLICY "Anyone can view modules of published courses"
  ON course_modules FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id AND is_published = true
    )
  );

CREATE POLICY "Instructors can manage their course modules"
  ON course_modules FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id AND instructor_id = auth.uid()
    )
  );

-- Lessons policies
CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = lessons.module_id AND c.is_published = true
    )
  );

CREATE POLICY "Instructors can manage their course lessons"
  ON lessons FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = lessons.module_id AND c.instructor_id = auth.uid()
    )
  );