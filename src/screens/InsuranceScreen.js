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
import {
  INSURANCE_CATALOGUE,
  INSURANCE_PAYMENT_FREQUENCIES,
  INSURANCE_POLICY_STATUSES,
} from '../data/insuranceCatalogue';
import {
  calculateMonthlyPremium,
  calculateMonthlyAverages,
  getInsuranceAffordability,
  getInsurancePolicyStatus,
  generateInsuranceRecommendations,
} from '../utils/financialCalculations';

const INSURANCE_TYPES = INSURANCE_CATALOGUE.map((type) => ({
  id: type.value,
  name: type.label,
  icon: type.materialIcon,
  color: type.iconColor,
  description: type.description,
  avgCost: `$${type.estimatedMonthlyPremium}/month`,
}));

const INSURANCE_TIPS = [
  {
    title: 'Shop Around',
    description: 'Compare at least 3-5 providers to find the best rates and coverage',
    icon: 'search',
  },
  {
    title: 'Bundle & Save',
    description: 'Many insurers offer discounts when you bundle multiple policies',
    icon: 'loyalty',
  },
  {
    title: 'Increase Deductibles',
    description: 'Higher deductibles = lower premiums (but ensure you can afford it)',
    icon: 'trending-down',
  },
  {
    title: 'Annual Payments',
    description: 'Pay annually instead of monthly to save 5-10% on premiums',
    icon: 'event',
  },
];

export const InsuranceScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const {
    insurance: myPolicies,
    addInsurance,
    updateInsurance,
    deleteInsurance,
    getTotalInsuranceCost,
    incomes,
    expenses,
  } = useFinanceStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    type: 'health',
    provider: '',
    policyNumber: '',
    premiumAmount: '',
    paymentFrequency: 'monthly',
    coverage: '',
    startDate: new Date().toISOString().split('T')[0],
    renewalDate: '',
    status: 'active',
  });

  const handleOpenModal = (policy = null, initialType = 'health') => {
    if (policy) {
      const paymentFrequency = INSURANCE_PAYMENT_FREQUENCIES.includes(policy.paymentFrequency)
        ? policy.paymentFrequency
        : 'monthly';
      setEditingPolicy(policy);
      setFormData({
        ...policy,
        premiumAmount: String(
          policy.premiumAmount
          ?? (Number(policy.monthlyCost) || 0) * { monthly: 1, quarterly: 3, yearly: 12 }[paymentFrequency]
        ),
        paymentFrequency,
        coverage: policy.coverage || policy.coverageAmount || '',
        status: getInsurancePolicyStatus(policy),
      });
    } else {
      const estimate = INSURANCE_CATALOGUE.find((type) => type.value === initialType)
        ?.estimatedMonthlyPremium || 0;
      setEditingPolicy(null);
      setFormData({
        type: initialType,
        provider: '',
        policyNumber: '',
        premiumAmount: String(estimate),
        paymentFrequency: 'monthly',
        coverage: '',
        startDate: new Date().toISOString().split('T')[0],
        renewalDate: '',
        status: 'active',
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    const premiumAmount = Number(formData.premiumAmount);
    if (!formData.provider.trim() || !Number.isFinite(premiumAmount) || premiumAmount <= 0) {
      Alert.alert('Error', 'Please fill in provider and a positive premium amount');
      return;
    }

    const policyData = {
      ...formData,
      premiumAmount,
      monthlyCost: calculateMonthlyPremium(premiumAmount, formData.paymentFrequency),
      coverageAmount: formData.coverage,
    };

    if (editingPolicy) {
      updateInsurance(editingPolicy.id, policyData);
    } else {
      addInsurance(policyData);
    }

    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Policy',
      'Are you sure you want to remove this insurance policy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteInsurance(id),
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

  const totalMonthlyCost = getTotalInsuranceCost();
  const totalYearlyCost = totalMonthlyCost * 12;
  const { monthlyIncome, monthlyExpenses } = calculateMonthlyAverages(incomes, expenses);
  const monthlyDisposableIncome = monthlyIncome - monthlyExpenses - totalMonthlyCost;
  const recommendations = generateInsuranceRecommendations({
    monthlyIncome,
    monthlyExpenses,
    expenses,
    policies: myPolicies,
  });

  const getInsuranceTypeDetails = (typeId) => {
    return INSURANCE_TYPES.find(t => t.id === typeId) || INSURANCE_TYPES[0];
  };

  const hasPolicyType = (typeId) => {
    return myPolicies.some(p => p.type === typeId && getInsurancePolicyStatus(p) === 'active');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Insurance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Total Cost Card */}
        <GlassCard gradient intensity="strong" style={styles.totalCard}>
          <MaterialIcons name="account-balance-wallet" size={32} color="#ffffff" />
          <Text style={styles.totalLabel}>Total Insurance Cost</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalMonthlyCost)}/mo</Text>
          <Text style={styles.totalSubtext}>{formatCurrency(totalYearlyCost)}/year • {myPolicies.length} policies</Text>
        </GlassCard>

        {/* My Policies */}
        {myPolicies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                My Policies
              </Text>
              <TouchableOpacity onPress={() => handleOpenModal()}>
                <MaterialIcons name="add-circle" size={28} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {myPolicies.map((policy) => {
              const typeDetails = getInsuranceTypeDetails(policy.type);
              return (
                <GlassCard key={policy.id} intensity="light" style={styles.policyCard}>
                  <View style={styles.policyHeader}>
                    <View style={[styles.policyIcon, { backgroundColor: typeDetails.color + '30' }]}>
                      <MaterialIcons name={typeDetails.icon} size={24} color={typeDetails.color} />
                    </View>
                    <View style={styles.policyInfo}>
                      <Text style={[styles.policyType, { color: theme.colors.text }]}>
                        {typeDetails.name}
                      </Text>
                      <Text style={[styles.policyProvider, { color: theme.colors.textSecondary }]}>
                        {policy.provider}
                      </Text>
                      {policy.policyNumber && (
                        <Text style={[styles.policyNumber, { color: theme.colors.textTertiary }]}>
                          Policy: {policy.policyNumber}
                        </Text>
                      )}
                    </View>
                    <View style={styles.policyActions}>
                      <TouchableOpacity
                        onPress={() => handleOpenModal(policy)}
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                      >
                        <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(policy.id)}
                        style={[styles.actionButton, { backgroundColor: theme.colors.expense + '20' }]}
                      >
                        <MaterialIcons name="delete" size={18} color={theme.colors.expense} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.policyDetails}>
                    <View style={styles.policyDetail}>
                      <Text style={[styles.policyDetailLabel, { color: theme.colors.textSecondary }]}>
                        Premium / {policy.paymentFrequency || 'monthly'}
                      </Text>
                      <Text style={[styles.policyDetailValue, { color: theme.colors.primary }]}>
                        {formatCurrency(policy.premiumAmount ?? policy.monthlyCost)}
                      </Text>
                    </View>
                    <View style={styles.policyDetail}>
                      <Text style={[styles.policyDetailLabel, { color: theme.colors.textSecondary }]}>
                        Monthly equivalent · {getInsurancePolicyStatus(policy)}
                      </Text>
                      <Text style={[styles.policyDetailValue, { color: theme.colors.text }]}>
                        {formatCurrency(policy.monthlyCost)}
                      </Text>
                    </View>
                    {policy.coverage && (
                      <View style={styles.policyDetail}>
                        <Text style={[styles.policyDetailLabel, { color: theme.colors.textSecondary }]}>
                          Coverage
                        </Text>
                        <Text style={[styles.policyDetailValue, { color: theme.colors.text }]}>
                          {policy.coverage}
                        </Text>
                      </View>
                    )}
                    {policy.renewalDate && (
                      <View style={styles.policyDetail}>
                        <Text style={[styles.policyDetailLabel, { color: theme.colors.textSecondary }]}>
                          Renewal
                        </Text>
                        <Text style={[styles.policyDetailValue, { color: theme.colors.text }]}>
                          {new Date(policy.renewalDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </GlassCard>
              );
            })}
          </View>
        )}

        {/* Recommended Coverage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recommended Coverage
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Essential insurance for gig workers
          </Text>

          <View style={styles.insuranceGrid}>
            {INSURANCE_TYPES.map((type) => {
              const hasPolicy = hasPolicyType(type.id);
              const recommendation = recommendations.find((item) => item.type === type.id);
              const priority = recommendation?.priority || 'low';
              const importance = { high: 'Critical', medium: 'Recommended', low: 'Optional' }[priority];
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => {
                    if (!hasPolicy) {
                      handleOpenModal(null, type.id);
                    }
                  }}
                  style={styles.insuranceTypeButton}
                >
                  <GlassCard
                    intensity={hasPolicy ? 'medium' : 'light'}
                    style={[
                      styles.insuranceTypeCard,
                      hasPolicy && { borderWidth: 2, borderColor: theme.colors.success },
                    ]}
                  >
                    <View style={[styles.insuranceTypeIcon, { backgroundColor: type.color + '30' }]}>
                      <MaterialIcons name={type.icon} size={32} color={type.color} />
                      {hasPolicy && (
                        <View style={[styles.checkBadge, { backgroundColor: theme.colors.success }]}>
                          <MaterialIcons name="check" size={12} color="#ffffff" />
                        </View>
                      )}
                    </View>
                    <Text style={[styles.insuranceTypeName, { color: theme.colors.text }]}>
                      {type.name}
                    </Text>
                    <Text style={[styles.insuranceTypeDescription, { color: theme.colors.textSecondary }]}>
                      {type.description}
                    </Text>
                    <Text style={[styles.insuranceTypeDescription, { color: theme.colors.textSecondary }]}>
                      {recommendation?.reasons[0]}
                    </Text>
                    <View style={styles.insuranceTypeMeta}>
                      <View style={[
                        styles.importanceBadge,
                        {
                          backgroundColor: importance === 'Critical'
                            ? theme.colors.expense + '20'
                            : importance === 'Recommended'
                            ? theme.colors.warning + '20'
                            : theme.colors.textTertiary + '20'
                        }
                      ]}>
                        <Text style={[
                          styles.importanceText,
                          {
                            color: importance === 'Critical'
                              ? theme.colors.expense
                              : importance === 'Recommended'
                              ? theme.colors.warning
                              : theme.colors.textSecondary
                          }
                        ]}>
                          {importance}
                        </Text>
                      </View>
                      <Text style={[styles.avgCost, { color: theme.colors.textTertiary }]}>
                        Est. {type.avgCost} · not a quote
                      </Text>
                      <Text style={[styles.avgCost, { color: theme.colors.textSecondary }]}>
                        {getInsuranceAffordability(
                          Number(type.avgCost.replace(/[^0-9.]/g, '')),
                          monthlyDisposableIncome
                        )}
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Insurance Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Insurance Tips
          </Text>

          {INSURANCE_TIPS.map((tip, index) => (
            <GlassCard key={index} intensity="light" style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <MaterialIcons name={tip.icon} size={24} color={theme.colors.primary} />
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

        {/* Info Card */}
        <GlassCard intensity="medium" style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Why Insurance Matters
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            As a gig worker, you don't have employer-provided benefits. Having the right insurance protects you financially from unexpected events and provides peace of mind. Consider your specific needs based on your gig type and personal situation.
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Add Policy FAB */}
      {myPolicies.length === 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleOpenModal()}
        >
          <MaterialIcons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Add/Edit Policy Modal */}
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
                {editingPolicy ? 'Edit Policy' : 'Add Insurance Policy'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Insurance Type */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Insurance Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {INSURANCE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeChip,
                        {
                          backgroundColor: formData.type === type.id
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: formData.type === type.id
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, type: type.id })}
                    >
                      <MaterialIcons
                        name={type.icon}
                        size={20}
                        color={formData.type === type.id ? '#ffffff' : theme.colors.text}
                      />
                      <Text
                        style={[
                          styles.typeChipText,
                          {
                            color: formData.type === type.id ? '#ffffff' : theme.colors.text,
                          },
                        ]}
                      >
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Provider */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Insurance Provider *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="e.g., Blue Cross, State Farm"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.provider}
                  onChangeText={(text) => setFormData({ ...formData, provider: text })}
                />
              </View>

              {/* Policy Number */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Policy Number</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="Optional"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.policyNumber}
                  onChangeText={(text) => setFormData({ ...formData, policyNumber: text })}
                />
              </View>

              {/* Premium Amount */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Premium Amount Per Payment *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="450.00"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={formData.premiumAmount}
                  onChangeText={(text) => setFormData({ ...formData, premiumAmount: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Payment Frequency</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {INSURANCE_PAYMENT_FREQUENCIES.map((frequency) => (
                    <TouchableOpacity
                      key={frequency}
                      onPress={() => setFormData({ ...formData, paymentFrequency: frequency })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: formData.paymentFrequency === frequency
                          ? theme.colors.primary
                          : theme.colors.background,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                      }}
                    >
                      <Text style={{ color: formData.paymentFrequency === frequency ? '#ffffff' : theme.colors.text }}>
                        {frequency[0].toUpperCase() + frequency.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 8 }]}>
                  Monthly equivalent: {formatCurrency(
                    Number(formData.premiumAmount) > 0
                      ? calculateMonthlyPremium(Number(formData.premiumAmount), formData.paymentFrequency)
                      : 0
                  )}
                </Text>
              </View>

              {/* Coverage */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Coverage Amount/Details</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="e.g., $500k, $1M liability"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.coverage}
                  onChangeText={(text) => setFormData({ ...formData, coverage: text })}
                />
              </View>

              {/* Renewal Date */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Renewal Date</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={formData.renewalDate}
                  onChangeText={(text) => setFormData({ ...formData, renewalDate: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Policy Status</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {INSURANCE_POLICY_STATUSES.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setFormData({ ...formData, status })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: formData.status === status
                          ? theme.colors.primary
                          : theme.colors.background,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                      }}
                    >
                      <Text style={{ color: formData.status === status ? '#ffffff' : theme.colors.text }}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Button
                title={editingPolicy ? 'Update Policy' : 'Add Policy'}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  totalCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 12,
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 8,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
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
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8,
  },
  policyCard: {
    padding: 16,
    marginBottom: 12,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  policyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  policyInfo: {
    flex: 1,
  },
  policyType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  policyProvider: {
    fontSize: 14,
    marginBottom: 2,
  },
  policyNumber: {
    fontSize: 12,
  },
  policyActions: {
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
  policyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  policyDetail: {
    flex: 1,
    minWidth: '45%',
  },
  policyDetailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  policyDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  insuranceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insuranceTypeButton: {
    width: '48%',
  },
  insuranceTypeCard: {
    padding: 16,
    alignItems: 'center',
  },
  insuranceTypeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insuranceTypeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  insuranceTypeDescription: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  insuranceTypeMeta: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  importanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  avgCost: {
    fontSize: 12,
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
  infoCard: {
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
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
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    gap: 6,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 20,
  },
});
