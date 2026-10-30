import { useApp } from '../context/AppContext.jsx'
import Player from './Player.jsx'

export default function VideoModal() {
  const { video, setVideo } = useApp()
  if (!video) return null
  const title = typeof video === 'string' ? video : video.title
  return (
    <div className="ov" onClick={() => setVideo(null)}>
      <div className="card" style={{ width: 'min(640px,100%)' }} onClick={(e) => e.stopPropagation()}>
        <b>{title}</b>
        <div style={{ margin: '10px 0' }}>
          {video.fileKey ? <Player fileKey={video.fileKey} /> : <div className="pl">▶</div>}
        </div>
        <button className="btn s" onClick={() => setVideo(null)}>بستن</button>
      </div>
    </div>
  )
}
