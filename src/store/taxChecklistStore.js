import { create } from 'zustand'
import { taxChecklistRepository } from './taxChecklistRepository.js'

export const TAX_CHECKLIST_ITEMS = [
  { id: 'income-forms', label: 'Gather income forms from all platforms' },
  { id: 'categorize-expenses', label: 'Review and categorize business expenses' },
  { id: 'mileage', label: 'Calculate business mileage' },
  { id: 'receipts', label: 'Organize receipts and supporting records' },
  { id: 'review-deductions', label: 'Review potentially deductible expenses' },
  { id: 'tax-professional', label: 'Consult a qualified tax professional' },
]

export function createTaxChecklistStore(repository = taxChecklistRepository) {
  let syncRequest = 0
  return create((set, get) => ({
    checkedItems: {},
    activeUserId: null,
    syncStatus: 'local',
    syncError: null,

    syncWithSupabase: async (userId) => {
      const request = ++syncRequest
      if (!userId) {
        set({
          checkedItems: {},
          activeUserId: null,
          syncStatus: 'local',
          syncError: null,
        })
        return
      }

      set({
        checkedItems: {},
        activeUserId: userId,
        syncStatus: 'syncing',
        syncError: null,
      })
      try {
        const checkedItems = await repository.load(userId)
        if (request !== syncRequest) return
        set({ checkedItems, activeUserId: userId, syncStatus: 'synced', syncError: null })
      } catch (error) {
        if (request === syncRequest) {
          set({
            checkedItems: {},
            activeUserId: userId,
            syncStatus: 'error',
            syncError: error?.message || String(error),
          })
        }
        throw error
      }
    },

    toggleTask: async (id) => {
      const current = get()
      if (!TAX_CHECKLIST_ITEMS.some((item) => item.id === id)) {
        throw new Error(`Unknown tax checklist task: ${id}`)
      }
      if (!current.activeUserId || current.syncStatus !== 'synced') {
        throw new Error('Tax checklist is not synchronized for the signed-in user.')
      }

      const userId = current.activeUserId
      const checkedItems = {
        ...current.checkedItems,
        [id]: !current.checkedItems[id],
      }
      set({ syncStatus: 'saving', syncError: null })
      try {
        await repository.save(userId, checkedItems)
        if (get().activeUserId !== userId) return
        set({ checkedItems, syncStatus: 'synced', syncError: null })
      } catch (error) {
        if (get().activeUserId === userId) {
          set({
            syncStatus: 'error',
            syncError: error?.message || String(error),
          })
        }
        throw error
      }
    },
  }))
}

export const useTaxChecklistStore = createTaxChecklistStore()
