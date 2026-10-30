import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { appendToList } from '../lib/storage.js'

export default function Newsletter() {
  const { notify } = useApp()
  const [email, setEmail] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return notify('ایمیل معتبر وارد کنید')
    appendToList('subscribers', email)
    setEmail('')
    notify('ایمیل شما ثبت شد')
  }

  return (
    <form className="card center" onSubmit={submit}>
      <h2>دریافت خبرها و تخفیف‌ها</h2>
      <input
        className="narrow"
        type="email"
        placeholder="ایمیل شما"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <button className="btn" type="submit">عضویت</button>
      </div>
    </form>
  )
}
