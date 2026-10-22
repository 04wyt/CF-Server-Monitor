import test from 'node:test'
import assert from 'node:assert/strict'

globalThis.localStorage = {
  store: new Map(),
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null
  },
  setItem(key, value) {
    this.store.set(key, String(value))
  }
}
globalThis.window = { dispatchEvent() {} }
globalThis.CustomEvent = class {
  constructor(type, init) {
    this.type = type
    this.detail = init?.detail
  }
}

const i18n = await import('../src/frontend/utils/i18n.js')

test('setLanguage loads a locale on demand and updates translations', async () => {
  assert.equal(await i18n.setLanguage('ja'), true)
  assert.equal(i18n.getLanguage(), 'ja')
  assert.equal(i18n.t('theme'), 'テーマ')

  assert.equal(await i18n.setLanguage('zh-TW'), true)
  assert.equal(i18n.getLanguage(), 'zh-TW')
  assert.equal(i18n.t('theme'), '主題')

  assert.equal(await i18n.setLanguage('fr'), true)
  assert.equal(i18n.t('theme'), 'Thème')
})

test('setLanguage rejects unknown languages without changing the current one', async () => {
  assert.equal(await i18n.setLanguage('ko'), false)
  assert.equal(i18n.getLanguage(), 'fr')
})
