import api from './api';
import { Progress } from '../types';

export interface ProgressUpdatePayload {
  courseId: string;
  lessonId: string;
  completed?: boolean;
  watchedDuration?: number;
  quizScore?: number;
}

export const progressService = {
  updateProgress: async (
    payload: ProgressUpdatePayload
  ): Promise<{
    progress: Progress;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
  }> => {
    const response = await api.post('/progress', payload);
    return response.data;
  },

  getCourseProgress: async (courseId: string): Promise<{ progress: Progress[] }> => {
    const response = await api.get(`/progress/${courseId}`);
    return response.data;
  },
};

export default progressService;
