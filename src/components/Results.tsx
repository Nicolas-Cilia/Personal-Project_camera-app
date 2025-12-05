import './Results.css'
import FaceShapeResult from './FaceShapeResult'
import type { WigPreferences } from './Selections'
import type { FaceAnalysis } from '../utils/faceAnalysis'

interface ResultsProps {
  preferences: WigPreferences
  analysis: FaceAnalysis | null
  capturedImage: string | null
  error?: string | null
}

function Results({ preferences, analysis, capturedImage, error }: ResultsProps) {
  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Your Perfect Wig Matches</h1>
        <p className="results-subtitle">
          Based on your preferences: {preferences.color}, {preferences.length}, {preferences.texture}
        </p>
      </div>

      <FaceShapeResult analysis={analysis} capturedImage={capturedImage} error={error} />

      <div className="results-next">
        <h3>Next up: wig matching</h3>
        <p>
          We will pair your <strong>{analysis?.shape ?? 'detected'}</strong> face shape with wigs that
          complement your preferences. This step will use your captured photo and selections to query our wig
          library.
        </p>
      </div>
    </div>
  )
}

export default Results
