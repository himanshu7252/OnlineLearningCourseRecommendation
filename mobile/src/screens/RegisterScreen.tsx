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
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerUser, clearAuthError } from '../store/authSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const getFriendlyError = (err: string | null) => {
    if (!err) return null;
    if (err.includes('User already exists') || err.includes('exists')) {
      // Inline error below field, do not display in global banner
      return null;
    }
    if (err.toLowerCase().includes('network') || err.toLowerCase().includes('timeout') || err.toLowerCase().includes('connect')) {
      return 'Network error. Please check your internet connection.';
    }
    return err;
  };

  const handleRegister = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Full name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    dispatch(registerUser({ name: name.trim(), email: email.trim(), password }))
      .unwrap()
      .catch((err) => {
        const errorMsg = err || '';
        if (errorMsg.includes('User already exists') || errorMsg.includes('exists')) {
          setEmailError('An account with this email address already exists. Please log in instead.');
          dispatch(clearAuthError());
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
          <Text style={styles.logoIcon}>🎓</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Begin your personalized learning journey</Text>
        </View>

        {error && getFriendlyError(error) ? (
          <Text style={styles.errorText}>⚠️ {getFriendlyError(error)}</Text>
        ) : null}

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Register</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="Himanshu Kumar"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
                if (error) dispatch(clearAuthError());
              }}
              autoCapitalize="words"
            />
            {nameError ? <Text style={styles.fieldErrorText}>{nameError}</Text> : null}
          </View>

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
                if (error) dispatch(clearAuthError());
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password (min 6 characters)</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
                if (error) dispatch(clearAuthError());
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerButtonText}>Register & Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 30,
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  errorText: {
    color: '#f87171',
    backgroundColor: '#451a1a',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#7f1d1d',
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
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default RegisterScreen;
