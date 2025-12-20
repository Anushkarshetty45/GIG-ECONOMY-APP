import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/common/GlassCard';

const QUARTERS = [
  { id: 'Q1', label: 'Q1', months: [0, 1, 2], name: 'Jan - Mar' },
  { id: 'Q2', label: 'Q2', months: [3, 4, 5], name: 'Apr - Jun' },
  { id: 'Q3', label: 'Q3', months: [6, 7, 8], name: 'Jul - Sep' },
  { id: 'Q4', label: 'Q4', months: [9, 10, 11], name: 'Oct - Dec' },
];

const TAX_CHECKLIST = [
  { id: '1099', label: 'Gather 1099 forms from all platforms', icon: 'description' },
  { id: 'expenses', label: 'Review and categorize all expenses', icon: 'receipt-long' },
  { id: 'mileage', label: 'Calculate business mileage', icon: 'directions-car' },
  { id: 'receipts', label: 'Organize receipts and documentation', icon: 'folder' },
  { id: 'deductions', label: 'Identify all eligible deductions', icon: 'fact-check' },
  { id: 'accountant', label: 'Schedule meeting with tax professional', icon: 'event' },
];

const TAX_TIPS = [
  {
    title: 'Self-Employment Tax',
    description: 'As a gig worker, you\'ll pay ~15.3% self-employment tax on net earnings',
    icon: 'info',
  },
  {
    title: 'Quarterly Payments',
    description: 'Consider making estimated tax payments quarterly to avoid penalties',
    icon: 'calendar-today',
  },
  {
    title: 'Keep Records',
    description: 'Save receipts and documentation for at least 3 years',
    icon: 'archive',
  },
  {
    title: 'Deductible Expenses',
    description: 'Gas, car maintenance, phone, internet, and supplies may be deductible',
    icon: 'attach-money',
  },
];

export const TaxToolsScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { incomes, expenses, getExpensesByCategory } = useFinanceStore();

  const currentYear = new Date().getFullYear();

  const yearlyData = useMemo(() => {
    const yearIncome = incomes
      .filter(income => new Date(income.date).getFullYear() === currentYear)
      .reduce((sum, income) => sum + income.amount, 0);

    const yearExpenses = expenses
      .filter(expense => new Date(expense.date).getFullYear() === currentYear)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const netIncome = yearIncome - yearExpenses;
    const selfEmploymentTax = netIncome * 0.153;
    const estimatedIncomeTax = netIncome * 0.12;
    const totalEstimatedTax = selfEmploymentTax + estimatedIncomeTax;

    return {
      income: yearIncome,
      expenses: yearExpenses,
      netIncome,
      selfEmploymentTax,
      estimatedIncomeTax,
      totalEstimatedTax,
    };
  }, [incomes, expenses, currentYear]);

  const quarterlyData = useMemo(() => {
    return QUARTERS.map(quarter => {
      const quarterIncome = incomes
        .filter(income => {
          const date = new Date(income.date);
          return date.getFullYear() === currentYear && quarter.months.includes(date.getMonth());
        })
        .reduce((sum, income) => sum + income.amount, 0);

      const quarterExpenses = expenses
        .filter(expense => {
          const date = new Date(expense.date);
          return date.getFullYear() === currentYear && quarter.months.includes(date.getMonth());
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      const netIncome = quarterIncome - quarterExpenses;
      const estimatedTax = netIncome * 0.273;

      return {
        ...quarter,
        income: quarterIncome,
        expenses: quarterExpenses,
        netIncome,
        estimatedTax,
      };
    });
  }, [incomes, expenses, currentYear]);

  const deductionsByCategory = useMemo(() => {
    const categoryData = getExpensesByCategory();
    return categoryData.map(item => ({
      category: item.category,
      amount: item.amount,
    }));
  }, [expenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Tax Tools</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Yearly Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {currentYear} Tax Summary
          </Text>

          <GlassCard gradient intensity="strong" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={styles.summaryValue}>{formatCurrency(yearlyData.income)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>-{formatCurrency(yearlyData.expenses)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Net Income</Text>
              <Text style={[styles.summaryValue, styles.summaryValueBold]}>
                {formatCurrency(yearlyData.netIncome)}
              </Text>
            </View>
          </GlassCard>

          <GlassCard intensity="medium" style={styles.taxCard}>
            <MaterialIcons name="account-balance" size={32} color="#ffffff" />
            <Text style={styles.taxLabel}>Estimated Tax Owed</Text>
            <Text style={styles.taxAmount}>{formatCurrency(yearlyData.totalEstimatedTax)}</Text>
            <View style={styles.taxBreakdown}>
              <Text style={styles.taxBreakdownText}>
                Self-Employment Tax: {formatCurrency(yearlyData.selfEmploymentTax)}
              </Text>
              <Text style={styles.taxBreakdownText}>
                Income Tax (est.): {formatCurrency(yearlyData.estimatedIncomeTax)}
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* Quarterly Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quarterly Breakdown
          </Text>

          <View style={styles.quartersGrid}>
            {quarterlyData.map((quarter) => (
              <GlassCard key={quarter.id} intensity="light" style={styles.quarterCard}>
                <View style={[styles.quarterBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.quarterBadgeText}>{quarter.label}</Text>
                </View>
                <Text style={[styles.quarterName, { color: theme.colors.textSecondary }]}>
                  {quarter.name}
                </Text>
                <View style={styles.quarterStats}>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.quarterStatLabel, { color: theme.colors.textSecondary }]}>
                      Income
                    </Text>
                    <Text style={[styles.quarterStatValue, { color: theme.colors.success }]}>
                      {formatCurrency(quarter.income)}
                    </Text>
                  </View>
                  <View style={styles.quarterStat}>
                    <Text style={[styles.quarterStatLabel, { color: theme.colors.textSecondary }]}>
                      Expenses
                    </Text>
                    <Text style={[styles.quarterStatValue, { color: theme.colors.expense }]}>
                      {formatCurrency(quarter.expenses)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.quarterTax, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text style={[styles.quarterTaxLabel, { color: theme.colors.text }]}>
                    Est. Tax:
                  </Text>
                  <Text style={[styles.quarterTaxValue, { color: theme.colors.primary }]}>
                    {formatCurrency(quarter.estimatedTax)}
                  </Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* Deduction Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Deduction Categories
          </Text>

          <GlassCard intensity="light" style={styles.deductionsCard}>
            {deductionsByCategory.length > 0 ? (
              deductionsByCategory.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.deductionRow,
                    index !== deductionsByCategory.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.deductionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <MaterialIcons name="receipt" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.deductionCategory, { color: theme.colors.text }]}>
                    {item.category}
                  </Text>
                  <Text style={[styles.deductionAmount, { color: theme.colors.success }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyDeductions}>
                <MaterialIcons name="receipt-long" size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No deductible expenses yet
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Tax Checklist */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Tax Preparation Checklist
          </Text>

          <GlassCard intensity="light" style={styles.checklistCard}>
            {TAX_CHECKLIST.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.checklistItem,
                  index !== TAX_CHECKLIST.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <MaterialIcons name={item.icon} size={24} color={theme.colors.primary} />
                <Text style={[styles.checklistText, { color: theme.colors.text }]}>
                  {item.label}
                </Text>
                <View style={[styles.checkbox, { borderColor: theme.colors.border }]}>
                  <MaterialIcons name="check" size={16} color={theme.colors.textTertiary} />
                </View>
              </View>
            ))}
          </GlassCard>
        </View>

        {/* Tax Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Tax Tips for Gig Workers
          </Text>

          {TAX_TIPS.map((tip, index) => (
            <GlassCard key={index} intensity="light" style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <MaterialIcons name={tip.icon} size={24} color={theme.colors.warning} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: theme.colors.text }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
                  {tip.description}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Disclaimer */}
        <GlassCard intensity="medium" style={styles.disclaimerCard}>
          <MaterialIcons name="warning-amber" size={24} color={theme.colors.warning} />
          <Text style={[styles.disclaimerTitle, { color: theme.colors.text }]}>
            Disclaimer
          </Text>
          <Text style={[styles.disclaimerText, { color: theme.colors.textSecondary }]}>
            This tool provides estimates only. Tax calculations are simplified and may not reflect your actual tax liability. Always consult with a qualified tax professional for accurate tax advice and preparation.
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryCard: {
    padding: 24,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#ffffff',
    opacity: 0.9,
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  summaryValueBold: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 8,
  },
  taxCard: {
    padding: 24,
    alignItems: 'center',
  },
  taxLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 12,
    opacity: 0.9,
  },
  taxAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 16,
  },
  taxBreakdown: {
    alignItems: 'center',
  },
  taxBreakdownText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  quartersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quarterCard: {
    width: '48%',
    padding: 16,
  },
  quarterBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  quarterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  quarterName: {
    fontSize: 12,
    marginBottom: 12,
  },
  quarterStats: {
    marginBottom: 12,
  },
  quarterStat: {
    marginBottom: 8,
  },
  quarterStatLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  quarterStatValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  quarterTax: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
  },
  quarterTaxLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  quarterTaxValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  deductionsCard: {
    padding: 16,
  },
  deductionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deductionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deductionCategory: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  deductionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDeductions: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  checklistCard: {
    padding: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  disclaimerCard: {
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
