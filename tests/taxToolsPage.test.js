import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Tax Tools page renders quarterly sections and informative empty states', async () => {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const storage = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  })

  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })

  try {
    const { default: TaxTools } = await server.ssrLoadModule('/src/pages/TaxTools.jsx')
    const emptyMarkup = renderToStaticMarkup(React.createElement(TaxTools))
    assert.match(emptyMarkup, /No expenses recorded for 2025/)
    assert.match(emptyMarkup, /No income or expenses recorded for 2025/)
    assert.match(emptyMarkup, /Q4 · Oct - Dec/)
    assert.match(emptyMarkup, /Simplified Tax Estimate/)
    assert.match(emptyMarkup, /aria-pressed="false"/)
  } finally {
    await server.close()
  }
})
