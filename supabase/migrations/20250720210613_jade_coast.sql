/*
  # Insert Sample Data for LMS Platform

  1. Sample Categories
  2. Sample Courses
  3. Sample Course Content
  4. Sample Enrollments
*/

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Web Development', 'Frontend and backend web development courses'),
  ('Mobile Development', 'iOS, Android, and cross-platform mobile app development'),
  ('Data Science', 'Data analysis, machine learning, and artificial intelligence'),
  ('Design', 'UI/UX design, graphic design, and digital art'),
  ('Business', 'Marketing, management, and entrepreneurship'),
  ('Programming', 'General programming languages and computer science')
ON CONFLICT (name) DO NOTHING;

-- Note: Sample courses and other data will be created through the application
-- since they require actual user IDs from the auth system