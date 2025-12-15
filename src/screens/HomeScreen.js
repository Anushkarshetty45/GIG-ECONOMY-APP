import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Animated Floating Orbs Component
const FloatingOrb = ({ delay = 0, size = 200, colors, style }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.orb, { width: size, height: size }, style, animatedStyle]}>
      <LinearGradient colors={colors} style={styles.orbGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
    </Animated.View>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <View style={styles.animatedBackground}>
      <FloatingOrb
        size={300}
        colors={['#6366f1', '#8b5cf6']}
        style={{ position: 'absolute', top: -50, right: -50, opacity: 0.3 }}
      />
      <FloatingOrb
        size={250}
        colors={['#ec4899', '#8b5cf6']}
        style={{ position: 'absolute', bottom: 100, left: -80, opacity: 0.25 }}
      />
      <FloatingOrb
        size={200}
        colors={['#3b82f6', '#6366f1']}
        style={{ position: 'absolute', top: '40%', left: '60%', opacity: 0.2 }}
      />
    </View>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, theme }) => (
  <View style={[styles.featureCard, { backgroundColor: theme.colors.backgroundAlt }]}>
    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
      <MaterialIcons name={icon} size={32} color={theme.colors.primary} />
    </View>
    <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{title}</Text>
    <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
      {description}
    </Text>
  </View>
);

export const HomeScreen = ({ navigation }) => {
  const { theme } = useThemeStore();

  const features = [
    {
      icon: 'attach-money',
      title: 'Manage Earnings',
      description: 'Track all your gig income in one place with real-time updates and insights.',
    },
    {
      icon: 'trending-up',
      title: 'Smart Analytics',
      description: 'Visualize your financial growth with powerful charts and reports.',
    },
    {
      icon: 'savings',
      title: 'Set Goals',
      description: 'Create savings goals and track your progress automatically.',
    },
    {
      icon: 'security',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry standards.',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section with Animated Background */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary, '#1e1b4b']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated Background */}
          <AnimatedBackground />

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Your Gig Economy{'\n'}Financial Hub
              </Text>
              <Text style={styles.heroSubtitle}>
                Manage earnings, track expenses, and achieve your financial goals with AI-powered insights.
              </Text>

              {/* CTA Buttons */}
              <View style={styles.ctaContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.secondaryButtonText, { color: '#fff' }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Everything You Need
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Powerful features designed for gig workers
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              theme={theme}
            />
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <LinearGradient
          colors={[`${theme.colors.primary}20`, `${theme.colors.secondary}20`]}
          style={styles.statsGradient}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>10K+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Active Users
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>$2M+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Tracked Income
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>98%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Satisfaction
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Final CTA Section */}
      <View style={styles.finalCTA}>
        <Text style={[styles.finalCTATitle, { color: theme.colors.text }]}>
          Ready to Take Control?
        </Text>
        <Text style={[styles.finalCTASubtitle, { color: theme.colors.textSecondary }]}>
          Join thousands of gig workers managing their finances smarter
        </Text>
        <TouchableOpacity
          style={[styles.finalCTAButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={styles.finalCTAButtonText}>Start Free Today</Text>
          <MaterialIcons name="rocket-launch" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.85,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  orb: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  orbGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  heroTextContainer: {
    alignItems: 'center',
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 56 : 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: Platform.OS === 'web' ? 64 : 48,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
    maxWidth: 500,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  ctaContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: Platform.OS === 'web' ? 1 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: Platform.OS === 'web' ? 1 : 0,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    width: Platform.OS === 'web' ? 280 : width - 48,
    padding: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  statsGradient: {
    borderRadius: 24,
    padding: 40,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statDivider: {
    width: Platform.OS === 'web' ? 1 : '80%',
    height: Platform.OS === 'web' ? 60 : 1,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  finalCTA: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  finalCTATitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCTASubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 500,
  },
  finalCTAButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  finalCTAButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
