import { useState } from 'react'
import heroLeft from '../assets/heroleftimg.webp'
import heroRight from '../assets/herorightimg.webp'
import './Hero.css'

export default function Hero() {
  const [leftRatio, setLeftRatio] = useState(null)
  const [rightRatio, setRightRatio] = useState(null)

  return (
    <section className="hero-section">
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="hero-bg-wrapper">
        <img
          src={heroLeft}
          alt=""
          className="hero-img hero-img-left"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.target
            if (naturalWidth && naturalHeight) {
              setLeftRatio(`${naturalWidth} / ${naturalHeight}`)
            }
          }}
          style={leftRatio ? { aspectRatio: leftRatio } : undefined}
        />
        <img
          src={heroRight}
          alt=""
          className="hero-img hero-img-right"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.target
            if (naturalWidth && naturalHeight) {
              setRightRatio(`${naturalWidth} / ${naturalHeight}`)
            }
          }}
          style={rightRatio ? { aspectRatio: rightRatio } : undefined}
        />
      </div>

      {/* Bottom bar with duotone noise, sits behind the right image */}
      <div className="hero-bottom-bar" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-title-box">
          <div className="hero-title-noise" aria-hidden="true" />

          {/* Top corner labels */}
          <div className="hero-corner-row hero-corner-top">
            <span className="hero-corner-text">Purpose Built</span>
            <span className="hero-corner-text">Purpose Built</span>
          </div>

          {/* Main title */}
          <div className="hero-main-title">
            <h1 className="hero-title-operating">Operating</h1>
            <h2 className="hero-title-systems">Systems</h2>
          </div>

          {/* Bottom corner labels */}
          <div className="hero-corner-row hero-corner-bottom">
            <span className="hero-corner-text">Purpose Built</span>
            <span className="hero-corner-text">Purpose Built</span>
          </div>
        </div>
      </div>
    </section>
  )
}
