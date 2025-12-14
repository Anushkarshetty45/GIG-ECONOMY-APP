import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const LandingScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useThemeStore();

  const features = [
    {
      icon: 'account-balance-wallet',
      title: 'Smart Savings',
      description: 'Automatically calculate and save money based on your gig income',
    },
    {
      icon: 'calculate',
      title: 'Tax Calculation',
      description: 'Estimate and track taxes with intelligent calculations',
    },
    {
      icon: 'security',
      title: 'Insurance Plans',
      description: 'Get personalized insurance recommendations based on your income',
    },
    {
      icon: 'trending-up',
      title: 'Financial Goals',
      description: 'Set and achieve savings goals for your dream destinations',
    },
    {
      icon: 'account-balance',
      title: 'Bank Integration',
      description: 'Link your bank account for automatic financial management',
    },
    {
      icon: 'insights',
      title: 'Analytics',
      description: 'Visualize your income, expenses, and savings with detailed charts',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[...theme.colors.gradient1, theme.colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Theme Toggle Button */}
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            GIG ECONOMY
          </Text>

          <GlassCard intensity="medium" style={styles.heroCard}>
            <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
              Financial Wellness for{'\n'}Gig Workers
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
              Take control of your finances with smart savings, tax management,
              and insurance planning designed for the modern gig economy.
            </Text>
          </GlassCard>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <Button
              title="Get Started"
              variant="primary"
              size="large"
              onPress={() => navigation.navigate('Register')}
              style={styles.ctaButton}
            />
            <Button
              title="Sign In"
              variant="glass"
              size="large"
              onPress={() => navigation.navigate('Login')}
              style={styles.ctaButton}
            />
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Everything You Need
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                intensity="light"
                style={[
                  styles.featureCard,
                  isWeb && width > 768 && styles.featureCardWeb,
                ]}
              >
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <MaterialIcons
                    name={feature.icon}
                    size={32}
                    color="#ffffff"
                  />
                </View>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[styles.featureDescription, { color: theme.colors.textSecondary }]}
                >
                  {feature.description}
                </Text>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <GlassCard intensity="medium" style={styles.benefitsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Why Choose GIG ECONOMY?
          </Text>

          <View style={styles.benefitsList}>
            {[
              'No hidden fees - completely transparent',
              'Bank-level security for your data',
              'Works with all major gig platforms',
              'Real-time sync across all devices',
              'Expert financial insights tailored for gig workers',
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Join thousands of gig workers taking control of their financial future
          </Text>
          <Button
            title="Start Your Journey"
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('Register')}
            style={styles.footerButton}
          />
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 32,
    textAlign: 'center',
  },
  heroCard: {
    padding: 32,
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  ctaContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  ctaButton: {
    width: '100%',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  featureCard: {
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  featureCardWeb: {
    width: '30%',
    minWidth: 280,
  },
  featureIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  benefitsCard: {
    marginHorizontal: 20,
    padding: 32,
    marginBottom: 40,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  footerText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  footerButton: {
    width: '100%',
    maxWidth: 400,
  },
});
