import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { forgotPasswordUser, resetPasswordUser, clearAuthError } from '../store/authSlice';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleSendOTP = () => {
    if (!email) {
      setEmailError('Email address is required');
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    dispatch(forgotPasswordUser(email.trim()))
      .unwrap()
      .then(() => {
        setStep(2);
        Alert.alert('Verification OTP Sent', 'Please check your email for the 6-digit OTP code.');
      })
      .catch((err) => {
        const errMsg = err || '';
        if (errMsg.includes('does not exist')) {
          setEmailError('User does not exist');
        } else {
          Alert.alert('Error', errMsg || 'Failed to send verification OTP');
        }
      });
  };

  const handleResetPassword = () => {
    let isValid = true;

    if (!otp.trim()) {
      setOtpError('Verification code is required');
      isValid = false;
    } else if (otp.trim().length !== 6) {
      setOtpError('Verification code must be 6 digits');
      isValid = false;
    } else {
      setOtpError('');
    }

    if (!newPassword) {
      setNewPasswordError('New password is required');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setNewPasswordError('');
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValid) return;

    dispatch(resetPasswordUser({ email: email.trim(), otp: otp.trim(), newPassword }))
      .unwrap()
      .then(() => {
        setIsSubmitted(true);
        Alert.alert('Success', 'Password has been updated successfully.', [
          { text: 'Login Now', onPress: () => navigation.navigate('Login') }
        ]);
      })
      .catch((err) => {
        const errMsg = err || '';
        if (errMsg.includes('OTP') || errMsg.toLowerCase().includes('expired') || errMsg.toLowerCase().includes('invalid')) {
          setOtpError('Invalid or expired verification code');
        } else {
          Alert.alert('Error', errMsg || 'Failed to reset password');
        }
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerArea}>
          <Text style={styles.logoIcon}>🔑</Text>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your email to receive recovery instructions'
              : 'Enter the 6-digit OTP code sent to your email to verify'
            }
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isSubmitted
              ? 'Success'
              : step === 1
                ? 'Recover Account'
                : 'Reset Password'
            }
          </Text>

          {isSubmitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                ✓ Your password has been successfully updated.
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.resetButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : step === 1 ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="name@domain.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                    dispatch(clearAuthError());
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerLink}>
                <Text style={styles.footerText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification Code (6-digit OTP)</Text>
                <TextInput
                  style={[styles.input, otpError ? styles.inputError : null]}
                  placeholder="123456"
                  placeholderTextColor="#94a3b8"
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text);
                    if (otpError) setOtpError('');
                    dispatch(clearAuthError());
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {otpError ? <Text style={styles.fieldErrorText}>{otpError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password (min 6 characters)</Text>
                <TextInput
                  style={[styles.input, newPasswordError ? styles.inputError : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (newPasswordError) setNewPasswordError('');
                    dispatch(clearAuthError());
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {newPasswordError ? <Text style={styles.fieldErrorText}>{newPasswordError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                    dispatch(clearAuthError());
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {confirmPasswordError ? <Text style={styles.fieldErrorText}>{confirmPasswordError}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerLink}>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Text style={styles.linkText}>← Back to Step 1</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  formContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successText: {
    color: '#4ade80',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkText: {
    color: '#818cf8',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
