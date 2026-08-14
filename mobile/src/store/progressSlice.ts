import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import progressService, { ProgressUpdatePayload } from '../services/progressService';
import { Progress } from '../types';

interface ProgressState {
  currentCourseProgress: Progress[];
  coursePercentages: { [courseId: string]: number };
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  currentCourseProgress: [],
  coursePercentages: {},
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCourseProgress = createAsyncThunk(
  'progress/fetchCourseProgress',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const data = await progressService.getCourseProgress(courseId);
      return { courseId, progress: data.progress };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch course progress');
    }
  }
);

export const updateLessonProgressState = createAsyncThunk(
  'progress/updateLessonProgress',
  async (payload: ProgressUpdatePayload, { rejectWithValue }) => {
    try {
      const data = await progressService.updateProgress(payload);
      return data; // returns progress, progressPercentage, completedLessons, totalLessons
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update progress');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },
    clearCourseProgress: (state) => {
      state.currentCourseProgress = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Course Progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourseProgress = action.payload.progress;
        
        // Calculate and cache percentage locally in map
        const completed = action.payload.progress.filter(p => p.completed).length;
        const total = action.payload.progress.length; // Approximate, usually verified via lessons count
        if (total > 0) {
          state.coursePercentages[action.payload.courseId] = Math.round((completed / total) * 100);
        }
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Lesson Progress
      .addCase(updateLessonProgressState.fulfilled, (state, action) => {
        const updatedProgress = action.payload.progress;
        const courseId = updatedProgress.courseId;
        
        // Update percentages map
        state.coursePercentages[courseId] = action.payload.progressPercentage;

        // Update list of progress item if current course matches
        const idx = state.currentCourseProgress.findIndex(p => p.lessonId === updatedProgress.lessonId);
        if (idx !== -1) {
          state.currentCourseProgress[idx] = updatedProgress;
        } else {
          state.currentCourseProgress.push(updatedProgress);
        }
      });
  },
});

export const { clearProgressError, clearCourseProgress } = progressSlice.actions;
export default progressSlice.reducer;
