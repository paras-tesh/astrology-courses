// ذخیرهٔ ویدئو در IndexedDB مرورگر (آزمایشی).
// بعداً این سه تابع را با آپلود به سرور / فضای ابری عوض کنید.
const DB = 'razhaye-videos'
const STORE = 'videos'

const open = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB, 1)
  req.onupgradeneeded = () => req.result.createObjectStore(STORE)
  req.onsuccess = () => resolve(req.result)
  req.onerror = () => reject(req.error)
})

export async function saveVideo(id, file) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(file, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getVideo(id) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteVideo(id) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// حذف همهٔ فایل‌هایی که کلیدشان با prefix شروع می‌شود
export async function deletePrefix(prefix) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).openCursor()
    req.onsuccess = () => {
      const cur = req.result
      if (!cur) return
      if (String(cur.key).startsWith(prefix)) cur.delete()
      cur.continue()
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// دانلود فایل ذخیره‌شده (برای PDF و فایل صوتی جلسات)
export async function downloadFile(key, name) {
  const blob = await getVideo(key)
  if (!blob) return false
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = blob.name || name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
