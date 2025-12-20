import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

const CATEGORIES = [
  { name: 'Gas', icon: 'local-gas-station' },
  { name: 'Food', icon: 'restaurant' },
  { name: 'Office Supplies', icon: 'inventory' },
  { name: 'Equipment', icon: 'devices' },
  { name: 'Insurance', icon: 'security' },
  { name: 'Phone', icon: 'phone-iphone' },
  { name: 'Maintenance', icon: 'build' },
  { name: 'Parking', icon: 'local-parking' },
  { name: 'Other', icon: 'category' },
];

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'Other'];

export const ExpensesScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { expenses, addExpense, updateExpense, deleteExpense, getTotalExpenses } = useFinanceStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Gas',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
  });

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || '',
        date: expense.date,
        paymentMethod: expense.paymentMethod,
      });
    } else {
      setEditingExpense(null);
      setFormData({
        amount: '',
        category: 'Gas',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const expenseData = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(id),
        },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredExpenses = selectedFilter === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === selectedFilter);

  const totalExpenses = getTotalExpenses();

  const getCategoryIcon = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category ? category.icon : 'category';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Expenses</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Total Expenses Card */}
      <View style={styles.totalCard}>
        <GlassCard gradient intensity="strong" style={styles.totalCardInner}>
          <MaterialIcons name="receipt" size={32} color="#ffffff" />
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalExpenses)}</Text>
          <Text style={styles.totalSubtext}>{expenses.length} entries</Text>
        </GlassCard>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedFilter === 'All' ? theme.colors.primary : theme.colors.backgroundAlt,
                borderColor: selectedFilter === 'All' ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setSelectedFilter('All')}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedFilter === 'All' ? '#ffffff' : theme.colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedFilter === category.name ? theme.colors.primary : theme.colors.backgroundAlt,
                  borderColor: selectedFilter === category.name ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedFilter(category.name)}
            >
              <MaterialIcons
                name={category.icon}
                size={16}
                color={selectedFilter === category.name ? '#ffffff' : theme.colors.text}
              />
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedFilter === category.name ? '#ffffff' : theme.colors.text },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expenses List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {selectedFilter === 'All' ? 'No expenses yet' : `No ${selectedFilter} expenses`}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
              Track your business expenses for better financial management
            </Text>
          </View>
        ) : (
          filteredExpenses.map((expense) => (
            <GlassCard key={expense.id} intensity="light" style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseInfo}>
                  <View style={styles.categoryRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: theme.colors.expense + '30' }]}>
                      <MaterialIcons name={getCategoryIcon(expense.category)} size={20} color={theme.colors.expense} />
                    </View>
                    <View>
                      <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                        {expense.category}
                      </Text>
                      <Text style={[styles.expenseDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(expense.date)} • {expense.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.expenseActions}>
                  <TouchableOpacity
                    onPress={() => handleOpenModal(expense)}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                  >
                    <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(expense.id)}
                    style={[styles.actionButton, { backgroundColor: theme.colors.expense + '20' }]}
                  >
                    <MaterialIcons name="delete" size={18} color={theme.colors.expense} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.expenseAmount, { color: theme.colors.expense }]}>
                {formatCurrency(expense.amount)}
              </Text>

              {expense.description ? (
                <Text style={[styles.expenseDescription, { color: theme.colors.textSecondary }]}>
                  {expense.description}
                </Text>
              ) : null}
            </GlassCard>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleOpenModal()}
      >
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundAlt }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Amount Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Amount *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="45.00"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                />
              </View>

              {/* Category Selector */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Category *</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: formData.category === category.name
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: formData.category === category.name
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, category: category.name })}
                    >
                      <MaterialIcons
                        name={category.icon}
                        size={24}
                        color={formData.category === category.name ? '#ffffff' : theme.colors.text}
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          {
                            color: formData.category === category.name ? '#ffffff' : theme.colors.text,
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="What did you buy?"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Date Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Date *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
              </View>

              {/* Payment Method Selector */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Payment Method *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentChip,
                        {
                          backgroundColor: formData.paymentMethod === method
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: formData.paymentMethod === method
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, paymentMethod: method })}
                    >
                      <Text
                        style={[
                          styles.paymentChipText,
                          {
                            color: formData.paymentMethod === method ? '#ffffff' : theme.colors.text,
                          },
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Button
                title={editingExpense ? 'Update Expense' : 'Save Expense'}
                onPress={handleSave}
                style={styles.saveButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  totalCard: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  totalCardInner: {
    padding: 24,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
    opacity: 0.8,
  },
  filterSection: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  expenseCard: {
    padding: 16,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
  },
  expenseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    minWidth: '30%',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  paymentChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  paymentChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 20,
  },
});
