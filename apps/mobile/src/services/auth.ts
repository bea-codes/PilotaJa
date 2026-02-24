import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const AUTH_STORAGE_KEY = '@pilotaja:auth';

export type UserSession = {
  userId: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  drivingSchoolId: string;
  studentId?: string;
  instructorId?: string;
  profile?: {
    name: string;
    email: string;
    phone: string;
    photoUrl?: string;
  };
};

export type RegisterData = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export const authService = {
  register: async (data: RegisterData): Promise<UserSession> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    // Auto-login after registration
    return authService.login({ email: data.email, password: data.password });
  },

  login: async (data: LoginData): Promise<UserSession> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    const session: UserSession = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      drivingSchoolId: result.user.drivingSchoolId,
      studentId: result.user.studentId,
      instructorId: result.user.instructorId,
      profile: result.profile,
    };

    // Save session
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    return session;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getSession: async (): Promise<UserSession | null> => {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn: async (): Promise<boolean> => {
    const session = await authService.getSession();
    return session !== null;
  },
};
