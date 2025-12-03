import './Landing.css'

interface LandingProps {
onNext: () => void
}

function Landing({ onNext }: LandingProps) {
return (
    <div className="landing-container">
    <h1>Wig Matcher</h1>
    <p className="landing-subtitle">Find your perfect wig match</p>
    <p className="landing-description">
        Discover wigs that perfectly complement your unique facial features and style preferences
    </p>
    <button onClick={onNext} className="landing-button">
        Get Started
    </button>
    </div>
)
}

export default Landing

