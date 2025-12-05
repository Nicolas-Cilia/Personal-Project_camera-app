import '@tensorflow/tfjs-backend-webgl'
import * as tf from '@tensorflow/tfjs-core'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

export type FaceShape = 'Oval' | 'Long' | 'Round' | 'Diamond' | 'Heart' | 'Square'

export interface FaceAnalysis {
  shape: FaceShape
  confidence: number
  metrics: {
    lengthWidthRatio: number
    foreheadToCheekRatio: number
    jawToCheekRatio: number
  }
}

let detectorPromise: Promise<faceLandmarksDetection.FaceLandmarksDetector> | null = null

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

async function getDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      return faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
        },
      )
    })()
  }

  return detectorPromise
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
}

function normalizeKeypoints(keypoints: faceLandmarksDetection.Keypoint[]) {
  const xs = keypoints.map(point => point.x)
  const ys = keypoints.map(point => point.y)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const width = xMax - xMin
  const height = yMax - yMin

  const normalized = keypoints.map(point => ({
    x: (point.x - xMin) / width,
    y: (point.y - yMin) / height,
  }))

  return { normalized, width, height }
}

function widthForBand(points: { x: number; y: number }[], minY: number, maxY: number) {
  const band = points.filter(point => point.y >= minY && point.y <= maxY)
  if (!band.length) return 0

  const xs = band.map(point => point.x)
  return Math.max(...xs) - Math.min(...xs)
}

function classifyFaceShape(keypoints: faceLandmarksDetection.Keypoint[]): FaceAnalysis {
  const { normalized, width, height } = normalizeKeypoints(keypoints)
  if (width === 0 || height === 0) {
    throw new Error('Invalid face bounds detected.')
  }

  const lengthWidthRatio = height / width
  const foreheadWidth = widthForBand(normalized, 0, 0.28)
  const cheekWidth = widthForBand(normalized, 0.35, 0.65)
  const jawWidth = widthForBand(normalized, 0.65, 0.95)

  const foreheadToCheekRatio = cheekWidth ? foreheadWidth / cheekWidth : 0
  const jawToCheekRatio = cheekWidth ? jawWidth / cheekWidth : 0

  const scores: Record<FaceShape, number> = {
    Long: clamp((lengthWidthRatio - 1.25) / 0.65),
    Round: clamp(1 - Math.abs(lengthWidthRatio - 1.05) / 0.35) * clamp(1 - Math.abs(jawToCheekRatio - 1) / 0.35),
    Square: clamp(1 - Math.abs(lengthWidthRatio - 1.15) / 0.35) * clamp(jawToCheekRatio / 1.05),
    Oval: clamp(1 - Math.abs(lengthWidthRatio - 1.45) / 0.35) * clamp(1 - Math.abs(jawToCheekRatio - 0.9) / 0.25),
    Heart: clamp((foreheadToCheekRatio - 1) / 0.35) * clamp((1 - jawToCheekRatio) / 0.3),
    Diamond: clamp((1 - foreheadToCheekRatio) / 0.25) * clamp((1 - jawToCheekRatio) / 0.25),
  }

  let shape: FaceShape = 'Oval'
  let confidence = 0

  Object.entries(scores).forEach(([candidate, score]) => {
    if (score > confidence) {
      confidence = score
      shape = candidate as FaceShape
    }
  })

  return {
    shape,
    confidence,
    metrics: {
      lengthWidthRatio,
      foreheadToCheekRatio,
      jawToCheekRatio,
    },
  }
}

export async function analyzeFaceShape(imageDataUrl: string): Promise<FaceAnalysis> {
  const detector = await getDetector()
  const image = await loadImage(imageDataUrl)
  const faces = await detector.estimateFaces(image, { flipHorizontal: false })

  if (!faces.length) {
    throw new Error('No face detected')
  }

  const [firstFace] = faces
  if (!firstFace.keypoints || !firstFace.keypoints.length) {
    throw new Error('Face landmarks not available')
  }

  return classifyFaceShape(firstFace.keypoints)
}
