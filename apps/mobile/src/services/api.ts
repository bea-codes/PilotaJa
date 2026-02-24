import { API_URL, API_ENDPOINTS } from '../config/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== LESSONS ====================

export type Lesson = {
  _id: string;
  drivingSchoolId: string;
  studentId: string | { _id: string; name: string; email?: string; phone?: string };
  instructorId: string | { _id: string; name: string; email?: string; phone?: string };
  dateTime: string;
  duration: number;
  type: 'practical' | 'simulator' | 'theoretical';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
  notes?: string;
};

export type CreateLessonData = {
  drivingSchoolId: string;
  studentId: string;
  instructorId: string;
  dateTime: string;
  duration?: number;
  type: string;
  notes?: string;
};

export const lessonsService = {
  list: (filters?: Record<string, string>) => {
    const params = filters ? '?' + new URLSearchParams(filters).toString() : '';
    return request<Lesson[]>(`${API_ENDPOINTS.lessons}${params}`);
  },
  
  getById: (id: string) => 
    request<Lesson>(API_ENDPOINTS.lessonById(id)),
  
  create: (data: CreateLessonData) => 
    request<Lesson>(API_ENDPOINTS.lessons, { method: 'POST', body: data }),
  
  update: (id: string, data: Partial<Lesson>) => 
    request<Lesson>(API_ENDPOINTS.lessonById(id), { method: 'PATCH', body: data }),
  
  cancel: (id: string) => 
    request<Lesson>(API_ENDPOINTS.lessonById(id), { method: 'PATCH', body: { status: 'cancelled' } }),
};

// ==================== INSTRUCTORS ====================

export type Instructor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  drivingSchoolId: string;
  categories?: string[];
};

export const instructorsService = {
  list: (drivingSchoolId?: string) => {
    const params = drivingSchoolId ? `?drivingSchoolId=${drivingSchoolId}` : '';
    return request<Instructor[]>(`${API_ENDPOINTS.instructors}${params}`);
  },
  
  getById: (id: string) => 
    request<Instructor>(API_ENDPOINTS.instructorById(id)),
};

// ==================== STUDENTS ====================

export type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  drivingSchoolId?: string;
  desiredCategory?: string;
  status?: string;
  photoUrl?: string;
};

export type UpdateStudentData = {
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
};

export const studentsService = {
  list: (drivingSchoolId?: string) => {
    const params = drivingSchoolId ? `?drivingSchoolId=${drivingSchoolId}` : '';
    return request<Student[]>(`${API_ENDPOINTS.students}${params}`);
  },
  
  getById: (id: string) => 
    request<Student>(API_ENDPOINTS.studentById(id)),
    
  update: (id: string, data: UpdateStudentData) =>
    request<Student>(API_ENDPOINTS.studentById(id), { method: 'PATCH', body: data }),
};

// ==================== UPLOAD ====================

export type UploadResponse = {
  id: string;
  url: string;
};

export const uploadService = {
  uploadImage: async (uri: string): Promise<UploadResponse> => {
    // Convert local image to base64
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const result = await request<UploadResponse>(API_ENDPOINTS.upload, {
            method: 'POST',
            body: {
              data: base64,
              contentType: blob.type || 'image/jpeg',
            },
          });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },
  
  getImageUrl: (id: string) => `${API_URL}${API_ENDPOINTS.imageById(id)}`,
};
