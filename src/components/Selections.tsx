import { useState } from 'react'
import './Selections.css'

export interface WigPreferences {
color: string
length: string
texture: string
}

interface SelectionsProps {
onNext: (preferences: WigPreferences) => void
}

function Selections({ onNext }: SelectionsProps) {
const [color, setColor] = useState('')
const [length, setLength] = useState('')
const [texture, setTexture] = useState('')

const handleNext = () => {
    if (color && length && texture) {
    onNext({ color, length, texture })
    }
}

const colors = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray', 'Mixed']
const lengths = ['Short', 'Medium', 'Long', 'Extra Long']
const textures = ['Straight', 'Wavy', 'Curly', 'Kinky', 'Silky']

return (
    <div className="selections-container">
    <h1>Choose Your Style Preferences</h1>
    <p className="selections-subtitle">Select your desired wig characteristics</p>

    <div className="selection-section">
        <h2>Color</h2>
        <div className="options-grid">
        {colors.map((c) => (
            <button
            key={c}
            onClick={() => setColor(c)}
            className={`option-button ${color === c ? 'selected' : ''}`}
            >
            {c}
            </button>
        ))}
        </div>
    </div>

    <div className="selection-section">
        <h2>Length</h2>
        <div className="options-grid">
        {lengths.map((l) => (
            <button
            key={l}
            onClick={() => setLength(l)}
            className={`option-button ${length === l ? 'selected' : ''}`}
            >
            {l}
            </button>
        ))}
        </div>
    </div>

    <div className="selection-section">
        <h2>Texture</h2>
        <div className="options-grid">
        {textures.map((t) => (
            <button
            key={t}
            onClick={() => setTexture(t)}
            className={`option-button ${texture === t ? 'selected' : ''}`}
            >
            {t}
            </button>
        ))}
        </div>
    </div>

    <button
        onClick={handleNext}
        className="selections-next-button"
        disabled={!color || !length || !texture}
    >
        Continue to Camera
    </button>
    </div>
)
}

export default Selections

