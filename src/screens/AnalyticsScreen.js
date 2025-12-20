import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/common/GlassCard';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 200;

const PieChart = ({ data, colors, theme }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      x,
      y,
      'Z',
    ].join(' ');
  };

  const centerX = CHART_WIDTH / 2;
  const centerY = CHART_HEIGHT / 2;
  const radius = Math.min(centerX, centerY) - 20;

  return (
    <View style={styles.pieChartContainer}>
      <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const path = describeArc(centerX, centerY, radius, currentAngle, currentAngle + angle);
          currentAngle += angle;

          return (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: radius * 2,
                height: radius * 2,
                left: centerX - radius,
                top: centerY - radius,
                backgroundColor: colors[index % colors.length],
                transform: [{ rotate: `${currentAngle - angle}deg` }],
              }}
            />
          );
        })}
      </View>
      <View style={styles.pieChartLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>
              {item.label}: ${item.value.toFixed(2)} ({((item.value / total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const BarChart = ({ data, color, theme }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const barWidth = (CHART_WIDTH / data.length) - 16;

  return (
    <View style={styles.barChartContainer}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (CHART_HEIGHT - 40);
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <Text style={[styles.barValue, { color: theme.colors.text }]}>
                  ${item.value.toFixed(0)}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: barWidth,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.barLabel, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const LineChart = ({ incomeData, expenseData, theme }) => {
  if (!incomeData || incomeData.length === 0) return null;

  const maxValue = Math.max(
    ...incomeData.map(d => d.value),
    ...expenseData.map(d => d.value),
    1
  );

  const pointWidth = CHART_WIDTH / (incomeData.length - 1 || 1);

  return (
    <View style={styles.lineChartContainer}>
      <View style={[styles.chartCanvas, { height: CHART_HEIGHT }]}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.gridLine,
              {
                top: (CHART_HEIGHT / 4) * i,
                backgroundColor: theme.colors.border,
              },
            ]}
          />
        ))}

        {/* Income line */}
        {incomeData.map((point, index) => {
          if (index === incomeData.length - 1) return null;
          const nextPoint = incomeData[index + 1];
          const y1 = CHART_HEIGHT - (point.value / maxValue) * CHART_HEIGHT;
          const y2 = CHART_HEIGHT - (nextPoint.value / maxValue) * CHART_HEIGHT;
          const x1 = pointWidth * index;
          const x2 = pointWidth * (index + 1);

          return (
            <View
              key={`income-${index}`}
              style={[
                styles.line,
                {
                  left: x1,
                  top: y1,
                  width: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                  transform: [{ rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad` }],
                  backgroundColor: theme.colors.success,
                },
              ]}
            />
          );
        })}

        {/* Expense line */}
        {expenseData.map((point, index) => {
          if (index === expenseData.length - 1) return null;
          const nextPoint = expenseData[index + 1];
          const y1 = CHART_HEIGHT - (point.value / maxValue) * CHART_HEIGHT;
          const y2 = CHART_HEIGHT - (nextPoint.value / maxValue) * CHART_HEIGHT;
          const x1 = pointWidth * index;
          const x2 = pointWidth * (index + 1);

          return (
            <View
              key={`expense-${index}`}
              style={[
                styles.line,
                {
                  left: x1,
                  top: y1,
                  width: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                  transform: [{ rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad` }],
                  backgroundColor: theme.colors.expense,
                },
              ]}
            />
          );
        })}

        {/* Income points */}
        {incomeData.map((point, index) => {
          const y = CHART_HEIGHT - (point.value / maxValue) * CHART_HEIGHT;
          const x = pointWidth * index;
          return (
            <View
              key={`income-point-${index}`}
              style={[
                styles.point,
                {
                  left: x - 4,
                  top: y - 4,
                  backgroundColor: theme.colors.success,
                },
              ]}
            />
          );
        })}

        {/* Expense points */}
        {expenseData.map((point, index) => {
          const y = CHART_HEIGHT - (point.value / maxValue) * CHART_HEIGHT;
          const x = pointWidth * index;
          return (
            <View
              key={`expense-point-${index}`}
              style={[
                styles.point,
                {
                  left: x - 4,
                  top: y - 4,
                  backgroundColor: theme.colors.expense,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Labels */}
      <View style={styles.lineLabels}>
        {incomeData.map((point, index) => (
          <Text
            key={index}
            style={[styles.lineLabel, { color: theme.colors.textSecondary, width: pointWidth }]}
          >
            {point.label}
          </Text>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.lineLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.expense }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Expenses</Text>
        </View>
      </View>
    </View>
  );
};

export const AnalyticsScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const {
    incomes,
    expenses,
    getTotalIncome,
    getTotalExpenses,
    getNetIncome,
    getExpensesByCategory,
    getIncomeByPlatform,
  } = useFinanceStore();

  const [selectedPeriod, setSelectedPeriod] = useState('All Time');

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netIncome = getNetIncome();

  const expensesByCategory = useMemo(() => {
    const data = getExpensesByCategory();
    return data.map(item => ({
      label: item.category,
      value: item.amount,
    }));
  }, [expenses]);

  const incomeByPlatform = useMemo(() => {
    const data = getIncomeByPlatform();
    return data.map(item => ({
      label: item.platform,
      value: item.amount,
    }));
  }, [incomes]);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);

    incomes.forEach(income => {
      const date = new Date(income.date);
      if (date.getFullYear() === currentYear) {
        monthlyIncome[date.getMonth()] += income.amount;
      }
    });

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        monthlyExpenses[date.getMonth()] += expense.amount;
      }
    });

    return {
      income: months.map((month, index) => ({
        label: month,
        value: monthlyIncome[index],
      })),
      expenses: months.map((month, index) => ({
        label: month,
        value: monthlyExpenses[index],
      })),
    };
  }, [incomes, expenses]);

  const categoryColors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
    '#14b8a6',
    '#f97316',
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <GlassCard intensity="medium" style={[styles.summaryCard, styles.summaryCardHalf]}>
            <MaterialIcons name="trending-up" size={24} color={theme.colors.success} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Income</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </GlassCard>

          <GlassCard intensity="medium" style={[styles.summaryCard, styles.summaryCardHalf]}>
            <MaterialIcons name="trending-down" size={24} color={theme.colors.expense} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.expense }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </GlassCard>
        </View>

        <GlassCard gradient intensity="strong" style={styles.netIncomeCard}>
          <Text style={styles.netIncomeLabel}>Net Income</Text>
          <Text style={[styles.netIncomeValue, { color: netIncome >= 0 ? '#10b981' : '#ef4444' }]}>
            ${netIncome.toFixed(2)}
          </Text>
          <Text style={styles.netIncomeSubtext}>
            {netIncome >= 0 ? 'Great job!' : 'Expenses exceed income'}
          </Text>
        </GlassCard>

        {/* Income vs Expenses Trend */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Income vs Expenses Trend
          </Text>
          <GlassCard intensity="light" style={styles.chartCard}>
            {incomes.length > 0 || expenses.length > 0 ? (
              <LineChart
                incomeData={monthlyData.income}
                expenseData={monthlyData.expenses}
                theme={theme}
              />
            ) : (
              <View style={styles.emptyChart}>
                <MaterialIcons name="show-chart" size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyChartText, { color: theme.colors.textSecondary }]}>
                  No data available
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Expenses by Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Expenses by Category
          </Text>
          <GlassCard intensity="light" style={styles.chartCard}>
            {expensesByCategory.length > 0 ? (
              <>
                <BarChart data={expensesByCategory} color={theme.colors.expense} theme={theme} />
              </>
            ) : (
              <View style={styles.emptyChart}>
                <MaterialIcons name="pie-chart" size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyChartText, { color: theme.colors.textSecondary }]}>
                  No expenses to analyze
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Income by Platform */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Income by Platform</Text>
          <GlassCard intensity="light" style={styles.chartCard}>
            {incomeByPlatform.length > 0 ? (
              <BarChart data={incomeByPlatform} color={theme.colors.success} theme={theme} />
            ) : (
              <View style={styles.emptyChart}>
                <MaterialIcons name="bar-chart" size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyChartText, { color: theme.colors.textSecondary }]}>
                  No income to analyze
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Financial Health Score */}
        <GlassCard gradient intensity="medium" style={styles.healthCard}>
          <MaterialIcons name="favorite" size={32} color="#ffffff" />
          <Text style={styles.healthTitle}>Financial Health Score</Text>
          <Text style={styles.healthScore}>
            {totalIncome > 0 ? Math.min(100, Math.round((netIncome / totalIncome) * 100 + 50)) : 0}
          </Text>
          <Text style={styles.healthSubtext}>
            {totalIncome > 0 && netIncome > 0 ? 'Looking good!' : 'Keep tracking your finances'}
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    padding: 16,
  },
  summaryCardHalf: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  netIncomeCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  netIncomeLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  netIncomeValue: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  netIncomeSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chartCard: {
    padding: 20,
  },
  emptyChart: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    marginTop: 12,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChartLegend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
  },
  barChartContainer: {
    width: CHART_WIDTH,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_HEIGHT,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT - 40,
  },
  bar: {
    borderRadius: 4,
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  lineChartContainer: {
    width: CHART_WIDTH,
  },
  chartCanvas: {
    position: 'relative',
    width: CHART_WIDTH,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.2,
  },
  line: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lineLabels: {
    flexDirection: 'row',
    marginTop: 8,
  },
  lineLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  lineLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  healthCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  healthTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    opacity: 0.9,
  },
  healthScore: {
    fontSize: 64,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 8,
  },
  healthSubtext: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
    opacity: 0.8,
  },
});
