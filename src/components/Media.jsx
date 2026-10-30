import useBlobUrl from '../hooks/useBlobUrl.js'
import { keys } from '../lib/files.js'

export function Cover({ course }) {
  const { url } = useBlobUrl(course.hasBanner ? keys.banner(course.id) : null)
  return url ? <img className="cover" src={url} alt={course.title} /> : <div className="cover" />
}

export function Player({ fileKey, kind }) {
  const { url, loading } = useBlobUrl(fileKey)
  if (loading) return null
  if (!url) return <p className="muted">فایل در دسترس نیست.</p>
  if (kind === 'audio') return <audio className="media" src={url} controls controlsList="nodownload" />
  return (
    <video
      className="media"
      src={url}
      controls
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}
