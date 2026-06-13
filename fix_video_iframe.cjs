const fs = require('fs')
let c = fs.readFileSync('src/pages/courses/ModulePlayer.jsx', 'utf8')

const oldVideo = `              {module?.video_url ? (
                <div style={{ aspectRatio: '16/9', background: '#000' }}>
                  <video controls style={{ width: '100%', height: '100%' }} src={module.video_url} />
                </div>
              ) : (`

const newVideo = `              {module?.video_url ? (
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src={module.video_url}
                    loading="lazy"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                    allowFullScreen
                  />
                </div>
              ) : (`

c = c.replace(oldVideo, newVideo)

fs.writeFileSync('src/pages/courses/ModulePlayer.jsx', c)
console.log('ModulePlayer.jsx updated - video now renders as Bunny.net iframe')
