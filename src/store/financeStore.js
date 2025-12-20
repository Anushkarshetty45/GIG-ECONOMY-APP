import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
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
        const newIncome = {
          id: Date.now().toString(),
          ...income,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          incomes: [newIncome, ...state.incomes],
        }));
        return newIncome;
      },

      updateIncome: (id, updates) => {
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updates } : income
          ),
        }));
      },

      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        }));
      },

      // Expense Actions
      addExpense: (expense) => {
        const newExpense = {
          id: Date.now().toString(),
          ...expense,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        return newExpense;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates } : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
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
        set((state) => ({
          receipts: state.receipts.filter((receipt) => receipt.id !== id),
        }));
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
        const newPolicy = {
          id: Date.now().toString(),
          ...policy,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          insurance: [newPolicy, ...state.insurance],
        }));
        return newPolicy;
      },

      updateInsurance: (id, updates) => {
        set((state) => ({
          insurance: state.insurance.map((policy) =>
            policy.id === id ? { ...policy, ...updates } : policy
          ),
        }));
      },

      deleteInsurance: (id) => {
        set((state) => ({
          insurance: state.insurance.filter((policy) => policy.id !== id),
        }));
      },

      getTotalInsuranceCost: () => {
        const { insurance } = get();
        return insurance.reduce((sum, policy) => sum + (policy.monthlyCost || 0), 0);
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);
