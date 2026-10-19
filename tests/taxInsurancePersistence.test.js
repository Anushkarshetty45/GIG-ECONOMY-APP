import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

async function createChecklistStore(repository) {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  try {
    const { createTaxChecklistStore } = await server.ssrLoadModule('/src/store/taxChecklistStore.js')
    return createTaxChecklistStore(repository)
  } finally {
    await server.close()
  }
}

function createRemoteChecklistRepository() {
  const records = new Map()
  let failure = null
  return {
    records,
    failNextSave(error = new Error('test database unavailable')) {
      failure = error
    },
    async load(userId) {
      return structuredClone(records.get(userId) || {})
    },
    async save(userId, checkedItems) {
      if (failure) {
        const error = failure
        failure = null
        throw error
      }
      records.set(userId, structuredClone(checkedItems))
    },
  }
}

test('tax checklist saves, reloads in a new store, and remains isolated per user', async () => {
  const repository = createRemoteChecklistRepository()
  const accountA = await createChecklistStore(repository)
  await accountA.getState().syncWithSupabase('user-a')
  await accountA.getState().toggleTask('receipts')

  assert.deepEqual(repository.records.get('user-a'), { receipts: true })

  const reloadedAccountA = await createChecklistStore(repository)
  await reloadedAccountA.getState().syncWithSupabase('user-a')
  assert.equal(reloadedAccountA.getState().checkedItems.receipts, true)

  await reloadedAccountA.getState().syncWithSupabase('user-b')
  assert.deepEqual(reloadedAccountA.getState().checkedItems, {})
  await reloadedAccountA.getState().toggleTask('mileage')
  assert.deepEqual(repository.records.get('user-b'), { mileage: true })

  await reloadedAccountA.getState().syncWithSupabase('user-a')
  assert.deepEqual(reloadedAccountA.getState().checkedItems, { receipts: true })
})

test('failed checklist save reports the error and does not commit an unsaved toggle', async () => {
  const repository = createRemoteChecklistRepository()
  const store = await createChecklistStore(repository)
  await store.getState().syncWithSupabase('user-a')
  repository.failNextSave()

  await assert.rejects(store.getState().toggleTask('receipts'), /test database unavailable/)
  assert.deepEqual(store.getState().checkedItems, {})
  assert.equal(store.getState().syncStatus, 'error')
  assert.match(store.getState().syncError, /test database unavailable/)
  assert.equal(repository.records.has('user-a'), false)
})

test('tax checklist repository writes account-scoped rows and propagates database failures', async () => {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  try {
    const { createTaxChecklistRepository } = await server.ssrLoadModule('/src/store/taxChecklistRepository.js')
    let authenticatedUserId = 'user-a'
    let failUpsert = false
    const records = new Map()
    const client = {
      auth: {
        getSession: async () => ({
          data: { session: { user: { id: authenticatedUserId } } },
          error: null,
        }),
      },
      from(table) {
        assert.equal(table, 'tax_checklist_progress')
        let filterUserId
        const query = {
          select() { return query },
          eq(column, value) {
            assert.equal(column, 'user_id')
            filterUserId = value
            return query
          },
          maybeSingle: async () => ({
            data: filterUserId === authenticatedUserId
              ? records.get(filterUserId) || null
              : null,
            error: null,
          }),
          upsert: async (row) => {
            if (failUpsert) {
              failUpsert = false
              return { error: new Error('checklist write failed') }
            }
            if (row.user_id !== authenticatedUserId) {
              return { error: new Error('RLS denied') }
            }
            records.set(row.user_id, row)
            return { error: null }
          },
        }
        return query
      },
    }
    const repository = createTaxChecklistRepository(client)

    await repository.save('user-a', { receipts: true })
    assert.deepEqual(await repository.load('user-a'), { receipts: true })
    authenticatedUserId = 'user-b'
    assert.deepEqual(await repository.load('user-b'), {})
    await assert.rejects(repository.load('user-a'), /do not belong/)
    failUpsert = true
    await assert.rejects(repository.save('user-b', { mileage: true }), /checklist write failed/)
    assert.deepEqual(await repository.load('user-b'), {})
  } finally {
    await server.close()
  }
})

test('tax checklist cannot load or mutate records before the authenticated user is synchronized', async () => {
  const repository = createRemoteChecklistRepository()
  const store = await createChecklistStore(repository)
  await assert.rejects(store.getState().toggleTask('receipts'), /not synchronized/)
  await store.getState().syncWithSupabase(null)
  assert.equal(store.getState().activeUserId, null)
  assert.deepEqual(store.getState().checkedItems, {})
})

test('finance repository rejects a different user id than the authenticated Supabase session', async () => {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  try {
    const { assertAuthenticatedOwner } = await server.ssrLoadModule('/src/store/financeRepository.js')
    const ownerAuth = {
      getSession: async () => ({ data: { session: { user: { id: 'owner-a' } } }, error: null }),
    }
    await assertAuthenticatedOwner('owner-a', ownerAuth)
    await assert.rejects(
      assertAuthenticatedOwner('owner-b', ownerAuth),
      /do not belong to the authenticated user/
    )
    await assert.rejects(
      assertAuthenticatedOwner('owner-a', {
        getSession: async () => ({ data: { session: null }, error: null }),
      }),
      /do not belong to the authenticated user/
    )
  } finally {
    await server.close()
  }
})

test('insurance repository saves, reloads, deletes, propagates errors, and rejects cross-user access', async () => {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  try {
    const { createFinanceRepository } = await server.ssrLoadModule('/src/store/financeRepository.js')
    let authenticatedUserId = 'user-a'
    let nextError = null
    const tables = new Map([['insurance_plans', []], ['transactions', []]])
    const client = {
      auth: {
        getSession: async () => ({
          data: { session: { user: { id: authenticatedUserId } } },
          error: null,
        }),
      },
      from(table) {
        let action = 'select'
        let body
        const filters = {}
        const query = {
          select() {
            action = 'select'
            return query
          },
          eq(column, value) {
            filters[column] = value
            return query
          },
          upsert(row) {
            action = 'upsert'
            body = row
            return query
          },
          delete() {
            action = 'delete'
            return query
          },
          then(resolve, reject) {
            if (nextError) {
              const error = nextError
              nextError = null
              return Promise.resolve({ data: null, error }).then(resolve, reject)
            }
            const rows = tables.get(table)
            if (action === 'upsert') {
              if (body.user_id !== authenticatedUserId) {
                return Promise.resolve({ data: null, error: new Error('RLS denied') }).then(resolve, reject)
              }
              const index = rows.findIndex((row) =>
                row.user_id === body.user_id && row.client_id === body.client_id
              )
              if (index < 0) rows.push(body)
              else rows[index] = body
              return Promise.resolve({ data: body, error: null }).then(resolve, reject)
            }
            if (action === 'delete') {
              for (let index = rows.length - 1; index >= 0; index -= 1) {
                if (rows[index].user_id === authenticatedUserId
                  && Object.entries(filters).every(([key, value]) => rows[index][key] === value)) {
                  rows.splice(index, 1)
                }
              }
              return Promise.resolve({ data: null, error: null }).then(resolve, reject)
            }
            return Promise.resolve({
              data: rows.filter((row) => row.user_id === authenticatedUserId
                && Object.entries(filters).every(([key, value]) => row[key] === value)),
              error: null,
            }).then(resolve, reject)
          },
        }
        return query
      },
    }
    const repository = createFinanceRepository(client)
    const policy = {
      id: 'policy-1',
      type: 'auto',
      provider: 'Insurer A',
      policyNumber: 'A-123',
      premiumAmount: 300,
      monthlyCost: 100,
      paymentFrequency: 'quarterly',
      coverageAmount: 'Liability',
      status: 'active',
      renewalDate: '2027-01-01',
    }

    await repository.saveInsurance(policy, 'user-a')
    const loaded = await repository.load('user-a')
    assert.equal(loaded.insurance.length, 1)
    assert.equal(loaded.insurance[0].provider, 'Insurer A')
    assert.equal(loaded.insurance[0].premiumAmount, 300)

    await repository.saveInsurance({ ...policy, provider: 'Insurer B' }, 'user-a')
    assert.equal((await repository.load('user-a')).insurance[0].provider, 'Insurer B')

    nextError = new Error('database write rejected')
    await assert.rejects(
      repository.saveInsurance({ ...policy, id: 'failed' }, 'user-a'),
      /database write rejected/
    )
    assert.equal((await repository.load('user-a')).insurance.length, 1)

    authenticatedUserId = 'user-b'
    await assert.rejects(repository.load('user-a'), /do not belong to the authenticated user/)
    await assert.rejects(repository.deleteInsurance('policy-1', 'user-a'), /do not belong/)
    assert.equal((await repository.load('user-b')).insurance.length, 0)

    authenticatedUserId = 'user-a'
    await repository.deleteInsurance('policy-1', 'user-a')
    assert.deepEqual((await repository.load('user-a')).insurance, [])
  } finally {
    await server.close()
  }
})

test('database migrations enforce per-user RLS for policies and checklist progress', async () => {
  const migration = await readFile('supabase/finance_persistence_migration.sql', 'utf8')
  for (const table of ['insurance_plans', 'tax_checklist_progress']) {
    assert.match(migration, new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`))
    for (const operation of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
      const policy = migration.match(new RegExp(
        `CREATE POLICY "[^"]+"\\s+ON public\\.${table} FOR ${operation}[\\s\\S]*?;`,
        'g'
      )) || []
      assert.ok(policy.length > 0, `${table} must define a ${operation} policy`)
      assert.ok(policy.some((sql) => /auth\.uid\(\)\s*=\s*user_id/.test(sql)))
      if (operation === 'INSERT' || operation === 'UPDATE') {
        assert.ok(policy.some((sql) => /WITH CHECK\s*\(auth\.uid\(\)\s*=\s*user_id\)/.test(sql)))
      }
    }
  }
})
