import api from './api';
import { Course } from '../types';

export const courseService = {
  getCourses: async (filters?: {
    category?: string;
    level?: string;
    skill?: string;
    search?: string;
  }): Promise<{ courses: Course[] }> => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  getCourseById: async (id: string): Promise<{ course: Course }> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
};

export default courseService;
