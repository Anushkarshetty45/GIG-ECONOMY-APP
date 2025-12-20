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

const INSURANCE_TYPES = [
  {
    id: 'health',
    name: 'Health Insurance',
    icon: 'local-hospital',
    color: '#ef4444',
    description: 'Medical, dental, and vision coverage',
    importance: 'Critical',
    avgCost: '$450/month',
  },
  {
    id: 'auto',
    name: 'Auto Insurance',
    icon: 'directions-car',
    color: '#3b82f6',
    description: 'Vehicle coverage for rideshare/delivery',
    importance: 'Critical',
    avgCost: '$200/month',
  },
  {
    id: 'liability',
    name: 'Liability Insurance',
    icon: 'security',
    color: '#8b5cf6',
    description: 'Professional liability protection',
    importance: 'Recommended',
    avgCost: '$50/month',
  },
  {
    id: 'disability',
    name: 'Disability Insurance',
    icon: 'healing',
    color: '#f59e0b',
    description: 'Income protection if unable to work',
    importance: 'Recommended',
    avgCost: '$100/month',
  },
  {
    id: 'life',
    name: 'Life Insurance',
    icon: 'favorite',
    color: '#ec4899',
    description: 'Financial protection for dependents',
    importance: 'Optional',
    avgCost: '$75/month',
  },
  {
    id: 'equipment',
    name: 'Equipment Insurance',
    icon: 'devices',
    color: '#10b981',
    description: 'Coverage for tools, cameras, laptops',
    importance: 'Optional',
    avgCost: '$30/month',
  },
];

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
  const [myPolicies, setMyPolicies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    type: 'health',
    provider: '',
    policyNumber: '',
    monthlyCost: '',
    coverage: '',
    startDate: new Date().toISOString().split('T')[0],
    renewalDate: '',
  });

  const handleOpenModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData(policy);
    } else {
      setEditingPolicy(null);
      setFormData({
        type: 'health',
        provider: '',
        policyNumber: '',
        monthlyCost: '',
        coverage: '',
        startDate: new Date().toISOString().split('T')[0],
        renewalDate: '',
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.provider || !formData.monthlyCost) {
      Alert.alert('Error', 'Please fill in provider and monthly cost');
      return;
    }

    const policyData = {
      id: editingPolicy ? editingPolicy.id : Date.now().toString(),
      ...formData,
      monthlyCost: parseFloat(formData.monthlyCost),
    };

    if (editingPolicy) {
      setMyPolicies(myPolicies.map(p => p.id === editingPolicy.id ? policyData : p));
    } else {
      setMyPolicies([...myPolicies, policyData]);
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
          onPress: () => setMyPolicies(myPolicies.filter(p => p.id !== id)),
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

  const totalMonthlyCost = myPolicies.reduce((sum, policy) => sum + policy.monthlyCost, 0);
  const totalYearlyCost = totalMonthlyCost * 12;

  const getInsuranceTypeDetails = (typeId) => {
    return INSURANCE_TYPES.find(t => t.id === typeId) || INSURANCE_TYPES[0];
  };

  const hasPolicyType = (typeId) => {
    return myPolicies.some(p => p.type === typeId);
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
                        Monthly Cost
                      </Text>
                      <Text style={[styles.policyDetailValue, { color: theme.colors.primary }]}>
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
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => {
                    if (!hasPolicy) {
                      setFormData({ ...formData, type: type.id });
                      handleOpenModal();
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
                    <View style={styles.insuranceTypeMeta}>
                      <View style={[
                        styles.importanceBadge,
                        {
                          backgroundColor: type.importance === 'Critical'
                            ? theme.colors.expense + '20'
                            : type.importance === 'Recommended'
                            ? theme.colors.warning + '20'
                            : theme.colors.textTertiary + '20'
                        }
                      ]}>
                        <Text style={[
                          styles.importanceText,
                          {
                            color: type.importance === 'Critical'
                              ? theme.colors.expense
                              : type.importance === 'Recommended'
                              ? theme.colors.warning
                              : theme.colors.textSecondary
                          }
                        ]}>
                          {type.importance}
                        </Text>
                      </View>
                      <Text style={[styles.avgCost, { color: theme.colors.textTertiary }]}>
                        {type.avgCost}
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

              {/* Monthly Cost */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Monthly Cost *</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }]}
                  placeholder="450.00"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={formData.monthlyCost}
                  onChangeText={(text) => setFormData({ ...formData, monthlyCost: text })}
                />
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
