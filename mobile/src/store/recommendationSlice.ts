import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import recommendationService from '../services/recommendationService';
import { Recommendation, SkillGap } from '../types';

interface RecommendationState {
  recommendations: Recommendation[];
  relatedRecommendations: Recommendation[];
  skillGap: SkillGap | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationState = {
  recommendations: [],
  relatedRecommendations: [],
  skillGap: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchPersonalized',
  async (_, { rejectWithValue }) => {
    try {
      const data = await recommendationService.getPersonalizedRecommendations();
      return data.recommendations;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load recommendations');
    }
  }
);

export const fetchRelatedRecommendations = createAsyncThunk(
  'recommendations/fetchRelated',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const data = await recommendationService.getRelatedRecommendations(courseId);
      return data.recommendations;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load related courses');
    }
  }
);

export const fetchSkillGapRecommendations = createAsyncThunk(
  'recommendations/fetchSkillGap',
  async (role: string, { rejectWithValue }) => {
    try {
      const data = await recommendationService.getSkillGapRecommendations(role);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to calculate skill gap');
    }
  }
);

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendationError: (state) => {
      state.error = null;
    },
    clearSkillGap: (state) => {
      state.skillGap = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Personalized Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Related Recommendations
      .addCase(fetchRelatedRecommendations.pending, (state) => {
        state.relatedRecommendations = [];
        state.error = null;
      })
      .addCase(fetchRelatedRecommendations.fulfilled, (state, action: PayloadAction<Recommendation[]>) => {
        state.relatedRecommendations = action.payload;
      })
      .addCase(fetchRelatedRecommendations.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Skill Gap Recommendations
      .addCase(fetchSkillGapRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkillGapRecommendations.fulfilled, (state, action: PayloadAction<SkillGap>) => {
        state.loading = false;
        state.skillGap = action.payload;
      })
      .addCase(fetchSkillGapRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRecommendationError, clearSkillGap } = recommendationSlice.actions;
export default recommendationSlice.reducer;
