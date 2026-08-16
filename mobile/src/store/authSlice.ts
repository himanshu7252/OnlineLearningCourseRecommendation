import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  isCheckingAuth: true,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials.email, credentials.password);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (fields: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.register(fields.name, fields.email, fields.password);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return { user: null, token: null };
      
      const data = await authService.getMe();
      return { user: data.user, token };
    } catch (err: any) {
      await AsyncStorage.removeItem('userToken');
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load user session';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(profileData);
      return data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  'auth/resetPassword',
  async (fields: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(fields.email, fields.otp, fields.newPassword);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.isCheckingAuth = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
        state.isCheckingAuth = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
