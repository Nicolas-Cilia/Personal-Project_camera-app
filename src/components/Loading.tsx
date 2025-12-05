import './Loading.css'

function Loading() {
return (
    <div className="loading-page-container">
    <div className="loading-spinner"></div>
    <h1>Analyzing Your Facial Structure</h1>
    <p className="loading-message">
        Processing your image securely on your device...
    </p>
    <p className="loading-submessage">
        This may take a few moments
    </p>
    </div>
)
}

export default Loading

