import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { changeAdminPassword, checkAdminPassword } from '../../lib/auth.js'

const empty = { current: '', next: '', repeat: '' }

export default function SettingsTab() {
  const { notify } = useApp()
  const [form, setForm] = useState(empty)
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!(await checkAdminPassword(form.current))) return notify('رمز فعلی درست نیست')
    if (form.next.length < 8) return notify('رمز جدید باید حداقل ۸ کاراکتر باشد')
    if (form.next !== form.repeat) return notify('تکرار رمز جدید یکسان نیست')
    await changeAdminPassword(form.next)
    setForm(empty)
    notify('رمز مدیر تغییر کرد')
  }

  return (
    <form className="card narrow" onSubmit={submit}>
      <h3>تغییر رمز مدیر</h3>
      <input type="password" placeholder="رمز فعلی" value={form.current} onChange={update('current')} />
      <input type="password" placeholder="رمز جدید" value={form.next} onChange={update('next')} />
      <input type="password" placeholder="تکرار رمز جدید" value={form.repeat} onChange={update('repeat')} />
      <button className="btn" type="submit">ذخیره</button>
    </form>
  )
}
