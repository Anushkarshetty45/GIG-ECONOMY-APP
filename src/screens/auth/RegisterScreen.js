import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
  getGenericAuthError
} from '../../utils/validation';

export const RegisterScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useThemeStore();
  const { signUp } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    // Validate password with strong requirements
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0]; // Show first error
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    
    // Sanitize user input
    const sanitizedFullName = sanitizeInput(formData.fullName);
    
    const result = await signUp(formData.email, formData.password, {
      full_name: sanitizedFullName,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email for verification.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      // Use generic error message for security
      const errorMessage = getGenericAuthError(result.error);
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[...theme.colors.gradient1, theme.colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={[
          styles.themeToggle,
          {
            backgroundColor: theme.colors.glassMedium,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialIcons
          name={mode === 'light' ? 'dark-mode' : 'light-mode'}
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                GIG ECONOMY
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Create your account to get started
              </Text>
            </View>

            {/* Register Form */}
            <GlassCard intensity="medium" style={styles.formCard}>
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Sign Up
              </Text>

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChangeText={(value) => updateField('fullName', value)}
                icon="person"
                error={errors.fullName}
              />

              <Input
                label="Email Address"
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                icon="lock"
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
                icon="lock"
                error={errors.confirmPassword}
              />

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={[styles.requirementsTitle, { color: theme.colors.textSecondary }]}>
                  Password must contain:
                </Text>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={formData.password.length >= 8 ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={formData.password.length >= 8 ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={/[A-Z]/.test(formData.password) ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={/[A-Z]/.test(formData.password) ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                    One uppercase letter
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={/[a-z]/.test(formData.password) ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={/[a-z]/.test(formData.password) ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                    One lowercase letter
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={/[0-9]/.test(formData.password) ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={/[0-9]/.test(formData.password) ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                    One number
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <MaterialIcons
                    name={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                    One special character
                  </Text>
                </View>
              </View>

              <Button
                title="Create Account"
                variant="primary"
                size="large"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerButton}
              />

              {/* Terms */}
              <Text style={[styles.terms, { color: theme.colors.textTertiary }]}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </GlassCard>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    padding: 32,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  requirementText: {
    fontSize: 12,
  },
  registerButton: {
    marginBottom: 16,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
