import './ArchitectureSection.css'
import DitherVideo from './DitherVideo'
import architechVideo from '../assets/architechsection.webm'
import largeCircleSvg from '../assets/largecircle.svg'
import smallCircleSvg from '../assets/smallcircle.svg'

export default function ArchitectureSection() {
  return (
    <section className="architecture-section">
      <div className="architecture-main">
        {/* Duotone Noise Effect (size 1, density 54%, #000000 & #E0ECD940) */}
        <div className="architecture-noise" aria-hidden="true" />

        {/* Top-Left Header Spec Text */}
        <p className="architecture-header-text">
          DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY.
        </p>

        {/* Watermark Background Text with Overlay Blend Mode & Monotone Noise */}
        <div className="architecture-watermark" aria-hidden="true">
          <p className="architecture-watermark-text">
            DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY. DESIGNED FOR INDUSTRY SPECIFIC SECURITY NEEDS BASED ON SPEED, ACCURACY, AUDIBILITY AND HIGH AVAILABILITY.
          </p>
        </div>

        {/* Dithered Video with Monotone Noise & Color Dodge */}
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
          cropShift={{ x: 0.18, y: 0.0 }}
          noise={{
            size: 1,
            density: 100,
            color: '#00000057',
          }}
        />

        {/* Left "NOT BOLTED ON" Text */}
        <span className="architecture-bolted-text architecture-bolted-left">
          NOT BOLTED ON
        </span>

        {/* Center Concentric Rotating Badge (Large Clockwise, Small Anticlockwise) */}
        <div className="architecture-badge-wrapper" aria-hidden="true">
          <img
            src={largeCircleSvg}
            alt=""
            className="architecture-circle-large"
          />
          <img
            src={smallCircleSvg}
            alt=""
            className="architecture-circle-small"
          />
        </div>

        {/* Right "NOT BOLTED ON" Text */}
        <span className="architecture-bolted-text architecture-bolted-right">
          NOT BOLTED ON
        </span>

        {/* Horizontal scanlines grid overlay */}
        <div className="architecture-grid" aria-hidden="true" />
      </div>

      {/* Bottom bar with #11007C, duotone noise, and scanlines */}
      <div className="architecture-bottom-bar" aria-hidden="true">
        <div className="architecture-grid" aria-hidden="true" />
      </div>
    </section>
  )
}

