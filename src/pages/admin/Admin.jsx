import { useState } from 'react'
import CoursesTab from './CoursesTab.jsx'
import ReviewsTab from './ReviewsTab.jsx'
import SettingsTab from './SettingsTab.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { checkAdminPassword } from '../../lib/auth.js'
import { fa } from '../../lib/format.js'

function AdminLogin() {
  const { setIsAdmin, notify } = useApp()
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (await checkAdminPassword(password)) setIsAdmin(true)
    else notify('رمز اشتباه است')
  }

  return (
    <main className="wrap">
      <section className="narrow">
        <form className="card" onSubmit={submit}>
          <h2>ورود مدیر</h2>
          <input type="password" placeholder="رمز مدیر" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn block" type="submit">ورود</button>
        </form>
      </section>
    </main>
  )
}

export default function Admin() {
  const { isAdmin, setIsAdmin, reviews } = useApp()
  const [tab, setTab] = useState('courses')

  if (!isAdmin) return <AdminLogin />

  const pending = reviews.filter((r) => r.status === 'pending').length

  return (
    <main className="wrap">
      <section>
        <div className="row">
          <h2>پنل مدیریت</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setIsAdmin(false)}>خروج</button>
        </div>

        <div className="filters">
          <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}>دوره‌ها</button>
          <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
            تجربه‌های هنرجویان{pending > 0 && ` (${fa(pending)})`}
          </button>
          <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>تنظیمات</button>
        </div>

        {tab === 'courses' && <CoursesTab />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'settings' && <SettingsTab />}
      </section>
    </main>
  )
}
