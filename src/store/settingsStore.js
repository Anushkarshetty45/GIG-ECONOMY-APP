import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Currency configurations with symbols and formatting
export const currencies = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', position: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', position: 'before' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', position: 'before' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', position: 'after' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', position: 'before' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', position: 'before' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', position: 'before' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', position: 'after' },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', position: 'before' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', position: 'before' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', position: 'before' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', position: 'after' }
}

export const dateFormats = {
  'MM/DD/YYYY': { code: 'MM/DD/YYYY', name: 'US Format (MM/DD/YYYY)' },
  'DD/MM/YYYY': { code: 'DD/MM/YYYY', name: 'European Format (DD/MM/YYYY)' },
  'YYYY-MM-DD': { code: 'YYYY-MM-DD', name: 'ISO Format (YYYY-MM-DD)' },
  'DD-MMM-YYYY': { code: 'DD-MMM-YYYY', name: 'Written Format (DD-MMM-YYYY)' }
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Display preferences
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',

      // Privacy settings
      shareAnalytics: true,
      dataSharing: false,

      // Notification settings
      emailNotifications: true,
      weeklyReports: true,
      goalReminders: true,
      expenseAlerts: true,

      // Actions
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setShareAnalytics: (shareAnalytics) => set({ shareAnalytics }),
      setDataSharing: (dataSharing) => set({ dataSharing }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setWeeklyReports: (weeklyReports) => set({ weeklyReports }),
      setGoalReminders: (goalReminders) => set({ goalReminders }),
      setExpenseAlerts: (expenseAlerts) => set({ expenseAlerts }),

      // Helper to format currency
      formatCurrency: (amount) => {
        const curr = currencies[get().currency]
        const formatted = Math.abs(amount).toFixed(2)
        const withCommas = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        if (curr.position === 'before') {
          return amount < 0 ? `-${curr.symbol}${withCommas}` : `${curr.symbol}${withCommas}`
        } else {
          return amount < 0 ? `-${withCommas}${curr.symbol}` : `${withCommas}${curr.symbol}`
        }
      },

      // Helper to get currency symbol
      getCurrencySymbol: () => {
        return currencies[get().currency].symbol
      },

      // Helper to format date
      formatDate: (date) => {
        const d = new Date(date)
        const format = get().dateFormat
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        switch (format) {
          case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`
          case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`
          case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`
          case 'DD-MMM-YYYY':
            return `${day}-${monthNames[d.getMonth()]}-${year}`
          default:
            return `${month}/${day}/${year}`
        }
      }
    }),
    {
      name: 'settings-storage'
    }
  )
)
