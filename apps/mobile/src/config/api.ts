// API Configuration
// In development, use your PC's local IP (run ipconfig on Windows)
// In production, point to Vercel URL

const DEV_API_URL = 'https://pilota-ja-web.vercel.app'; // Dev also uses Vercel
const PROD_API_URL = 'https://pilota-ja-web.vercel.app'; // Production

// Detect if in development
const isDev = __DEV__;

export const API_URL = isDev ? DEV_API_URL : PROD_API_URL;

export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  
  // Lessons
  lessons: '/api/lessons',
  lessonById: (id: string) => `/api/lessons/${id}`,
  
  // Students
  students: '/api/students',
  studentById: (id: string) => `/api/students/${id}`,
  
  // Instructors
  instructors: '/api/instructors',
  instructorById: (id: string) => `/api/instructors/${id}`,
  
  // Driving Schools
  drivingSchools: '/api/driving-schools',
  drivingSchoolById: (id: string) => `/api/driving-schools/${id}`,
  
  // Upload
  upload: '/api/upload',
  imageById: (id: string) => `/api/images/${id}`,
};
