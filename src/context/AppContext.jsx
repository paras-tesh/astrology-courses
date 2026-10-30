import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import useLocalState from '../hooks/useLocalState.js'
import { seedCourses, seedReviews } from '../data/seed.js'

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalState('theme', 'minimal')
  const [user, setUser] = useLocalState('user', null)
  const [cart, setCart] = useLocalState('cart', [])
  const [owned, setOwned] = useLocalState('owned', [])
  const [progress, setProgress] = useLocalState('progress', {})
  const [courses, setCourses] = useLocalState('courses', seedCourses)
  const [reviews, setReviews] = useLocalState('reviews', seedReviews)
  const [isAdmin, setIsAdmin] = useLocalState('isAdmin', false)

  const [toast, setToast] = useState('')
  const [media, setMedia] = useState(null)
  const [redirectTo, setRedirectTo] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }, [])

  const closeMedia = useCallback(() => setMedia(null), [])

  const addToCart = (courseId) => {
    if (owned.includes(courseId)) return notify('این دوره را قبلاً دارید')
    if (!cart.includes(courseId)) setCart([...cart, courseId])
    notify('به سبد خرید اضافه شد')
  }

  const grantCourses = (ids) => {
    setOwned([...new Set([...owned, ...ids])])
    setCart([])
  }

  const toggleLesson = (courseId, sessionId) => {
    const key = `${courseId}:${sessionId}`
    setProgress({ ...progress, [key]: !progress[key] })
  }

  const saveCourse = (course) => {
    const exists = courses.some((c) => c.id === course.id)
    setCourses(exists ? courses.map((c) => (c.id === course.id ? course : c)) : [...courses, course])
  }

  const deleteCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId))
    setCart(cart.filter((id) => id !== courseId))
  }

  const submitReview = (name, text) => {
    setReviews([...reviews, { id: String(Date.now()), name, text, status: 'pending' }])
  }

  const approveReview = (id) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const removeReview = (id) => setReviews(reviews.filter((r) => r.id !== id))

  const value = {
    theme, setTheme,
    user, setUser,
    cart, setCart,
    owned, grantCourses,
    progress, toggleLesson,
    courses, saveCourse, deleteCourse,
    reviews, submitReview, approveReview, removeReview,
    isAdmin, setIsAdmin,
    toast, notify,
    media, openMedia: setMedia, closeMedia,
    redirectTo, setRedirectTo,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
