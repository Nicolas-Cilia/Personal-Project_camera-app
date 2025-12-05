import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import Selections, { type WigPreferences } from './components/Selections'
import Camera from './components/Camera'
import Loading from './components/Loading'
import Results from './components/Results'
import { analyzeFaceShape, type FaceAnalysis } from './utils/faceAnalysis'

type Step = 'landing' | 'selections' | 'camera' | 'loading' | 'results'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing')
  const [wigPreferences, setWigPreferences] = useState<WigPreferences | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleLandingNext = () => {
    setCurrentStep('selections')
  }

  const handleSelectionsNext = (preferences: WigPreferences) => {
    setWigPreferences(preferences)
    setCurrentStep('camera')
  }

  const handleCameraCapture = async (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl)
    setCurrentStep('loading')

    setAnalysisError(null)
    setFaceAnalysis(null)

    try {
      const analysis = await analyzeFaceShape(imageDataUrl)
      setFaceAnalysis(analysis)
    } catch (error) {
      console.error('Face analysis failed', error)
      setAnalysisError('We could not confidently read your face shape. Try retaking the photo with clear lighting.')
    } finally {
      setCurrentStep('results')
    }
  }

  return (
    <div className="app-container">
      {currentStep === 'landing' && <Landing onNext={handleLandingNext} />}
      {currentStep === 'selections' && <Selections onNext={handleSelectionsNext} />}
      {currentStep === 'camera' && <Camera onCapture={handleCameraCapture} />}
      {currentStep === 'loading' && <Loading />}
      {currentStep === 'results' && wigPreferences && (
        <Results
          preferences={wigPreferences}
          analysis={faceAnalysis}
          capturedImage={capturedImage}
          error={analysisError}
        />
      )}
    </div>
  )
}

export default App
