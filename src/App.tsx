import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import Selections, { type WigPreferences } from './components/Selections'
import Camera from './components/Camera'
import Loading from './components/Loading'
import Results from './components/Results'

type Step = 'landing' | 'selections' | 'camera' | 'loading' | 'results'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing')
  const [wigPreferences, setWigPreferences] = useState<WigPreferences | null>(null)
  // _capturedImage will be used for TensorFlow processing
  const [_capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleLandingNext = () => {
    setCurrentStep('selections')
  }

  const handleSelectionsNext = (preferences: WigPreferences) => {
    setWigPreferences(preferences)
    setCurrentStep('camera')
  }

  const handleCameraCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl)
    setCurrentStep('loading')
    
    // TODO: Process image with TensorFlow here
    // For now, simulate processing delay, then move to results
    // When TensorFlow is integrated, call setCurrentStep('results') after analysis completes

    setTimeout(() => {
      setCurrentStep('results')
    }, 3000) // 3 second placeholder delay
  }

  return (
    <div className="app-container">
      {currentStep === 'landing' && <Landing onNext={handleLandingNext} />}
      {currentStep === 'selections' && <Selections onNext={handleSelectionsNext} />}
      {currentStep === 'camera' && <Camera onCapture={handleCameraCapture} />}
      {currentStep === 'loading' && <Loading />}
      {currentStep === 'results' && wigPreferences && (
        <Results preferences={wigPreferences} />
      )}
    </div>
  )
}

export default App
