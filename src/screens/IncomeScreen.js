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

const PLATFORMS = [
  'Uber',
  'Lyft',
  'DoorDash',
  'UberEats',
  'Instacart',
  'Upwork',
  'Fiverr',
  'Freelance',
  'Other',
];

export const IncomeScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { incomes, addIncome, updateIncome, deleteIncome, getTotalIncome } = useFinanceStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    platform: 'Uber',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleOpenModal = (income = null) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        amount: income.amount.toString(),
        platform: income.platform,
        date: income.date,
        notes: income.notes || '',
      });
    } else {
      setEditingIncome(null);
      setFormData({
        amount: '',
        platform: 'Uber',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const incomeData = {
      amount: parseFloat(formData.amount),
      platform: formData.platform,
      date: formData.date,
      notes: formData.notes,
    };

    if (editingIncome) {
      updateIncome(editingIncome.id, incomeData);
    } else {
      addIncome(incomeData);
    }

    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteIncome(id),
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

  const totalIncome = getTotalIncome();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Income</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Total Income Card */}
      <View style={styles.totalCard}>
        <GlassCard gradient intensity="strong" style={styles.totalCardInner}>
          <MaterialIcons name="attach-money" size={32} color="#ffffff" />
          <Text style={styles.totalLabel}>Total Income</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
          <Text style={styles.totalSubtext}>{incomes.length} entries</Text>
        </GlassCard>
      </View>

      {/* Income List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {incomes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="account-balance-wallet" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No income entries yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
              Track your earnings by adding your first income entry
            </Text>
          </View>
        ) : (
          incomes.map((income) => (
            <GlassCard key={income.id} intensity="light" style={styles.incomeCard}>
              <View style={styles.incomeHeader}>
                <View style={styles.incomeInfo}>
                  <View style={[styles.platformBadge, { backgroundColor: theme.colors.primary }]}>
                    <MaterialIcons name="work" size={16} color="#ffffff" />
                    <Text style={styles.platformText}>{income.platform}</Text>
                  </View>
                  <Text style={[styles.incomeDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(income.date)}
                  </Text>
                </View>
                <View style={styles.incomeActions}>
                  <TouchableOpacity
                    onPress={() => handleOpenModal(income)}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                  >
                    <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(income.id)}
                    style={[styles.actionButton, { backgroundColor: theme.colors.expense + '20' }]}
                  >
                    <MaterialIcons name="delete" size={18} color={theme.colors.expense} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.incomeAmount, { color: theme.colors.success }]}>
                {formatCurrency(income.amount)}
              </Text>

              {income.notes ? (
                <Text style={[styles.incomeNotes, { color: theme.colors.textSecondary }]}>
                  {income.notes}
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
                {editingIncome ? 'Edit Income' : 'Add Income'}
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
                  placeholder="150.00"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                />
              </View>

              {/* Platform Selector */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Platform *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
                  {PLATFORMS.map((platform) => (
                    <TouchableOpacity
                      key={platform}
                      style={[
                        styles.platformChip,
                        {
                          backgroundColor: formData.platform === platform
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: formData.platform === platform
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, platform })}
                    >
                      <Text
                        style={[
                          styles.platformChipText,
                          {
                            color: formData.platform === platform
                              ? '#ffffff'
                              : theme.colors.text,
                          },
                        ]}
                      >
                        {platform}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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

              {/* Notes Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="Add notes..."
                  placeholderTextColor={theme.colors.textTertiary}
                  multiline
                  numberOfLines={4}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                />
              </View>

              <Button
                title={editingIncome ? 'Update Income' : 'Save Income'}
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
    marginBottom: 20,
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
  incomeCard: {
    padding: 16,
    marginBottom: 12,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incomeInfo: {
    flex: 1,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  platformText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  incomeDate: {
    fontSize: 13,
  },
  incomeActions: {
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
  incomeAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  incomeNotes: {
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  platformScroll: {
    marginTop: 8,
  },
  platformChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  platformChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 20,
  },
});
