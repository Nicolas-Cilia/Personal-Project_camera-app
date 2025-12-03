import { useEffect, useRef } from 'react'
import './Camera.css'

interface CameraProps {
onCapture: (imageDataUrl: string) => void
}

function Camera({ onCapture }: CameraProps) {
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

const captureImage = () => {
    const video = videoRef.current
    if (!video) return

    // Create a canvas element
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 500
    canvas.height = video.videoHeight || 375

    // Get the 2D context
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw the current video frame to the canvas
    // Note: We need to flip it back since the video is mirrored
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Convert canvas to DataURL and store in state
    const imageDataUrl = canvas.toDataURL('image/png')
    onCapture(imageDataUrl)
}

return (
    <div className="camera-page-container">
    <h1>Position Your Face</h1>
    <p className="camera-instructions">
        Center your face within the guide and click capture when ready
    </p>
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
    <button onClick={captureImage} className="capture-button">
        Capture
    </button>
    </div>
)
}

export default Camera

