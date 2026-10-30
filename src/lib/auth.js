import { defaultAdminHash } from '../config.js'
import { readJson, writeJson } from './storage.js'

async function hash(password) {
  const bytes = new TextEncoder().encode(`razhaye-admin:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function checkAdminPassword(password) {
  return (await hash(password)) === readJson('adminHash', defaultAdminHash)
}

export async function changeAdminPassword(password) {
  writeJson('adminHash', await hash(password))
}
