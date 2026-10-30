import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { coupons } from '../config.js'
import { toman } from '../lib/format.js'
import { startPayment } from '../lib/payment.js'

export default function Cart() {
  const { courses, cart, setCart, user, grantCourses, notify, setRedirectTo } = useApp()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [paying, setPaying] = useState(false)

  const items = cart.map((id) => courses.find((c) => c.id === id)).filter(Boolean)
  const subtotal = items.reduce((sum, c) => sum + c.price, 0)
  const total = Math.round(subtotal * (1 - discount))

  const applyCoupon = () => {
    const value = coupons[code.trim().toUpperCase()]
    if (!value) return notify('کد تخفیف معتبر نیست')
    setDiscount(value)
    notify('کد تخفیف اعمال شد')
  }

  const pay = async () => {
    if (!user) {
      notify('برای پرداخت ابتدا وارد شوید')
      setRedirectTo('/cart')
      return navigate('/login')
    }
    setPaying(true)
    try {
      const result = await startPayment({ amount: total, courseIds: items.map((c) => c.id) })
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }
      grantCourses(items.map((c) => c.id))
      navigate('/panel')
    } catch {
      notify('اتصال به درگاه پرداخت ناموفق بود')
    } finally {
      setPaying(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="wrap">
        <section>
          <h2>سبد خرید</h2>
          <div className="card">
            سبد خرید خالی است. <Link className="link" to="/courses">مشاهدهٔ دوره‌ها</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="wrap">
      <section>
        <h2>سبد خرید</h2>
        <div className="card">
          {items.map((course) => (
            <div className="row cart-item" key={course.id}>
              <span>{course.title}</span>
              <span className="row-actions">
                {toman(course.price)}
                <button className="btn btn-outline btn-sm" onClick={() => setCart(cart.filter((id) => id !== course.id))}>
                  حذف
                </button>
              </span>
            </div>
          ))}
          <hr />
          <div className="row">
            <input className="grow" placeholder="کد تخفیف" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn btn-outline" onClick={applyCoupon}>اعمال</button>
          </div>
          <p>جمع دوره‌ها: {toman(subtotal)}</p>
          {discount > 0 && <p>تخفیف: {toman(subtotal - total)}</p>}
          <p className="price total">مبلغ قابل پرداخت: {toman(total)}</p>
          <button className="btn" onClick={pay} disabled={paying}>
            {paying ? 'در حال اتصال…' : 'پرداخت'}
          </button>
        </div>
      </section>
    </main>
  )
}
