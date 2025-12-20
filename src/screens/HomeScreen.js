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
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Star component with random animation
const Star = ({ delay, duration, style }) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 100, { duration: duration, easing: Easing.linear }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.star, style, animatedStyle]} />;
};

// Starry Night Background Component
const StarryBackground = () => {
  // Disable animations on web for better performance
  if (Platform.OS === 'web') {
    // Use static stars on web instead of animated ones
    const stars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1,
    }));

    return (
      <View style={styles.starryBackground}>
        {stars.map((star) => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                position: 'absolute',
              },
            ]}
          />
        ))}
      </View>
    );
  }

  // Animated stars for native platforms
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * width,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5000,
    duration: Math.random() * 10000 + 15000,
  }));

  return (
    <View style={styles.starryBackground}>
      {stars.map((star) => (
        <Star
          key={star.id}
          delay={star.delay}
          duration={star.duration}
          style={{
            left: star.left,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      bounces={Platform.OS !== 'web'}
    >
      {/* Hero Section with Starry Night Background */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Starry Background */}
          <StarryBackground />

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Financial Control
              </Text>
              <Text style={styles.heroSubtitle}>
                For Gig Workers
              </Text>
              <Text style={styles.heroDescription}>
                A comprehensive platform to manage your income, track expenses, and achieve financial freedom.
              </Text>

              {/* CTA Buttons */}
              <View style={styles.ctaContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#0a0a0f" />
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

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          The Complete Financial Platform for Gig Workers
        </Text>
        <View style={styles.aboutContent}>
          <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
            GIG ECONOMY is a comprehensive financial management platform designed specifically for freelancers, independent contractors, and gig workers. Whether you drive for Uber, deliver with DoorDash, freelance on Upwork, or run your own business, we help you take control of your finances.
          </Text>
          <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
            Track income from multiple platforms in one place, manage business expenses with AI-powered receipt scanning, prepare for taxes with quarterly estimates and deduction tracking, and build your financial future with smart savings goals and analytics.
          </Text>
          <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
            Our platform is built by gig workers, for gig workers. We understand the unique challenges of irregular income, multiple revenue streams, and complex tax situations. That's why we've created tools that make financial management simple, secure, and stress-free.
          </Text>
        </View>
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

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Choose Your Plan
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Start free, upgrade when you're ready
        </Text>

        <View style={styles.pricingGrid}>
          {/* Free Plan */}
          <View style={[styles.pricingCard, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}>
            <View style={styles.pricingHeader}>
              <Text style={[styles.pricingName, { color: theme.colors.text }]}>Free</Text>
              <View style={styles.pricingPriceContainer}>
                <Text style={[styles.pricingPrice, { color: theme.colors.primary }]}>$0</Text>
                <Text style={[styles.pricingPeriod, { color: theme.colors.textSecondary }]}>/forever</Text>
              </View>
              <Text style={[styles.pricingDescription, { color: theme.colors.textSecondary }]}>
                Perfect for getting started
              </Text>
            </View>
            <View style={styles.pricingFeatures}>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>Unlimited income tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>Unlimited expense tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>Basic analytics & insights</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>Up to 3 savings goals</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>Tax preparation tools</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>CSV export</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.pricingButton, { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.pricingButtonText, { color: theme.colors.primary }]}>Get Started Free</Text>
            </TouchableOpacity>
          </View>

          {/* Pro Plan */}
          <View style={[styles.pricingCard, styles.pricingCardPro, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>MOST POPULAR</Text>
            </View>
            <View style={styles.pricingHeader}>
              <Text style={[styles.pricingName, { color: '#fff' }]}>Premium</Text>
              <View style={styles.pricingPriceContainer}>
                <Text style={[styles.pricingPrice, { color: '#fff' }]}>$9.99</Text>
                <Text style={[styles.pricingPeriod, { color: 'rgba(255,255,255,0.8)' }]}>/month</Text>
              </View>
              <Text style={[styles.pricingAnnual, { color: 'rgba(255,255,255,0.9)' }]}>
                or $89/year (save $30!)
              </Text>
              <Text style={[styles.pricingDescription, { color: 'rgba(255,255,255,0.9)' }]}>
                For serious gig workers
              </Text>
            </View>
            <View style={styles.pricingFeatures}>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff', fontWeight: '600' }]}>Everything in Free, plus:</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>Advanced analytics & charts</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>Unlimited savings goals</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>PDF export & reports</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>AI receipt scanner</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>Priority support</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={[styles.featureText, { color: '#fff' }]}>Insurance tracking</Text>
              </View>
            </View>
            <Text style={styles.proNote}>First 30 days FREE</Text>
            <TouchableOpacity
              style={[styles.pricingButton, { backgroundColor: '#fff' }]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.pricingButtonText, { color: theme.colors.primary }]}>Start Free Trial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Simple & Powerful
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Getting started with GIG ECONOMY is incredibly simple
        </Text>

        <View style={styles.stepsContainer}>
          {[
            { step: 1, title: 'Sign Up', time: '2 minutes', desc: 'Create your free account with just your email. No credit card required. No hidden fees.' },
            { step: 2, title: 'Add Your Income', time: '30 seconds', desc: 'After each gig, simply tap "Add Income" and enter the amount. Choose your platform (Uber, DoorDash, etc.) and you\'re done!' },
            { step: 3, title: 'Track Expenses', time: '1 minute', desc: 'Snap a photo of receipts with our AI scanner or manually add expenses. Categorize for easy tax deductions.' },
            { step: 4, title: 'Monitor & Optimize', time: 'Daily', desc: 'Check your dashboard daily to see your financial health score, track goals, and get insights on how to maximize your earnings.' },
            { step: 5, title: 'Tax Time Made Easy', time: 'One click', desc: 'Export all your data in one click. Send to your accountant or use our tax tools to file yourself. All deductions automatically categorized!' },
          ].map((item, index) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.backgroundAlt }]}>
                <Text style={[styles.stepNumberText, { color: theme.colors.text }]}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                  STEP {item.step}: {item.title} ({item.time})
                </Text>
                <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>
                  {item.desc}
                </Text>
              </View>
              {index < 4 && (
                <View style={styles.stepArrow}>
                  <MaterialIcons name="arrow-downward" size={24} color={theme.colors.textTertiary} />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Why Choose Us Section */}
      <View style={styles.whyChooseSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Built for Gig Workers, By Gig Workers
        </Text>

        <View style={styles.benefitsGrid}>
          {[
            { icon: 'check-circle', title: 'No Subscription Fees', desc: 'Free to use forever. Optional premium features available.' },
            { icon: 'check-circle', title: 'Bank-Level Security', desc: '256-bit encryption. Your data is safe and private.' },
            { icon: 'check-circle', title: 'Works Offline', desc: 'Add transactions even without internet. Syncs when back online.' },
            { icon: 'check-circle', title: 'Multi-Platform Support', desc: 'Works on Uber, Lyft, DoorDash, Instacart, Upwork, Fiverr, and 100+ more platforms.' },
            { icon: 'check-circle', title: 'Automatic Backups', desc: 'Never lose your data. Daily automatic cloud backups.' },
            { icon: 'check-circle', title: 'Tax Compliance', desc: 'Stay IRS compliant with proper expense categorization and quarterly estimates.' },
            { icon: 'check-circle', title: 'Mobile & Web Access', desc: 'Access from anywhere - phone, tablet, or computer.' },
            { icon: 'check-circle', title: 'Expert Support', desc: 'Get help from our team of financial advisors who understand the gig economy.' },
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <MaterialIcons name={benefit.icon} size={24} color={theme.colors.primary} />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>{benefit.title}</Text>
                <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>{benefit.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Who Is This For Section */}
      <View style={styles.whoSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Perfect For
        </Text>

        <View style={styles.personasGrid}>
          {[
            { emoji: '🚗', title: 'Rideshare Drivers', desc: 'Uber, Lyft, Via drivers tracking miles and income' },
            { emoji: '🛵', title: 'Delivery Workers', desc: 'DoorDash, Uber Eats, Instacart, Postmates shoppers' },
            { emoji: '💻', title: 'Freelancers', desc: 'Upwork, Fiverr, Freelancer.com independent contractors' },
            { emoji: '🎨', title: 'Creative Professionals', desc: 'Designers, writers, photographers, videographers' },
            { emoji: '🏠', title: 'Home Service Providers', desc: 'TaskRabbit, Handy, Care.com service providers' },
            { emoji: '📱', title: 'Multiple Gig Workers', desc: 'Anyone juggling 2+ income streams' },
            { emoji: '🎓', title: 'Side Hustlers', desc: 'People with a day job + evening/weekend gigs' },
            { emoji: '🌍', title: 'International Freelancers', desc: 'Works in 150+ countries with multi-currency support' },
          ].map((persona, index) => (
            <View key={index} style={[styles.personaCard, { backgroundColor: theme.colors.backgroundAlt }]}>
              <Text style={styles.personaEmoji}>{persona.emoji}</Text>
              <Text style={[styles.personaTitle, { color: theme.colors.text }]}>{persona.title}</Text>
              <Text style={[styles.personaDesc, { color: theme.colors.textSecondary }]}>{persona.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.testimonialsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          What Our Users Say
        </Text>

        <View style={styles.testimonialsGrid}>
          {[
            { quote: '"This app saved me $4,500 in taxes!"', author: 'Sarah M., Uber Driver, Los Angeles', rating: 5 },
            { quote: '"I was tracking expenses in 3 different apps. GIG ECONOMY brought it all together. Game changer!"', author: 'James T., Freelance Designer, New York', rating: 5 },
            { quote: '"I hit my $10k emergency fund goal thanks to the savings tracker. Highly recommend!"', author: 'Maria G., DoorDash Driver, Miami', rating: 5 },
          ].map((testimonial, index) => (
            <View key={index} style={[styles.testimonialCard, { backgroundColor: theme.colors.backgroundAlt }]}>
              <Text style={[styles.testimonialQuote, { color: theme.colors.text }]}>{testimonial.quote}</Text>
              <View style={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <MaterialIcons key={i} name="star" size={16} color={theme.colors.primary} />
                ))}
              </View>
              <Text style={[styles.testimonialAuthor, { color: theme.colors.textSecondary }]}>{testimonial.author}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Frequently Asked Questions
        </Text>

        <View style={styles.faqList}>
          {[
            { q: 'Is my financial data secure?', a: 'Absolutely. We use bank-level 256-bit encryption and never share your data with third parties. Your privacy is our top priority.' },
            { q: 'Do I need to connect my bank account?', a: 'No! You can manually add all transactions. Bank integration is optional for Premium users.' },
            { q: 'What platforms do you support?', a: 'We support 100+ gig platforms including Uber, Lyft, DoorDash, Instacart, Upwork, Fiverr, and more. You can also add custom platforms.' },
            { q: 'Can I use this for my taxes?', a: 'Yes! Our export features create tax-ready reports that you can send directly to your accountant or use for self-filing.' },
            { q: 'Is there a mobile app?', a: 'Yes! Available on iOS, Android, and web. All sync in real-time.' },
            { q: 'What if I have multiple gigs?', a: 'Perfect! GIG ECONOMY is designed for people with multiple income streams. Track them all in one place.' },
            { q: 'Do you offer customer support?', a: 'Yes! Free users get email support. Premium users get priority support and phone consultations.' },
            { q: 'Can I export my data if I want to leave?', a: 'Of course! You own your data. Export everything anytime in CSV or PDF format.' },
          ].map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>Q: {faq.q}</Text>
              <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>A: {faq.a}</Text>
            </View>
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
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>10,000+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Active Users
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>$2M+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Income Tracked
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>150+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Countries
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

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.backgroundAlt }]}>
        <View style={styles.footerContent}>
          <View style={styles.footerBrand}>
            <Text style={[styles.footerBrandName, { color: theme.colors.text }]}>GIG ECONOMY</Text>
            <Text style={[styles.footerBrandTagline, { color: theme.colors.textSecondary }]}>
              Financial Control For Gig Workers
            </Text>
          </View>

          <View style={styles.footerLinks}>
            <View style={styles.footerColumn}>
              <Text style={[styles.footerColumnTitle, { color: theme.colors.text }]}>Features</Text>
              {['Dashboard', 'Income', 'Expenses', 'Analytics', 'Tax Tools'].map((link) => (
                <Text key={link} style={[styles.footerLink, { color: theme.colors.textSecondary }]}>{link}</Text>
              ))}
            </View>

            <View style={styles.footerColumn}>
              <Text style={[styles.footerColumnTitle, { color: theme.colors.text }]}>Company</Text>
              {['About Us', 'Careers', 'Press', 'Blog'].map((link) => (
                <Text key={link} style={[styles.footerLink, { color: theme.colors.textSecondary }]}>{link}</Text>
              ))}
            </View>

            <View style={styles.footerColumn}>
              <Text style={[styles.footerColumnTitle, { color: theme.colors.text }]}>Support</Text>
              {['Help Center', 'Contact', 'FAQ', 'Tutorials'].map((link) => (
                <Text key={link} style={[styles.footerLink, { color: theme.colors.textSecondary }]}>{link}</Text>
              ))}
            </View>

            <View style={styles.footerColumn}>
              <Text style={[styles.footerColumnTitle, { color: theme.colors.text }]}>Legal</Text>
              {['Privacy', 'Terms', 'Security', 'Compliance'].map((link) => (
                <Text key={link} style={[styles.footerLink, { color: theme.colors.textSecondary }]}>{link}</Text>
              ))}
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={[styles.footerEmail, { color: theme.colors.textSecondary }]}>
              📧 support@gigeconomy.com
            </Text>
            <Text style={[styles.footerSocial, { color: theme.colors.textSecondary }]}>
              📱 Follow us: Twitter | LinkedIn | Instagram | Facebook
            </Text>
            <Text style={[styles.footerCopyright, { color: theme.colors.textTertiary }]}>
              © 2025 GIG ECONOMY. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  heroSection: {
    height: height * 0.85,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  starryBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
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
    fontSize: Platform.OS === 'web' ? 64 : 48,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: Platform.OS === 'web' ? 72 : 56,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: Platform.OS === 'web' ? 52 : 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: Platform.OS === 'web' ? 60 : 48,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  heroDescription: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
    maxWidth: 500,
  },
  aboutSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  aboutContent: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    marginTop: 24,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#0a0a0f',
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
  pricingSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  pricingGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
    gap: 24,
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
  pricingCard: {
    width: Platform.OS === 'web' ? 400 : width - 48,
    padding: 32,
    borderRadius: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  pricingCardPro: {
    position: 'relative',
    transform: Platform.OS === 'web' ? [{ scale: 1.05 }] : [],
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  proBadge: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  proBadgeText: {
    backgroundColor: '#fff',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pricingHeader: {
    marginBottom: 24,
    paddingTop: 12,
  },
  pricingName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  pricingPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 48,
    fontWeight: '800',
  },
  pricingPeriod: {
    fontSize: 18,
    marginLeft: 4,
  },
  pricingAnnual: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 15,
  },
  pricingFeatures: {
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  pricingButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  pricingButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  proNote: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
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
  // How It Works Section
  howItWorksSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  stepsContainer: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    marginTop: 40,
  },
  stepCard: {
    marginBottom: 24,
    position: 'relative',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '700',
  },
  stepContent: {
    paddingLeft: 0,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepArrow: {
    alignItems: 'center',
    marginVertical: 16,
  },
  // Why Choose Us Section
  whyChooseSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  benefitsGrid: {
    maxWidth: 1000,
    marginHorizontal: 'auto',
    marginTop: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitDesc: {
    fontSize: 15,
    lineHeight: 22,
  },
  // Who Is This For Section
  whoSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  personasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginTop: 40,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  personaCard: {
    width: Platform.OS === 'web' ? 260 : width - 48,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  personaEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  personaTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  personaDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  // Testimonials Section
  testimonialsSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  testimonialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginTop: 40,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  testimonialCard: {
    width: Platform.OS === 'web' ? 350 : width - 48,
    padding: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  testimonialQuote: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: 16,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  // FAQ Section
  faqSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  faqList: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    marginTop: 40,
  },
  faqItem: {
    marginBottom: 32,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 16,
    lineHeight: 26,
  },
  // Footer
  footer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  footerBrand: {
    marginBottom: 40,
  },
  footerBrandName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  footerBrandTagline: {
    fontSize: 14,
  },
  footerLinks: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 40,
    marginBottom: 40,
  },
  footerColumn: {
    flex: Platform.OS === 'web' ? 1 : 0,
    minWidth: 150,
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    marginBottom: 12,
  },
  footerBottom: {
    alignItems: 'center',
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  footerSocial: {
    fontSize: 14,
    marginBottom: 16,
  },
  footerCopyright: {
    fontSize: 12,
  },
});
