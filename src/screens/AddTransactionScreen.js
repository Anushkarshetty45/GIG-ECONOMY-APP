import React, { useState, useEffect } from 'react';
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
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { validateAmount, validateDescription } from '../utils/validation';

export const AddTransactionScreen = ({ route, navigation }) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { addTransaction, categories, fetchCategories } = useUserStore();

  const transactionType = route.params?.type || 'expense'; // 'income' or 'expense'

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      fetchCategories(user.id);
    }
  }, [user]);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate amount
    const amountValidation = validateAmount(formData.amount);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }

    // Validate description
    const descriptionValidation = validateDescription(formData.description, 3, 200);
    if (!descriptionValidation.valid) {
      newErrors.description = descriptionValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    // Sanitize and validate inputs
    const amountValidation = validateAmount(formData.amount);
    const descriptionValidation = validateDescription(formData.description, 3, 200);

    const transaction = {
      user_id: user.id,
      type: transactionType,
      amount: amountValidation.sanitized,
      description: descriptionValidation.sanitized,
      category_id: formData.categoryId || null,
      date: formData.date,
      created_at: new Date().toISOString(),
    };

    const result = await addTransaction(transaction);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        `${transactionType === 'income' ? 'Income' : 'Expense'} added successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  const filteredCategories = categories.filter(c => c.type === transactionType);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          transactionType === 'income'
            ? theme.colors.gradient3
            : theme.colors.gradient2
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.glassMedium,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {transactionType === 'income' ? 'Add Income' : 'Record Expense'}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard intensity="medium" style={styles.formCard}>
            {/* Transaction Type Indicator */}
            <View
              style={[
                styles.typeIndicator,
                {
                  backgroundColor:
                    transactionType === 'income'
                      ? theme.colors.income
                      : theme.colors.expense,
                },
              ]}
            >
              <MaterialIcons
                name={transactionType === 'income' ? 'arrow-downward' : 'arrow-upward'}
                size={32}
                color="#ffffff"
              />
              <Text style={styles.typeText}>
                {transactionType === 'income' ? 'Income' : 'Expense'}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.amountSection}>
              <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>
                $
              </Text>
              <Input
                placeholder="0.00"
                value={formData.amount}
                onChangeText={(value) => updateField('amount', value)}
                keyboardType="decimal-pad"
                error={errors.amount}
                inputStyle={styles.amountInput}
                style={styles.amountInputContainer}
              />
            </View>

            {/* Description */}
            <Input
              label="Description"
              placeholder={
                transactionType === 'income'
                  ? 'e.g., Freelance project payment'
                  : 'e.g., Grocery shopping'
              }
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              icon="description"
              error={errors.description}
            />

            {/* Category Selection */}
            <View style={styles.categorySection}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Category (Optional)
              </Text>

              <View style={styles.categoriesGrid}>
                {filteredCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => updateField('categoryId', category.id)}
                    style={[
                      styles.categoryChip,
                      formData.categoryId === category.id && styles.categoryChipSelected,
                      {
                        backgroundColor:
                          formData.categoryId === category.id
                            ? category.color || theme.colors.primary
                            : theme.colors.glassMedium,
                        borderColor:
                          formData.categoryId === category.id
                            ? category.color || theme.colors.primary
                            : theme.colors.border,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={category.icon || 'category'}
                      size={20}
                      color={
                        formData.categoryId === category.id
                          ? '#ffffff'
                          : theme.colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color:
                            formData.categoryId === category.id
                              ? '#ffffff'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date */}
            <Input
              label="Date"
              value={formData.date}
              onChangeText={(value) => updateField('date', value)}
              icon="calendar-today"
              placeholder="YYYY-MM-DD"
            />

            {/* Submit Button */}
            <Button
              title={`Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
              variant="primary"
              size="large"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </GlassCard>

          {/* Quick Tips */}
          <GlassCard intensity="light" style={styles.tipsCard}>
            <View style={styles.tipHeader}>
              <MaterialIcons name="lightbulb" size={20} color={theme.colors.warning} />
              <Text style={[styles.tipTitle, { color: theme.colors.text }]}>
                Quick Tips
              </Text>
            </View>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              {transactionType === 'income'
                ? '• Track all income sources for accurate tax calculations\n• Include freelance, gig work, and side hustles\n• Regular tracking helps with financial planning'
                : '• Categorize expenses to see spending patterns\n• Keep receipts for tax deductions\n• Regular tracking helps identify savings opportunities'}
            </Text>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formCard: {
    padding: 24,
    marginBottom: 16,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
  },
  categorySection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryChipSelected: {
    borderWidth: 2,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
  tipsCard: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
