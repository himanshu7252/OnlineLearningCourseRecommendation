import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import enrollmentService from '../services/enrollmentService';
import { Enrollment } from '../types';

interface EnrollmentState {
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  currentEnrollment: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await enrollmentService.getEnrollments();
      return data.enrollments;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch enrollments');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'enrollments/enroll',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const data = await enrollmentService.enroll(courseId);
      return data.enrollment;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to enroll in course');
    }
  }
);

export const fetchEnrollmentDetail = createAsyncThunk(
  'enrollments/fetchDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await enrollmentService.getEnrollmentById(id);
      return data.enrollment;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch enrollment details');
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    clearEnrollmentError: (state) => {
      state.error = null;
    },
    clearCurrentEnrollment: (state) => {
      state.currentEnrollment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action: PayloadAction<Enrollment[]>) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action: PayloadAction<Enrollment>) => {
        state.loading = false;
        state.enrollments.push(action.payload);
        state.currentEnrollment = action.payload;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Enrollment Detail
      .addCase(fetchEnrollmentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentDetail.fulfilled, (state, action: PayloadAction<Enrollment>) => {
        state.loading = false;
        state.currentEnrollment = action.payload;
      })
      .addCase(fetchEnrollmentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEnrollmentError, clearCurrentEnrollment } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
