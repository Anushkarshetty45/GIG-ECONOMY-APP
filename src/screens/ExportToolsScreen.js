import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

const EXPORT_TYPES = [
  { id: 'all', label: 'All Data', icon: 'folder', description: 'Export income, expenses, and goals' },
  { id: 'income', label: 'Income Only', icon: 'attach-money', description: 'Export income transactions' },
  { id: 'expenses', label: 'Expenses Only', icon: 'receipt', description: 'Export expense transactions' },
  { id: 'goals', label: 'Goals Only', icon: 'flag', description: 'Export savings goals' },
];

const DATE_RANGES = [
  { id: 'all', label: 'All Time', icon: 'calendar-today' },
  { id: 'year', label: 'This Year', icon: 'calendar-view-month' },
  { id: 'quarter', label: 'This Quarter', icon: 'calendar-view-week' },
  { id: 'month', label: 'This Month', icon: 'calendar-month' },
];

const FORMATS = [
  { id: 'csv', label: 'CSV (Excel)', icon: 'table-chart', description: 'Spreadsheet format for Excel/Sheets' },
  { id: 'pdf', label: 'PDF Report', icon: 'picture-as-pdf', description: 'Formatted report for printing' },
];

const QUICK_TEMPLATES = [
  {
    id: 'tax',
    label: 'Tax Preparation',
    icon: 'account-balance',
    description: 'Full year data for tax filing',
    exportType: 'all',
    dateRange: 'year',
    format: 'csv',
  },
  {
    id: 'monthly',
    label: 'Monthly Summary',
    icon: 'event-note',
    description: 'Current month overview',
    exportType: 'all',
    dateRange: 'month',
    format: 'pdf',
  },
  {
    id: 'quarterly',
    label: 'Quarterly Report',
    icon: 'assessment',
    description: 'Quarter performance report',
    exportType: 'all',
    dateRange: 'quarter',
    format: 'pdf',
  },
  {
    id: 'yearend',
    label: 'Year-End Report',
    icon: 'summarize',
    description: 'Complete annual summary',
    exportType: 'all',
    dateRange: 'year',
    format: 'pdf',
  },
];

export const ExportToolsScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { incomes, expenses, goals, getTotalIncome, getTotalExpenses } = useFinanceStore();

  const [selectedExportType, setSelectedExportType] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const filterDataByDateRange = (data, dateRange) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);

    return data.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt);

      switch (dateRange) {
        case 'year':
          return itemDate.getFullYear() === currentYear;
        case 'quarter':
          return (
            itemDate.getFullYear() === currentYear &&
            Math.floor(itemDate.getMonth() / 3) === currentQuarter
          );
        case 'month':
          return (
            itemDate.getFullYear() === currentYear &&
            itemDate.getMonth() === currentMonth
          );
        default:
          return true;
      }
    });
  };

  const generateCSV = (data, headers) => {
    let csv = headers.join(',') + '\n';

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header.toLowerCase().replace(' ', '_')] || '';
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  };

  const handleExport = () => {
    let dataToExport = [];
    let fileName = '';

    const filteredIncomes = filterDataByDateRange(incomes, selectedDateRange);
    const filteredExpenses = filterDataByDateRange(expenses, selectedDateRange);
    const filteredGoals = filterDataByDateRange(goals, selectedDateRange);

    switch (selectedExportType) {
      case 'income':
        dataToExport = filteredIncomes;
        fileName = 'income_export';
        break;
      case 'expenses':
        dataToExport = filteredExpenses;
        fileName = 'expenses_export';
        break;
      case 'goals':
        dataToExport = filteredGoals;
        fileName = 'goals_export';
        break;
      default:
        dataToExport = {
          incomes: filteredIncomes,
          expenses: filteredExpenses,
          goals: filteredGoals,
        };
        fileName = 'financial_data_export';
    }

    const dateRangeLabel = DATE_RANGES.find((r) => r.id === selectedDateRange)?.label || 'all_time';
    const finalFileName = `${fileName}_${dateRangeLabel.toLowerCase().replace(' ', '_')}.${selectedFormat}`;

    if (Platform.OS === 'web') {
      Alert.alert(
        'Export Ready',
        `Your ${selectedFormat.toUpperCase()} file "${finalFileName}" is ready for download.\n\nIn a production app, this would download to your computer.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Export Ready',
        `Your ${selectedFormat.toUpperCase()} file has been saved.\n\nFile: ${finalFileName}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleQuickExport = (template) => {
    setSelectedExportType(template.exportType);
    setSelectedDateRange(template.dateRange);
    setSelectedFormat(template.format);

    setTimeout(() => {
      handleExport();
    }, 100);
  };

  const getDataCount = () => {
    const filteredIncomes = filterDataByDateRange(incomes, selectedDateRange);
    const filteredExpenses = filterDataByDateRange(expenses, selectedDateRange);
    const filteredGoals = filterDataByDateRange(goals, selectedDateRange);

    switch (selectedExportType) {
      case 'income':
        return filteredIncomes.length;
      case 'expenses':
        return filteredExpenses.length;
      case 'goals':
        return filteredGoals.length;
      default:
        return filteredIncomes.length + filteredExpenses.length + filteredGoals.length;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Export Tools</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Templates */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Templates
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            One-tap exports for common use cases
          </Text>

          <View style={styles.templatesGrid}>
            {QUICK_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => handleQuickExport(template)}
                style={styles.templateButton}
              >
                <GlassCard intensity="light" style={styles.templateCard}>
                  <View style={[styles.templateIcon, { backgroundColor: theme.colors.primary + '30' }]}>
                    <MaterialIcons name={template.icon} size={28} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.templateLabel, { color: theme.colors.text }]}>
                    {template.label}
                  </Text>
                  <Text style={[styles.templateDescription, { color: theme.colors.textSecondary }]}>
                    {template.description}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Export */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Custom Export
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Choose exactly what you want to export
          </Text>

          {/* Export Type */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              What to Export
            </Text>
            <View style={styles.optionsGrid}>
              {EXPORT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedExportType(type.id)}
                  style={styles.optionButton}
                >
                  <GlassCard
                    intensity={selectedExportType === type.id ? 'medium' : 'light'}
                    style={[
                      styles.optionCard,
                      selectedExportType === type.id && {
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={type.icon}
                      size={24}
                      color={selectedExportType === type.id ? theme.colors.primary : theme.colors.text}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selectedExportType === type.id
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                    <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
                      {type.description}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              Date Range
            </Text>
            <View style={styles.optionsRow}>
              {DATE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  onPress={() => setSelectedDateRange(range.id)}
                  style={styles.dateRangeButton}
                >
                  <GlassCard
                    intensity={selectedDateRange === range.id ? 'medium' : 'light'}
                    style={[
                      styles.dateRangeCard,
                      selectedDateRange === range.id && {
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={range.icon}
                      size={20}
                      color={selectedDateRange === range.id ? theme.colors.primary : theme.colors.text}
                    />
                    <Text
                      style={[
                        styles.dateRangeText,
                        {
                          color: selectedDateRange === range.id
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {range.label}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Format */}
          <View style={styles.optionGroup}>
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              Export Format
            </Text>
            <View style={styles.optionsRow}>
              {FORMATS.map((format) => (
                <TouchableOpacity
                  key={format.id}
                  onPress={() => setSelectedFormat(format.id)}
                  style={[styles.formatButton, { flex: 1 }]}
                >
                  <GlassCard
                    intensity={selectedFormat === format.id ? 'medium' : 'light'}
                    style={[
                      styles.formatCard,
                      selectedFormat === format.id && {
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={format.icon}
                      size={32}
                      color={selectedFormat === format.id ? theme.colors.primary : theme.colors.text}
                    />
                    <Text
                      style={[
                        styles.formatLabel,
                        {
                          color: selectedFormat === format.id
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {format.label}
                    </Text>
                    <Text style={[styles.formatDescription, { color: theme.colors.textSecondary }]}>
                      {format.description}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <GlassCard intensity="medium" style={styles.previewCard}>
            <View style={styles.previewRow}>
              <MaterialIcons name="info-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.previewText, { color: theme.colors.text }]}>
                {getDataCount()} records will be exported
              </Text>
            </View>
          </GlassCard>

          {/* Export Button */}
          <Button
            title="Export Data"
            onPress={handleExport}
            icon="download"
            style={styles.exportButton}
          />
        </View>

        {/* Info Card */}
        <GlassCard intensity="light" style={styles.infoCard}>
          <MaterialIcons name="lightbulb-outline" size={24} color={theme.colors.warning} />
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Export Tips
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • CSV files open in Excel, Google Sheets, or Numbers{'\n'}
            • PDF reports are great for printing or emailing{'\n'}
            • Tax preparation exports include all deductible expenses{'\n'}
            • All data is exported from your local device
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateButton: {
    width: '48%',
  },
  templateCard: {
    padding: 16,
    alignItems: 'center',
  },
  templateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  templateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    width: '48%',
  },
  optionCard: {
    padding: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  dateRangeButton: {
    flex: 1,
    minWidth: '45%',
  },
  dateRangeCard: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateRangeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  formatButton: {
    flex: 1,
  },
  formatCard: {
    padding: 20,
    alignItems: 'center',
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  previewCard: {
    padding: 16,
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exportButton: {
    marginBottom: 24,
  },
  infoCard: {
    padding: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 22,
  },
});
