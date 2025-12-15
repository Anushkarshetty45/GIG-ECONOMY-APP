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
  getGenericAuthError,
  loginRateLimiter
} from '../../utils/validation';

export const LoginScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useThemeStore();
  const { signIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      newErrors.password = 'Please enter a valid password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    // Check rate limiting
    const rateLimitCheck = loginRateLimiter.checkLimit(email.toLowerCase());
    if (!rateLimitCheck.allowed) {
      Alert.alert('Too Many Attempts', rateLimitCheck.message);
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      // Use generic error message for security
      const errorMessage = getGenericAuthError(result.error);
      Alert.alert('Login Failed', errorMessage);
    } else {
      // Reset rate limiter on successful login
      loginRateLimiter.reset(email.toLowerCase());
    }
  };

  // Biometric auth removed for web/Electron compatibility
  // Will be re-added in native mobile builds only

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
                Welcome back! Sign in to continue
              </Text>
            </View>

            {/* Login Form */}
            <GlassCard intensity="medium" style={styles.formCard}>
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Sign In
              </Text>

              <Input
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock"
                error={errors.password}
              />

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Reset Password',
                    'Please enter your email address to reset your password.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'OK',
                        onPress: () => {
                          // TODO: Implement forgot password functionality
                          Alert.alert('Info', 'Password reset link will be sent to your email.');
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
                style={styles.forgotPassword}
              >
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                variant="primary"
                size="large"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
            </GlassCard>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
                  Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  biometricButton: {
    marginBottom: 0,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
