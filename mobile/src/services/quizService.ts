import api from './api';
import { Quiz, QuizSubmissionResult } from '../types';

export const quizService = {
  getQuizzesByCourse: async (courseId: string, lessonId?: string): Promise<{ quizzes: Quiz[] }> => {
    const response = await api.get(`/quizzes/${courseId}`, { params: { lessonId } });
    return response.data;
  },

  submitQuizResponse: async (quizId: string, answers: string[]): Promise<QuizSubmissionResult> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },
};

export default quizService;
