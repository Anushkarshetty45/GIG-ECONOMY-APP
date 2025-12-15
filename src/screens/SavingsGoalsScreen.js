import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const SavingsGoalsScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { savingsGoals, fetchSavingsGoals, addSavingsGoal } = useUserStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    frequency: 'monthly',
    autoSave: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavingsGoals(user.id);
    }
  }, [user]);

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = async () => {
    if (!formData.name || !formData.targetAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    const goal = {
      user_id: user.id,
      name: formData.name,
      target_amount: parseFloat(formData.targetAmount),
      current_amount: parseFloat(formData.currentAmount),
      deadline: formData.deadline || null,
      frequency: formData.frequency,
      auto_save: formData.autoSave,
      icon: 'flag',
      color: theme.colors.primary,
      created_at: new Date().toISOString(),
    };

    const result = await addSavingsGoal(goal);
    setLoading(false);

    if (result.success) {
      setShowAddModal(false);
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        frequency: 'monthly',
        autoSave: false,
      });
      Alert.alert('Success', 'Savings goal created!');
    } else {
      Alert.alert('Error', result.error || 'Failed to create goal');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={theme.colors.gradient3}
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
          Savings Goals
        </Text>

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {savingsGoals.length === 0 ? (
          <GlassCard intensity="medium" style={styles.emptyCard}>
            <MaterialIcons name="flag" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Goals Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Start saving for your dreams! Create your first savings goal.
            </Text>
            <Button
              title="Create Goal"
              variant="primary"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyButton}
            />
          </GlassCard>
        ) : (
          savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysLeft = getDaysUntilDeadline(goal.deadline);

            return (
              <GlassCard key={goal.id} intensity="medium" style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View
                    style={[
                      styles.goalIcon,
                      { backgroundColor: goal.color || theme.colors.primary },
                    ]}
                  >
                    <MaterialIcons
                      name={goal.icon || 'flag'}
                      size={24}
                      color="#ffffff"
                    />
                  </View>

                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalName, { color: theme.colors.text }]}>
                      {goal.name}
                    </Text>
                    {daysLeft !== null && (
                      <Text style={[styles.goalDeadline, { color: theme.colors.textSecondary }]}>
                        {daysLeft} days left
                      </Text>
                    )}
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressText, { color: theme.colors.text }]}>
                      {formatCurrency(goal.current_amount)}
                    </Text>
                    <Text style={[styles.targetText, { color: theme.colors.textSecondary }]}>
                      of {formatCurrency(goal.target_amount)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.progressBarBg,
                      { backgroundColor: theme.colors.borderLight },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: goal.color || theme.colors.primary,
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.progressPercentage, { color: theme.colors.textSecondary }]}>
                    {progress.toFixed(0)}% Complete
                  </Text>
                </View>

                {/* Auto-save Badge */}
                {goal.auto_save && (
                  <View
                    style={[
                      styles.autoSaveBadge,
                      { backgroundColor: theme.colors.success },
                    ]}
                  >
                    <MaterialIcons name="autorenew" size={14} color="#ffffff" />
                    <Text style={styles.autoSaveText}>
                      Auto-save: {goal.frequency}
                    </Text>
                  </View>
                )}
              </GlassCard>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.backgroundAlt },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Create Savings Goal
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Input
                label="Goal Name"
                placeholder="e.g., Bali Trip, Emergency Fund"
                value={formData.name}
                onChangeText={(value) => setFormData({ ...formData, name: value })}
                icon="flag"
              />

              <Input
                label="Target Amount"
                placeholder="5000"
                value={formData.targetAmount}
                onChangeText={(value) =>
                  setFormData({ ...formData, targetAmount: value })
                }
                keyboardType="decimal-pad"
                icon="attach-money"
              />

              <Input
                label="Current Amount (Optional)"
                placeholder="0"
                value={formData.currentAmount}
                onChangeText={(value) =>
                  setFormData({ ...formData, currentAmount: value })
                }
                keyboardType="decimal-pad"
              />

              <Input
                label="Deadline (Optional)"
                placeholder="YYYY-MM-DD"
                value={formData.deadline}
                onChangeText={(value) =>
                  setFormData({ ...formData, deadline: value })
                }
                icon="calendar-today"
              />

              <View style={styles.frequencySection}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Savings Frequency
                </Text>
                <View style={styles.frequencyButtons}>
                  {['weekly', 'monthly', 'yearly'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={() => setFormData({ ...formData, frequency: freq })}
                      style={[
                        styles.frequencyButton,
                        formData.frequency === freq && {
                          backgroundColor: theme.colors.primary,
                        },
                        { borderColor: theme.colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          {
                            color:
                              formData.frequency === freq
                                ? '#ffffff'
                                : theme.colors.text,
                          },
                        ]}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Button
                title="Create Goal"
                variant="primary"
                size="large"
                onPress={handleAddGoal}
                loading={loading}
                style={styles.createButton}
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
  goalCard: {
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  goalDeadline: {
    fontSize: 13,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
  },
  targetText: {
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
  },
  autoSaveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 12,
    gap: 4,
  },
  autoSaveText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  frequencySection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});
