import { useState } from 'react'
import CourseForm from './CourseForm.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { keys, removeFiles } from '../../lib/files.js'
import { fa, toman } from '../../lib/format.js'

export default function CoursesTab() {
  const { courses, deleteCourse, notify } = useApp()
  const [editing, setEditing] = useState(false)
  const [target, setTarget] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const open = (course) => {
    setTarget(course)
    setEditing(true)
    window.scrollTo(0, 0)
  }

  const close = () => {
    setEditing(false)
    setTarget(null)
  }

  const remove = async (course) => {
    await removeFiles(keys.coursePrefix(course.id)).catch(() => {})
    deleteCourse(course.id)
    setConfirmId(null)
    notify('دوره حذف شد')
  }

  if (editing) return <CourseForm course={target} onDone={close} />

  return (
    <>
      <button className="btn" onClick={() => open(null)}>دورهٔ جدید</button>
      <h3>دوره‌های موجود</h3>
      {courses.map((course) => (
        <div className="card row course-row" key={course.id}>
          <span>
            <b>{course.title}</b>
            <span className="tag">{toman(course.price)}</span>
            <span className="tag">{fa(course.sessions.length)} جلسه</span>
            {course.hasBanner && <span className="tag">بنر</span>}
            {course.hasTeaser && <span className="tag">تیزر</span>}
          </span>
          <span className="row-actions">
            <button className="btn btn-outline btn-sm" onClick={() => open(course)}>ویرایش</button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => (confirmId === course.id ? remove(course) : setConfirmId(course.id))}
            >
              {confirmId === course.id ? 'تأیید حذف؟' : 'حذف'}
            </button>
          </span>
        </div>
      ))}
    </>
  )
}
