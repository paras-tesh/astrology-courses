import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

// Placeholder sign-in: any valid email and a password of six characters or more.
export default function Login() {
  const { setUser, notify, redirectTo, setRedirectTo } = useApp()
  const navigate = useNavigate()
  const [registering, setRegistering] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 6) {
      return notify('ایمیل معتبر و رمز حداقل ۶ کاراکتر وارد کنید')
    }
    setUser({ name: form.name.trim() || form.email.split('@')[0], email: form.email })
    setRedirectTo(null)
    navigate(redirectTo || '/panel')
  }

  return (
    <main className="wrap">
      <section className="narrow">
        <form className="card" onSubmit={submit}>
          <h2>{registering ? 'ثبت‌نام' : 'ورود'}</h2>
          {registering && (
            <input placeholder="نام و نام خانوادگی" value={form.name} onChange={update('name')} />
          )}
          <input type="email" placeholder="ایمیل" value={form.email} onChange={update('email')} />
          <input type="password" placeholder="رمز عبور" value={form.password} onChange={update('password')} />
          <button className="btn block" type="submit">{registering ? 'ایجاد حساب' : 'ورود'}</button>
          <p className="center">
            <button type="button" className="link-btn" onClick={() => setRegistering(!registering)}>
              {registering ? 'حساب دارید؟ وارد شوید' : 'حساب ندارید؟ ثبت‌نام کنید'}
            </button>
          </p>
        </form>
      </section>
    </main>
  )
}
