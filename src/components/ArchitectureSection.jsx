import { useEffect, useState } from 'react'
import './ArchitectureSection.css'
import DitherVideo from './DitherVideo'
import architechVideo from '../assets/architechsection.webm'
import largeCircleSvg from '../assets/largecircle.svg'
import smallCircleSvg from '../assets/smallcircle.svg'

export default function ArchitectureSection() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="architecture-section">
      <div className="architecture-main">
        {/* Duotone Noise Effect (size 1, density 54%, #000000 & #E0ECD940) */}
        <div className="architecture-noise" aria-hidden="true" />

        {/* Top-Left Header Spec Text (Desktop) */}
        <p className="architecture-header-text architecture-desktop-only">
          DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY.
        </p>

        {/* Watermark Background Text with Overlay Blend Mode & Monotone Noise (Desktop) */}
        <div className="architecture-watermark architecture-desktop-only" aria-hidden="true">
          <p className="architecture-watermark-text">
            DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY.
          </p>
        </div>

        {/* Dithered Video with Monotone Noise & Color Dodge (rotated 90deg on mobile) */}
        <DitherVideo
          src={architechVideo}
          className="architecture-video-bg"
          style="threshold"
          size={1}
          levels={2}
          brightness={100}
          contrast={1}
          mono={false}
          monoColor="#0900FF"
          mixBlendMode="color-dodge"
          opacity={1}
          rotation={isMobile ? 270 : 0}
          crop={isMobile ? 'cover' : 'cover'}
          cropShift={isMobile ? { x: 0.0, y: 0.0 } : { x: 0.18, y: 0.0 }}
          noise={{
            size: 1,
            density: 100,
            color: '#00000057',
          }}
        />

        {/* Left "NOT BOLTED ON" Text (Desktop) */}
        <span className="architecture-bolted-text architecture-bolted-left architecture-desktop-only">
          NOT BOLTED ON
        </span>

        {/* Center Concentric Rotating Badge (Large Clockwise, Small Anticlockwise) */}
        <div className="architecture-badge-wrapper" aria-hidden="true">
          <img
            src={largeCircleSvg}
            alt=""
            loading="lazy"
            decoding="async"
            className="architecture-circle-large"
          />
          <img
            src={smallCircleSvg}
            alt=""
            loading="lazy"
            decoding="async"
            className="architecture-circle-small"
          />
        </div>

        {/* Right "NOT BOLTED ON" Text (Desktop) */}
        <span className="architecture-bolted-text architecture-bolted-right architecture-desktop-only">
          NOT BOLTED ON
        </span>

        {/* Mobile Screen Layout Elements */}
        <div className="architecture-mobile-wrap" aria-label="Architecture Details">
          {/* Top Title: NOT BOLTED ON */}
          <div className="architecture-mobile-top-title">NOT BOLTED ON</div>

          {/* Description text */}
          <p className="architecture-mobile-desc">
            DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY.
          </p>

          {/* Bottom Stack: 4 lines of NOT BOLTED ON */}
          <div className="architecture-mobile-bottom-stack">
            <div className="architecture-mobile-bottom-line">NOT BOLTED ON</div>
            <div className="architecture-mobile-bottom-line">NOT BOLTED ON</div>
            <div className="architecture-mobile-bottom-line">NOT BOLTED ON</div>
            <div className="architecture-mobile-bottom-line">NOT BOLTED ON</div>
          </div>
        </div>

        {/* Horizontal scanlines grid overlay */}
        <div className="architecture-grid" aria-hidden="true" />
      </div>

      {/* Bottom bar with #11007C, duotone noise, and scanlines (Desktop) */}
      <div className="architecture-bottom-bar architecture-desktop-only" aria-hidden="true">
        <div className="architecture-grid" aria-hidden="true" />
      </div>
    </section>
  )
}

