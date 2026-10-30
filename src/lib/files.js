const DB_NAME = 'razhaye-files'
const STORE = 'files'

let dbPromise

function openDb() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function run(mode, action) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = action(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(request?.result)
    tx.onerror = () => reject(tx.error)
  })
}

export const keys = {
  banner: (courseId) => `c${courseId}/banner`,
  teaser: (courseId) => `c${courseId}/teaser`,
  session: (courseId, sessionId, type) => `c${courseId}/s${sessionId}/${type}`,
  sessionPrefix: (courseId, sessionId) => `c${courseId}/s${sessionId}/`,
  coursePrefix: (courseId) => `c${courseId}/`,
}

export const saveFile = (key, file) => run('readwrite', (store) => store.put(file, key))

export async function getFile(key) {
  return (await run('readonly', (store) => store.get(key))) ?? null
}

export const removeFiles = (prefix) =>
  run('readwrite', (store) => {
    const request = store.openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) return
      if (String(cursor.key).startsWith(prefix)) cursor.delete()
      cursor.continue()
    }
    return request
  })

export async function downloadFile(key, fallbackName) {
  const file = await getFile(key)
  if (!file) return false
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name || fallbackName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
