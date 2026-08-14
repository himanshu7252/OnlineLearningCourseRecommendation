import api from './api';
import { Enrollment } from '../types';

export const enrollmentService = {
  enroll: async (courseId: string): Promise<{ enrollment: Enrollment }> => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },

  getEnrollments: async (): Promise<{ enrollments: Enrollment[] }> => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  getEnrollmentById: async (id: string): Promise<{ enrollment: Enrollment }> => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },
};

export default enrollmentService;
