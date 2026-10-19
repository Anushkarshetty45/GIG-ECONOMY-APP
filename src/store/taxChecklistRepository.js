import { supabase } from '../config/supabase'
import { assertAuthenticatedOwner } from './financeRepository'

export function createTaxChecklistRepository(client = supabase) {
  return {
    async load(userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { data, error } = await client
        .from('tax_checklist_progress')
        .select('checked_items')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data?.checked_items || {}
    },

    async save(userId, checkedItems) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { error } = await client
        .from('tax_checklist_progress')
        .upsert({
          user_id: userId,
          checked_items: checkedItems,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) throw error
    },
  }
}

export const taxChecklistRepository = createTaxChecklistRepository()
