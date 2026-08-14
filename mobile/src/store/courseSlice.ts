import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import courseService from '../services/courseService';
import { Course } from '../types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (
    filters: { category?: string; level?: string; skill?: string; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const data = await courseService.getCourses(filters);
      return data.courses;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseDetail = createAsyncThunk(
  'courses/fetchCourseDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await courseService.getCourseById(id);
      return data.course;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch course details');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Course Detail
      .addCase(fetchCourseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCourseError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
