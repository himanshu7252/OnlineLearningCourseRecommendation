import api from './api';
import { Recommendation, SkillGap } from '../types';

export const recommendationService = {
  getPersonalizedRecommendations: async (): Promise<{ recommendations: Recommendation[] }> => {
    const response = await api.get('/recommendations');
    return response.data;
  },

  getRelatedRecommendations: async (courseId: string): Promise<{ recommendations: Recommendation[] }> => {
    const response = await api.get(`/recommendations/because-you-watched/${courseId}`);
    return response.data;
  },

  getSkillGapRecommendations: async (role: string): Promise<SkillGap> => {
    const response = await api.get('/recommendations/skill-gap', { params: { role } });
    return response.data;
  },
};

export default recommendationService;
