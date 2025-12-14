import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const DashboardScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const {
    totalSavings,
    categories,
    transactions,
    fetchProfile,
    calculateSavings,
    fetchCategories,
    fetchTransactions,
  } = useUserStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    await Promise.all([
      fetchProfile(user.id),
      calculateSavings(user.id),
      fetchCategories(user.id),
      fetchTransactions(user.id),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Default categories if none exist
  const defaultCategories = [
    { id: 1, name: 'Add Money', icon: 'add-circle', color: theme.colors.success, type: 'income' },
    { id: 2, name: 'Tax Payments', icon: 'account-balance', color: theme.colors.tax, type: 'expense' },
    { id: 3, name: 'Groceries', icon: 'shopping-cart', color: theme.colors.expense, type: 'expense' },
    { id: 4, name: 'Insurance', icon: 'security', color: theme.colors.primary, type: 'expense' },
    { id: 5, name: 'Loans & EMI', icon: 'payment', color: theme.colors.warning, type: 'expense' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Recent transactions (limit to 5)
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[...theme.colors.gradient1, theme.colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.user_metadata?.full_name || 'Gig Worker'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.headerButton,
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

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={[
              styles.headerButton,
              {
                backgroundColor: theme.colors.glassMedium,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <MaterialIcons name="person" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Total Savings Display - BIG & BOLD */}
        <GlassCard gradient intensity="strong" style={styles.savingsCard}>
          <Text style={[styles.savingsLabel, { color: theme.colors.textInverse }]}>
            Total Savings
          </Text>
          <Text style={[styles.savingsAmount, { color: theme.colors.textInverse }]}>
            {formatCurrency(totalSavings || 0)}
          </Text>
          <Text style={[styles.savingsSubtext, { color: theme.colors.textInverse }]}>
            Updated just now
          </Text>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>

          <View style={styles.quickActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
              style={styles.quickAction}
            >
              <GlassCard intensity="light" style={styles.quickActionCard}>
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: theme.colors.success },
                  ]}
                >
                  <MaterialIcons name="add" size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  Add Income
                </Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
              style={styles.quickAction}
            >
              <GlassCard intensity="light" style={styles.quickActionCard}>
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: theme.colors.expense },
                  ]}
                >
                  <MaterialIcons name="remove" size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  Record Expense
                </Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Reports')}
              style={styles.quickAction}
            >
              <GlassCard intensity="light" style={styles.quickActionCard}>
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <MaterialIcons name="insights" size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  View Reports
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Categories
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Manage
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {displayCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() =>
                  navigation.navigate('CategoryDetails', { categoryId: category.id })
                }
                style={[
                  styles.categoryItem,
                  isWeb && width > 768 && styles.categoryItemWeb,
                ]}
              >
                <GlassCard intensity="light" style={styles.categoryCard}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color || theme.colors.primary },
                    ]}
                  >
                    <MaterialIcons
                      name={category.icon || 'category'}
                      size={24}
                      color="#ffffff"
                    />
                  </View>
                  <Text
                    style={[styles.categoryName, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            ))}

            {/* Add Category Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCategory')}
              style={[
                styles.categoryItem,
                isWeb && width > 768 && styles.categoryItemWeb,
              ]}
            >
              <GlassCard intensity="light" style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: theme.colors.textTertiary },
                  ]}
                >
                  <MaterialIcons name="add" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.categoryName, { color: theme.colors.textSecondary }]}>
                  Add New
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Activity
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <GlassCard intensity="light" style={styles.transactionsCard}>
              {recentTransactions.map((transaction, index) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index !== recentTransactions.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.borderLight,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.type === 'income'
                            ? theme.colors.income
                            : theme.colors.expense,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={transaction.type === 'income' ? 'arrow-downward' : 'arrow-upward'}
                      size={20}
                      color="#ffffff"
                    />
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionName, { color: theme.colors.text }]}>
                      {transaction.description || transaction.category}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'income'
                            ? theme.colors.success
                            : theme.colors.expense,
                      },
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                </View>
              ))}
            </GlassCard>
          </View>
        )}

        {/* Savings Goals CTA */}
        <GlassCard gradient intensity="medium" style={styles.ctaCard}>
          <MaterialIcons name="emoji-events" size={48} color="#ffffff" />
          <Text style={[styles.ctaTitle, { color: '#ffffff' }]}>
            Set Your Savings Goals
          </Text>
          <Text style={[styles.ctaText, { color: '#ffffff' }]}>
            Plan for your dream vacation, emergency fund, or any custom goal
          </Text>
          <Button
            title="Create Goal"
            variant="glass"
            onPress={() => navigation.navigate('SavingsGoals')}
            style={styles.ctaButton}
          />
        </GlassCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  savingsCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  savingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  savingsAmount: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 8,
  },
  savingsSubtext: {
    fontSize: 12,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
  },
  quickActionCard: {
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    width: (width - 64) / 2,
  },
  categoryItemWeb: {
    width: (width - 120) / 4,
    minWidth: 150,
  },
  categoryCard: {
    padding: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  transactionsCard: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  ctaCard: {
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButton: {
    minWidth: 200,
  },
});
