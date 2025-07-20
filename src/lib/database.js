import { supabase } from './supabase'

// Course functions
export const getCourses = async (filters = {}) => {
  let query = supabase
    .from('courses')
    .select(`
      *,
      instructor:user_profiles!instructor_id(full_name),
      category:categories(name),
      enrollments(count),
      course_reviews(rating)
    `)
    .eq('is_published', true)

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category_id', filters.category)
  }

  if (filters.level && filters.level !== 'all') {
    query = query.eq('level', filters.level)
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  return { data, error }
}

export const getCourseById = async (courseId) => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:user_profiles!instructor_id(full_name, avatar_url),
      category:categories(name),
      course_modules(
        *,
        lessons(*)
      ),
      course_reviews(
        *,
        student:user_profiles!student_id(full_name)
      )
    `)
    .eq('id', courseId)
    .single()

  return { data, error }
}

export const enrollInCourse = async (courseId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: user.id,
      course_id: courseId
    })
    .select()

  return { data, error }
}

export const getEnrollments = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(
        *,
        instructor:user_profiles!instructor_id(full_name),
        category:categories(name)
      )
    `)
    .eq('student_id', user.id)

  return { data, error }
}

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return { data, error }
}

// User profile functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()

  return { data, error }
}

// Assignment functions
export const getAssignments = async (courseId = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  let query = supabase
    .from('assignments')
    .select(`
      *,
      course:courses(title),
      assignment_submissions!left(
        id,
        submitted_at,
        grade,
        feedback
      )
    `)

  if (courseId) {
    query = query.eq('course_id', courseId)
  } else {
    // Get assignments for enrolled courses
    query = query.in('course_id', 
      supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user.id)
    )
  }

  const { data, error } = await query.order('due_date')
  return { data, error }
}

// Dashboard stats
export const getDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const userProfile = await getUserProfile(user.id)
  
  if (userProfile.error) return { error: userProfile.error }
  
  const role = userProfile.data.role
  let stats = {}

  if (role === 'student') {
    // Get student stats
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, course:courses(*)')
      .eq('student_id', user.id)

    const { data: completedCourses } = await supabase
      .from('enrollments')
      .select('count')
      .eq('student_id', user.id)
      .not('completed_at', 'is', null)

    stats = {
      enrolledCourses: enrollments?.length || 0,
      completedCourses: completedCourses?.[0]?.count || 0,
      inProgress: (enrollments?.length || 0) - (completedCourses?.[0]?.count || 0),
      certificates: completedCourses?.[0]?.count || 0
    }
  } else if (role === 'instructor') {
    // Get instructor stats
    const { data: courses } = await supabase
      .from('courses')
      .select('*, enrollments(count)')
      .eq('instructor_id', user.id)

    const { data: assignments } = await supabase
      .from('assignments')
      .select('count')
      .in('course_id', courses?.map(c => c.id) || [])

    stats = {
      myCourses: courses?.length || 0,
      students: courses?.reduce((sum, course) => sum + (course.enrollments?.[0]?.count || 0), 0) || 0,
      assignments: assignments?.[0]?.count || 0,
      avgRating: 4.8 // This would be calculated from course reviews
    }
  } else if (role === 'admin') {
    // Get admin stats
    const { data: users } = await supabase
      .from('user_profiles')
      .select('count')

    const { data: courses } = await supabase
      .from('courses')
      .select('count')
      .eq('is_published', true)

    stats = {
      totalUsers: users?.[0]?.count || 0,
      activeCourses: courses?.[0]?.count || 0,
      revenue: '$12,345', // This would be calculated from payments
      completionRate: '87%' // This would be calculated from enrollments
    }
  }

  return { data: stats, error: null }
}