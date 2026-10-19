import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const TAX_CHECKLIST_ITEMS = [
  { id: 'income-forms', label: 'Gather income forms from all platforms' },
  { id: 'categorize-expenses', label: 'Review and categorize business expenses' },
  { id: 'mileage', label: 'Calculate business mileage' },
  { id: 'receipts', label: 'Organize receipts and supporting records' },
  { id: 'review-deductions', label: 'Review potentially deductible expenses' },
  { id: 'tax-professional', label: 'Consult a qualified tax professional' },
]

const fallbackStorage = new Map()
const memoryStorage = {
  getItem: (key) => fallbackStorage.get(key) || null,
  setItem: (key, value) => fallbackStorage.set(key, value),
  removeItem: (key) => fallbackStorage.delete(key),
}

function getDefaultStorage() {
  return typeof localStorage === 'undefined' ? memoryStorage : localStorage
}

export function createTaxChecklistStore(storage) {
  const persistOptions = {
    name: 'tax-tools-checklist',
    storage: createJSONStorage(() => storage || getDefaultStorage()),
  }

  return create(
    persist(
      (set) => ({
        checkedItems: {},
        toggleTask: (id) =>
          set((state) => ({
            checkedItems: {
              ...state.checkedItems,
              [id]: !state.checkedItems[id],
            },
          })),
      }),
      persistOptions
    )
  )
}

export const useTaxChecklistStore = createTaxChecklistStore()
