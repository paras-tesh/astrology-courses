import { useEffect, useState } from 'react'
import { getFile } from '../lib/files.js'

export default function useBlobUrl(key) {
  const [state, setState] = useState({ url: null, loading: Boolean(key) })

  useEffect(() => {
    if (!key) {
      setState({ url: null, loading: false })
      return undefined
    }
    let objectUrl = null
    let cancelled = false
    setState({ url: null, loading: true })
    getFile(key)
      .then((file) => {
        if (cancelled) return
        objectUrl = file ? URL.createObjectURL(file) : null
        setState({ url: objectUrl, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ url: null, loading: false })
      })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [key])

  return state
}
