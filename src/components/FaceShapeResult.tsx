import './FaceShapeResult.css'
import type { FaceAnalysis, FaceShape } from '../utils/faceAnalysis'

interface FaceShapeResultProps {
  analysis: FaceAnalysis | null
  capturedImage: string | null
  error?: string | null
}

const shapeDescriptions: Record<FaceShape, string> = {
  Oval: 'Balanced proportions with a softly rounded jawline.',
  Long: 'Elongated silhouette with a narrower width compared to length.',
  Round: 'Fuller cheeks and a nearly equal face width and height.',
  Diamond: 'Narrow forehead and jaw with the widest point at the cheekbones.',
  Heart: 'Broader forehead tapering down to a slimmer jawline and chin.',
  Square: 'Angular jawline with similar widths across the forehead and jaw.',
}

function formatMetric(value: number) {
  return value.toFixed(2)
}

function FaceShapeResult({ analysis, capturedImage, error }: FaceShapeResultProps) {
  const shapeName = analysis ? analysis.shape : 'Detecting...'

  return (
    <div className="face-shape-card">
      <div className="face-shape-top">
        <div className="face-shape-main">
          <p className="face-shape-eyebrow">Face shape</p>
          <h2>{shapeName}</h2>
          {analysis && (
            <p className="face-shape-desc">
              {shapeDescriptions[analysis.shape]}
            </p>
          )}
          {analysis && (
            <p className="face-shape-confidence">
              Confidence: {(analysis.confidence * 100).toFixed(0)}%
            </p>
          )}
          {!error && !analysis && (
            <p className="face-shape-waiting">
              Running TensorFlow facial landmark detection...
            </p>
          )}
          {error && (
            <div className="face-shape-error">
              <p>{error}</p>
              <p className="face-shape-hint">
                Try better lighting, removing glasses, or re-centering your face before capturing again.
              </p>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="face-preview">
            <img src={capturedImage} alt="Captured face" />
          </div>
        )}
      </div>
    </div>
  )
}

export default FaceShapeResult
