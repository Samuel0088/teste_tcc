import { useEffect, useState } from "react"

const LEVELS = [
  { label: "Texto normal", value: 1 },
  { label: "Texto grande", value: 1.12 },
  { label: "Texto extra grande", value: 1.24 },
]

export default function AccessibilityTextControls() {
  const [levelIndex, setLevelIndex] = useState(() => {
    const saved = Number(localStorage.getItem("accessibilityTextLevel"))
    return Number.isInteger(saved) && saved >= 0 && saved < LEVELS.length ? saved : 0
  })

  useEffect(() => {
    const level = LEVELS[levelIndex]
    document.documentElement.style.fontSize = `${16 * level.value}px`
    document.documentElement.dataset.textSize = String(levelIndex)
    localStorage.setItem("accessibilityTextLevel", String(levelIndex))
  }, [levelIndex])

  return (
    <div className="accessibility-text-controls" aria-label="Controle de tamanho do texto">
      <button
        type="button"
        onClick={() => setLevelIndex((current) => Math.max(0, current - 1))}
        disabled={levelIndex === 0}
        aria-label="Diminuir tamanho do texto"
      >
        A-
      </button>
      <span>{LEVELS[levelIndex].label}</span>
      <button
        type="button"
        onClick={() => setLevelIndex((current) => Math.min(LEVELS.length - 1, current + 1))}
        disabled={levelIndex === LEVELS.length - 1}
        aria-label="Aumentar tamanho do texto"
      >
        A+
      </button>
    </div>
  )
}
