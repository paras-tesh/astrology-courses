export const fa = (n) => Number(n).toLocaleString('fa-IR')

export const loadList = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}
export const pushItem = (key, item) => {
  try { localStorage.setItem(key, JSON.stringify([...loadList(key), item])) } catch {}
}
