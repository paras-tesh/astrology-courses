import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

// ورود آزمایشی: فقط در مرورگر ذخیره می‌شود. بعداً با API واقعی عوض کنید.
export default function Auth() {
  const { setUser, say, after, setAfter } = useApp()
  const navigate = useNavigate()
  const [register, setRegister] = useState(false)
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(f.email) || f.password.length < 6) return say('ایمیل معتبر و رمز حداقل ۶ کاراکتر')
    setUser({ name: f.name || f.email.split('@')[0], email: f.email })
    say('خوش آمدید 🌟')
    const target = after || '/panel'
    setAfter(null)
    navigate(target)
  }

  return (
    <main className="w">
      <section style={{ maxWidth: 420, margin: 'auto' }}>
        <div className="card">
          <h2>{register ? 'ثبت‌نام' : 'ورود'}</h2>
          {register && <input placeholder="نام و نام خانوادگی" value={f.name} onChange={set('name')} />}
          <input type="email" placeholder="ایمیل" value={f.email} onChange={set('email')} />
          <input type="password" placeholder="رمز عبور" value={f.password} onChange={set('password')} />
          <button className="btn" style={{ width: '100%' }} onClick={submit}>{register ? 'ایجاد حساب' : 'ورود'}</button>
          <p className="center"><a className="lnk" onClick={() => setRegister(!register)}>{register ? 'حساب دارید؟ وارد شوید' : 'حساب ندارید؟ ثبت‌نام کنید'}</a></p>
        </div>
      </section>
    </main>
  )
}
