import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          video.srcObject = stream
        })
        .catch(function(error) {
          console.log('Error: ' + error)
        })
    } else {
      console.log('getUserMedia not supported')
    }

    // Cleanup function to stop the stream when component unmounts
    return () => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <>
      <h1>Wig Matcher</h1>
      <div className="container">
        <video
          ref={videoRef}
          autoPlay
          className="video-element"
        />
        <img
          src="/facial-silhouette.svg"
          alt="Face guide"
          className="silhouette-overlay"
        />
      </div>
    </>
  )
}

export default App
