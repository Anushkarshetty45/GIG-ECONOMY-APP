import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { financeRepository } from './financeRepository';
import { normalizeInsuranceType } from '../utils/financialCalculations';

let activeFinanceUserId = null;
let cachedFinanceUserId = null;
let financeSyncRequest = 0;
const inMemoryFinanceSnapshots = new Map();

function normalizePolicy(policy) {
  return {
    ...policy,
    type: normalizeInsuranceType(policy.type),
    monthlyCost: Number(policy.monthlyCost) || 0,
  };
}

function reportSyncFailure(set, operation, error) {
  console.error(`Finance data ${operation} failed:`, error);
  set({ financeSyncError: error?.message || String(error) });
}

function queueRemoteWrite(set, operation, callback) {
  if (!activeFinanceUserId || !financeRepository.isConfigured()) return;
  const userId = activeFinanceUserId;
  Promise.resolve()
    .then(() => callback(userId))
    .catch((error) => reportSyncFailure(set, operation, error));
}

function mergeConcurrentChanges(remoteRecords, startingRecords, currentRecords) {
  const startingById = new Map(startingRecords.map((record) => [String(record.id), record]));
  const currentById = new Map(currentRecords.map((record) => [String(record.id), record]));
  const remoteById = new Map(remoteRecords.map((record) => [String(record.id), record]));

  startingById.forEach((_, id) => {
    if (!currentById.has(id)) remoteById.delete(id);
  });
  currentById.forEach((record, id) => {
    const startingRecord = startingById.get(id);
    if (!startingRecord || JSON.stringify(startingRecord) !== JSON.stringify(record)) {
      remoteById.set(id, record);
    }
  });

  return [...remoteById.values()];
}

export const useFinanceStore = create(
  persist(
    (set, get) => ({
    financeSyncStatus: 'local',
    financeSyncError: null,

    // Income State
      incomes: [],

      // Expense State
      expenses: [],

      // Goals State
      goals: [],

      // Receipts State
      receipts: [],

      // Income Actions
      addIncome: (income) => {
        const now = new Date().toISOString();
        const newIncome = {
          id: Date.now().toString(),
          ...income,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          incomes: [newIncome, ...state.incomes],
        }));
        queueRemoteWrite(set, 'income save', (userId) =>
          financeRepository.saveTransaction(newIncome, 'income', userId)
        );
        return newIncome;
      },

      updateIncome: (id, updates) => {
        const updatedIncome = get().incomes.find((income) => income.id === id);
        if (!updatedIncome) return;
        const nextIncome = {
          ...updatedIncome,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? nextIncome : income
          ),
        }));
        queueRemoteWrite(set, 'income update', (userId) =>
          financeRepository.saveTransaction(nextIncome, 'income', userId)
        );
      },

      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        }));
        queueRemoteWrite(set, 'income delete', (userId) =>
          financeRepository.deleteTransaction(id, userId)
        );
      },

      // Expense Actions
      addExpense: (expense) => {
        const now = new Date().toISOString();
        const newExpense = {
          id: Date.now().toString(),
          ...expense,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        queueRemoteWrite(set, 'expense save', (userId) =>
          financeRepository.saveTransaction(newExpense, 'expense', userId)
        );
        return newExpense;
      },

      updateExpense: (id, updates) => {
        const updatedExpense = get().expenses.find((expense) => expense.id === id);
        if (!updatedExpense) return;
        const nextExpense = {
          ...updatedExpense,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? nextExpense : expense
          ),
        }));
        queueRemoteWrite(set, 'expense update', (userId) =>
          financeRepository.saveTransaction(nextExpense, 'expense', userId)
        );
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
        queueRemoteWrite(set, 'expense delete', (userId) =>
          financeRepository.deleteTransaction(id, userId)
        );
      },

      // Goal Actions
      addGoal: (goal) => {
        const newGoal = {
          id: Date.now().toString(),
          ...goal,
          currentAmount: 0,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        set((state) => ({
          goals: [newGoal, ...state.goals],
        }));
        return newGoal;
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));
      },

      addToGoal: (id, amount) => {
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const newAmount = goal.currentAmount + amount;
              return {
                ...goal,
                currentAmount: newAmount,
                completed: newAmount >= goal.targetAmount,
              };
            }
            return goal;
          }),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      // Receipt Actions
      addReceipt: (receipt) => {
        const newReceipt = {
          id: Date.now().toString(),
          ...receipt,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          receipts: [newReceipt, ...state.receipts],
        }));
        return newReceipt;
      },

      updateReceipt: (id, updates) => {
        set((state) => ({
          receipts: state.receipts.map((receipt) =>
            receipt.id === id ? { ...receipt, ...updates } : receipt
          ),
        }));
      },

      deleteReceipt: (id) => {
        // Find the receipt to get the linked expense ID
        const receipt = get().receipts.find((r) => r.id === id);

        // Delete the receipt
        set((state) => ({
          receipts: state.receipts.filter((receipt) => receipt.id !== id),
        }));

        // If receipt has a linked expense, delete it too
        if (receipt && receipt.expenseId) {
          console.log('Deleting linked expense:', receipt.expenseId);
          get().deleteExpense(receipt.expenseId);
        }
      },

      // Computed values
      getTotalIncome: (startDate, endDate) => {
        const { incomes } = get();
        return incomes
          .filter((income) => {
            const date = new Date(income.date);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
          })
          .reduce((sum, income) => sum + income.amount, 0);
      },

      getTotalExpenses: (startDate, endDate) => {
        const { expenses } = get();
        return expenses
          .filter((expense) => {
            const date = new Date(expense.date);
            return (!startDate || date >= startDate) && (!endDate || date <= endDate);
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
      },

      getNetIncome: (startDate, endDate) => {
        return get().getTotalIncome(startDate, endDate) - get().getTotalExpenses(startDate, endDate);
      },

      getExpensesByCategory: () => {
        const { expenses } = get();
        const categoryMap = {};

        expenses.forEach((expense) => {
          const category = expense.category || 'Other';
          if (!categoryMap[category]) {
            categoryMap[category] = 0;
          }
          categoryMap[category] += expense.amount;
        });

        return Object.entries(categoryMap).map(([category, amount]) => ({
          category,
          amount,
        }));
      },

      getIncomeByPlatform: () => {
        const { incomes } = get();
        const platformMap = {};

        incomes.forEach((income) => {
          const platform = income.platform || 'Other';
          if (!platformMap[platform]) {
            platformMap[platform] = 0;
          }
          platformMap[platform] += income.amount;
        });

        return Object.entries(platformMap).map(([platform, amount]) => ({
          platform,
          amount,
        }));
      },
      // Insurance Actions
      insurance: [],

      addInsurance: (policy) => {
        const now = new Date().toISOString();
        const newPolicy = normalizePolicy({
          id: Date.now().toString(),
          ...policy,
          createdAt: now,
          updatedAt: now,
        });
        set((state) => ({
          insurance: [newPolicy, ...state.insurance],
        }));
        queueRemoteWrite(set, 'insurance policy save', (userId) =>
          financeRepository.saveInsurance(newPolicy, userId)
        );
        return newPolicy;
      },

      updateInsurance: (id, updates) => {
        const currentPolicy = get().insurance.find((policy) => policy.id === id);
        if (!currentPolicy) return;
        const nextPolicy = normalizePolicy({
          ...currentPolicy,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        set((state) => ({
          insurance: state.insurance.map((policy) =>
            policy.id === id ? nextPolicy : policy
          ),
        }));
        queueRemoteWrite(set, 'insurance policy update', (userId) =>
          financeRepository.saveInsurance(nextPolicy, userId)
        );
      },

      deleteInsurance: (id) => {
        set((state) => ({
          insurance: state.insurance.filter((policy) => policy.id !== id),
        }));
        queueRemoteWrite(set, 'insurance policy delete', (userId) =>
          financeRepository.deleteInsurance(id, userId)
        );
      },

      getTotalInsuranceCost: () => {
        const { insurance } = get();
        return insurance.reduce(
          (sum, policy) =>
            (policy.status || 'active') === 'active'
              ? sum + (Number(policy.monthlyCost) || 0)
              : sum,
          0
        );
      },

      syncWithSupabase: async (userId) => {
        const requestId = ++financeSyncRequest;
        if (!userId || !financeRepository.isConfigured()) {
          activeFinanceUserId = null;
          set({ financeSyncStatus: 'local', financeSyncError: null });
          return;
        }

        activeFinanceUserId = null;
        set({ financeSyncStatus: 'syncing', financeSyncError: null });
        try {
          let localRecords = get();
          if (typeof localStorage !== 'undefined') {
            const ownerKey = 'finance-storage-owner';
            const existingOwner = localStorage.getItem(ownerKey);
            if (existingOwner && existingOwner !== userId) {
              localStorage.setItem(
                `finance-storage-user:${existingOwner}`,
                JSON.stringify({
                  incomes: localRecords.incomes,
                  expenses: localRecords.expenses,
                  insurance: localRecords.insurance,
                })
              );
              const accountSnapshot = localStorage.getItem(`finance-storage-user:${userId}`);
              localRecords = accountSnapshot
                ? JSON.parse(accountSnapshot)
                : { incomes: [], expenses: [], insurance: [] };
            }
            localStorage.setItem(ownerKey, userId);
          } else if (cachedFinanceUserId && cachedFinanceUserId !== userId) {
            inMemoryFinanceSnapshots.set(cachedFinanceUserId, {
              incomes: localRecords.incomes,
              expenses: localRecords.expenses,
              insurance: localRecords.insurance,
            });
            localRecords = inMemoryFinanceSnapshots.get(userId) || {
              incomes: [],
              expenses: [],
              insurance: [],
            };
          }

          set({
            incomes: localRecords.incomes || [],
            expenses: localRecords.expenses || [],
            insurance: (localRecords.insurance || []).map(normalizePolicy),
            financeSyncStatus: 'syncing',
          });
          const startingRecords = {
            incomes: get().incomes,
            expenses: get().expenses,
            insurance: get().insurance,
          };
          activeFinanceUserId = userId;
          cachedFinanceUserId = userId;

          const synchronizedRecords = await financeRepository.migrateLocalRecords(
            userId,
            startingRecords
          );

          if (requestId !== financeSyncRequest) return;
          const currentRecords = get();
          set({
            incomes: mergeConcurrentChanges(
              synchronizedRecords.incomes,
              startingRecords.incomes,
              currentRecords.incomes
            ),
            expenses: mergeConcurrentChanges(
              synchronizedRecords.expenses,
              startingRecords.expenses,
              currentRecords.expenses
            ),
            insurance: mergeConcurrentChanges(
              synchronizedRecords.insurance.map(normalizePolicy),
              startingRecords.insurance,
              currentRecords.insurance
            ),
            financeSyncStatus: 'synced',
            financeSyncError: null,
          });
        } catch (error) {
          if (requestId === financeSyncRequest) {
            reportSyncFailure(set, 'synchronization', error);
            set({ financeSyncStatus: 'error' });
          }
          throw error;
        }
      },
    }),
    {
      name: 'finance-storage',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        insurance: (persistedState?.insurance || []).map(normalizePolicy),
      }),
    }
  )
);
