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
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useFinanceStore } from '../store/financeStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

export const ReceiptScannerScreen = ({ navigation }) => {
  const { theme } = useThemeStore();
  const { receipts, addReceipt, deleteReceipt, addExpense } = useFinanceStore();

  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScanReceipt = () => {
    setScanModalVisible(true);

    setTimeout(() => {
      const mockScannedData = {
        storeName: 'Gas Station',
        totalAmount: '45.50',
        date: new Date().toISOString().split('T')[0],
        items: [
          { name: 'Regular Gasoline', price: 45.50 },
        ],
        imageUri: 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Receipt',
      };

      setScannedData(mockScannedData);
      setScanModalVisible(false);
      setReviewModalVisible(true);
    }, 2000);
  };

  const handleSaveAsExpense = () => {
    if (!scannedData) return;

    const expenseData = {
      amount: parseFloat(scannedData.totalAmount),
      category: 'Gas',
      description: `${scannedData.storeName} - Receipt scan`,
      date: scannedData.date,
      paymentMethod: 'Credit Card',
    };

    addExpense(expenseData);

    const receiptData = {
      storeName: scannedData.storeName,
      amount: parseFloat(scannedData.totalAmount),
      date: scannedData.date,
      items: scannedData.items,
      imageUri: scannedData.imageUri,
    };

    addReceipt(receiptData);

    setReviewModalVisible(false);
    setScannedData(null);

    Alert.alert(
      'Success',
      'Receipt saved and expense added!',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteReceipt = (id) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReceipt(id),
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Receipt Scanner</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* How to Use Card */}
        <GlassCard intensity="medium" style={styles.howToCard}>
          <MaterialIcons name="info-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.howToTitle, { color: theme.colors.text }]}>How to Use</Text>
          <Text style={[styles.howToText, { color: theme.colors.textSecondary }]}>
            1. Tap the scan button below{'\n'}
            2. Take a photo of your receipt{'\n'}
            3. AI extracts the information automatically{'\n'}
            4. Review and save as expense
          </Text>
        </GlassCard>

        {/* Scan Button */}
        <TouchableOpacity onPress={handleScanReceipt}>
          <GlassCard gradient intensity="strong" style={styles.scanButton}>
            <MaterialIcons name="camera-alt" size={48} color="#ffffff" />
            <Text style={styles.scanButtonText}>Scan Receipt</Text>
            <Text style={styles.scanButtonSubtext}>
              Tap to take a photo or upload an image
            </Text>
          </GlassCard>
        </TouchableOpacity>

        {/* Recent Receipts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Receipts ({receipts.length})
          </Text>

          {receipts.length === 0 ? (
            <GlassCard intensity="light" style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={64} color={theme.colors.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No receipts yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                Scan your first receipt to get started
              </Text>
            </GlassCard>
          ) : (
            receipts.map((receipt) => (
              <GlassCard key={receipt.id} intensity="light" style={styles.receiptCard}>
                <View style={styles.receiptHeader}>
                  {receipt.imageUri && (
                    <Image
                      source={{ uri: receipt.imageUri }}
                      style={styles.receiptThumbnail}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.receiptInfo}>
                    <Text style={[styles.receiptStore, { color: theme.colors.text }]}>
                      {receipt.storeName}
                    </Text>
                    <Text style={[styles.receiptDate, { color: theme.colors.textSecondary }]}>
                      {formatDate(receipt.date)}
                    </Text>
                    <Text style={[styles.receiptAmount, { color: theme.colors.primary }]}>
                      {formatCurrency(receipt.amount)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteReceipt(receipt.id)}
                    style={[styles.deleteButton, { backgroundColor: theme.colors.expense + '20' }]}
                  >
                    <MaterialIcons name="delete" size={20} color={theme.colors.expense} />
                  </TouchableOpacity>
                </View>

                {receipt.items && receipt.items.length > 0 && (
                  <View style={styles.itemsList}>
                    <Text style={[styles.itemsTitle, { color: theme.colors.textSecondary }]}>
                      Items:
                    </Text>
                    {receipt.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={[styles.itemName, { color: theme.colors.text }]}>
                          • {item.name}
                        </Text>
                        <Text style={[styles.itemPrice, { color: theme.colors.textSecondary }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </GlassCard>
            ))
          )}
        </View>

        {/* Tips Card */}
        <GlassCard intensity="light" style={styles.tipsCard}>
          <MaterialIcons name="lightbulb-outline" size={24} color={theme.colors.warning} />
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>Tips for Best Results</Text>
          <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
            • Ensure good lighting{'\n'}
            • Keep receipt flat and in frame{'\n'}
            • Avoid shadows and glare{'\n'}
            • Make sure text is clearly visible
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Scanning Modal */}
      <Modal
        visible={scanModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.scanningOverlay}>
          <GlassCard intensity="strong" style={styles.scanningCard}>
            <MaterialIcons name="camera" size={64} color="#ffffff" />
            <Text style={styles.scanningText}>Scanning Receipt...</Text>
            <Text style={styles.scanningSubtext}>Please wait</Text>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dotAnimated]} />
              <View style={[styles.dot, styles.dotAnimated]} />
              <View style={[styles.dot, styles.dotAnimated]} />
            </View>
          </GlassCard>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundAlt }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Review Scanned Receipt
              </Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {scannedData && (
                <>
                  {/* Receipt Image */}
                  {scannedData.imageUri && (
                    <Image
                      source={{ uri: scannedData.imageUri }}
                      style={styles.receiptImage}
                      resizeMode="contain"
                    />
                  )}

                  {/* Extracted Data */}
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Store Name</Text>
                    <TextInput
                      style={[styles.input, {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                      }]}
                      value={scannedData.storeName}
                      onChangeText={(text) =>
                        setScannedData({ ...scannedData, storeName: text })
                      }
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Total Amount</Text>
                    <TextInput
                      style={[styles.input, {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                      }]}
                      value={scannedData.totalAmount}
                      keyboardType="decimal-pad"
                      onChangeText={(text) =>
                        setScannedData({ ...scannedData, totalAmount: text })
                      }
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Date</Text>
                    <TextInput
                      style={[styles.input, {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                      }]}
                      value={scannedData.date}
                      onChangeText={(text) =>
                        setScannedData({ ...scannedData, date: text })
                      }
                    />
                  </View>

                  {/* Items */}
                  {scannedData.items && scannedData.items.length > 0 && (
                    <View style={styles.formGroup}>
                      <Text style={[styles.label, { color: theme.colors.text }]}>Items</Text>
                      {scannedData.items.map((item, index) => (
                        <View key={index} style={styles.extractedItem}>
                          <Text style={[styles.extractedItemName, { color: theme.colors.text }]}>
                            {item.name}
                          </Text>
                          <Text style={[styles.extractedItemPrice, { color: theme.colors.textSecondary }]}>
                            ${item.price.toFixed(2)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.buttonRow}>
                    <Button
                      title="Cancel"
                      variant="outline"
                      onPress={() => setReviewModalVisible(false)}
                      style={styles.halfButton}
                    />
                    <Button
                      title="Save as Expense"
                      onPress={handleSaveAsExpense}
                      style={styles.halfButton}
                    />
                  </View>
                </>
              )}
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
  howToCard: {
    padding: 20,
    marginBottom: 20,
  },
  howToTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12,
  },
  howToText: {
    fontSize: 14,
    lineHeight: 24,
  },
  scanButton: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
  },
  scanButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
  },
  scanButtonSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
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
  },
  receiptCard: {
    padding: 16,
    marginBottom: 12,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptThumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptStore: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  receiptAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 13,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
  },
  tipsCard: {
    padding: 20,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 22,
  },
  scanningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningCard: {
    padding: 40,
    alignItems: 'center',
    minWidth: 250,
  },
  scanningText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
  },
  scanningSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 8,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  dotAnimated: {
    opacity: 0.5,
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
  receiptImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
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
  extractedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  extractedItemName: {
    fontSize: 14,
    flex: 1,
  },
  extractedItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  halfButton: {
    flex: 1,
  },
});
