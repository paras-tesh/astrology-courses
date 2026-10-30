import { useEffect, useState } from 'react'
import { getVideo } from '../api/videos.js'

// fileKey مثلاً: teaser-12  یا  s-12-0-video
export default function Player({ fileKey }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    let u
    getVideo(fileKey).then((blob) => {
      if (blob) { u = URL.createObjectURL(blob); setUrl(u) }
    }).catch(() => {})
    return () => { if (u) URL.revokeObjectURL(u) }
  }, [fileKey])

  return url
    ? <video className="vid" src={url} controls controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} />
    : <div className="pl">▶<small>ویدئو هنوز بارگذاری نشده</small></div>
}
