import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { ADMIN_PASSWORD } from '../config.js'
import { deletePrefix, saveVideo } from '../api/videos.js'
import { fa } from '../utils.js'

const EMPTY = { id: null, title: '', level: 'مبتدی', emoji: '✨', price: '', duration: '', format: '', desc: '', features: '', topics: '', hasTeaser: false, sessionFiles: {} }
const TYPES = [['video', 'ویدئو', 'video/*'], ['pdf', 'PDF', 'application/pdf'], ['audio', 'فایل صوتی', 'audio/*']]
const lines = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean)

export default function Admin() {
  const { admin, setAdmin, courses, setCourses, say } = useApp()
  const [pass, setPass] = useState('')
  const [f, setF] = useState(EMPTY)
  const [teaser, setTeaser] = useState(null)
  const [sfiles, setSfiles] = useState({}) // مثلاً { '0-video': File }
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pick = (i, type, file) => setSfiles((s) => {
    const n = { ...s }
    if (file) n[`${i}-${type}`] = file; else delete n[`${i}-${type}`]
    return n
  })

  if (!admin) {
    return (
      <main className="w"><section style={{ maxWidth: 420, margin: 'auto' }}>
        <div className="card">
          <h2>ورود مدیر</h2>
          <input type="password" placeholder="رمز مدیر" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button className="btn" style={{ width: '100%' }} onClick={() => (pass === ADMIN_PASSWORD ? setAdmin(true) : say('رمز اشتباه است'))}>ورود</button>
        </div>
      </section></main>
    )
  }

  const reset = () => { setF(EMPTY); setTeaser(null); setSfiles({}) }
  const edit = (c) => {
    setF({ ...c, price: String(c.price), features: (c.features || []).join('\n'), topics: c.topics.join('\n'), sessionFiles: c.sessionFiles || {} })
    setTeaser(null); setSfiles({})
    window.scrollTo(0, 0)
  }

  const submit = async (e) => {
    e.preventDefault()
    const price = Number(f.price)
    if (!f.title.trim() || !price || !f.desc.trim()) return say('عنوان، قیمت و توضیحات را وارد کنید')
    setBusy(true)
    try {
      const id = f.id ?? Date.now()
      const topics = lines(f.topics)
      if (teaser) await saveVideo(`teaser-${id}`, teaser)
      for (const [k, file] of Object.entries(sfiles)) {
        if (Number(k.split('-')[0]) < topics.length) await saveVideo(`s-${id}-${k}`, file)
      }
      const sessionFiles = {}
      topics.forEach((_, i) => { sessionFiles[i] = { ...(f.sessionFiles?.[i] || {}) } })
      Object.keys(sfiles).forEach((k) => {
        const [i, type] = k.split('-')
        if (sessionFiles[i]) sessionFiles[i][type] = true
      })
      const course = {
        id, title: f.title.trim(), level: f.level, emoji: f.emoji || '✨', price,
        duration: f.duration, format: f.format, desc: f.desc.trim(),
        features: lines(f.features), topics, sessions: topics.length,
        hasTeaser: !!teaser || !!f.hasTeaser, sessionFiles,
      }
      setCourses(f.id ? courses.map((c) => (c.id === id ? course : c)) : [...courses, course])
      say(f.id ? 'دوره ذخیره شد' : 'دوره اضافه شد')
      reset()
    } catch {
      say('ذخیرهٔ فایل انجام نشد؛ حجم فایل‌ها را بررسی کنید')
    }
    setBusy(false)
  }

  const remove = async (c) => {
    if (!window.confirm(`حذف «${c.title}»؟`)) return
    await deletePrefix(`teaser-${c.id}`).catch(() => {})
    await deletePrefix(`s-${c.id}-`).catch(() => {})
    setCourses(courses.filter((x) => x.id !== c.id))
    say('دوره حذف شد')
  }

  const topics = lines(f.topics)

  return (
    <main className="w">
      <section>
        <div className="row"><h2>مدیریت دوره‌ها</h2><button className="btn o s" onClick={() => setAdmin(false)}>خروج مدیر</button></div>
        <p className="mut">توجه: در نسخهٔ آزمایشی، دوره‌ها و فایل‌ها فقط در همین مرورگر ذخیره می‌شوند.</p>

        <form className="card fld" onSubmit={submit}>
          <h3>{f.id ? 'ویرایش دوره' : 'دورهٔ جدید'}</h3>
          <label>عنوان دوره<input value={f.title} onChange={set('title')} /></label>
          <label>تیزر دوره (ویدئوی کوتاه و رایگان){f.hasTeaser && !teaser ? ' ✔ دارد؛ برای تعویض فایل جدید انتخاب کنید' : ''}
            <input type="file" accept="video/*" onChange={(e) => setTeaser(e.target.files[0] || null)} />
          </label>
          {teaser && <p className="mut">{teaser.name} · {fa(Math.round(teaser.size / 1048576))} مگابایت</p>}
          <label>توضیحات دوره<textarea rows="5" value={f.desc} onChange={set('desc')} /></label>
          <label>ویژگی‌های دوره (هر خط یک ویژگی)<textarea rows="4" value={f.features} onChange={set('features')} /></label>
          <label>سرفصل جلسات (هر خط یک جلسه)<textarea rows="5" value={f.topics} onChange={set('topics')} /></label>

          {topics.length > 0 && (
            <>
              <h4>فایل‌های هر جلسه (اختیاری، فقط برای دانشجوهای ثبت‌نام‌شده)</h4>
              <p className="mut">فایل‌ها به شمارهٔ جلسه وصل‌اند؛ بعد از آپلود ترتیب سرفصل‌ها را جابه‌جا نکنید.</p>
              {topics.map((t, i) => (
                <div className="sf" key={i}>
                  <b>جلسهٔ {fa(i + 1)}: {t}</b>
                  <div className="g">
                    {TYPES.map(([type, label, accept]) => (
                      <label key={type}>{label}{(f.sessionFiles?.[i]?.[type] || sfiles[`${i}-${type}`]) ? ' ✔' : ''}
                        <input type="file" accept={accept} onChange={(e) => pick(i, type, e.target.files[0])} />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="grid">
            <label>قیمت (تومان)<input type="number" min="0" value={f.price} onChange={set('price')} /></label>
            <label>سطح
              <select value={f.level} onChange={set('level')}>
                <option>مبتدی</option><option>پیشرفته</option><option>فنگ‌شویی</option>
              </select>
            </label>
            <label>مدت هر جلسه<input value={f.duration} onChange={set('duration')} placeholder="مثلاً ۶۰ دقیقه" /></label>
            <label>فرمت<input value={f.format} onChange={set('format')} placeholder="ویدئو ضبط‌شده + PDF" /></label>
            <label>ایموجی کارت<input value={f.emoji} onChange={set('emoji')} /></label>
          </div>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'در حال ذخیره…' : 'ذخیره'}</button>{' '}
          {f.id && <button className="btn o" type="button" onClick={reset}>انصراف</button>}
        </form>

        <h3 style={{ marginTop: 28 }}>دوره‌های موجود</h3>
        {courses.map((c) => (
          <div className="card row" key={c.id} style={{ marginBottom: 10 }}>
            <span>{c.emoji} {c.title} <span className="tag">{fa(c.price)} تومان</span>{c.hasTeaser && <span className="tag">🎞 تیزر</span>}</span>
            <span>
              <button className="btn o s" onClick={() => edit(c)}>ویرایش</button>{' '}
              <button className="btn o s" onClick={() => remove(c)}>حذف</button>
            </span>
          </div>
        ))}
      </section>
    </main>
  )
}
