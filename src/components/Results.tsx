import './Results.css'
import type { WigPreferences } from './Selections'

interface ResultsProps {
preferences: WigPreferences
}

function Results({ preferences }: ResultsProps) {
return (
    <div className="results-container">
    <h1>Your Perfect Wig Matches</h1>
    <p className="results-subtitle">
        Based on your preferences: {preferences.color}, {preferences.length}, {preferences.texture}
    </p>
    <div className="results-placeholder">
        <p>Results will be displayed here</p>
        <p className="results-note">TensorFlow facial analysis and wig matching coming soon...</p>
    </div>
    </div>
)
}

export default Results

