import './SeeDeeperSection.css'
import DitherVideo from './DitherVideo'
import seeDeeperTopVideo from '../assets/seedeepersection.webm'
import seeDeeperBottomVideo from '../assets/seedeeperleftVideo.mp4'
import seeDeeperRightBottomVideo from '../assets/seedeeperrightbottom.webm'

import rightTopImg from '../assets/righttopimg.webp'
import leafImg from '../assets/leafImgFromrigt.webp'

import unseenBigSvg from '../assets/unseenbig.svg'
import unseenSmallSvg from '../assets/unseenSmall.svg'

const REPEATED_LINES = [
  'NOTHING HAPPENS UNSEEN.',
  'SEE DEEPER. AS IT HAPPENS.',
  'NOTHING HAPPENS UNSEEN.',
  'SEE DEEPER. AS IT HAPPENS.',
  'NOTHING HAPPENS UNSEEN.',
  'SEE DEEPER. AS IT HAPPENS.',
  'NOTHING HAPPENS UNSEEN.',
  'SEE DEEPER. AS IT HAPPENS.',
  'NOTHING HAPPENS UNSEEN.',
  'SEE DEEPER. AS IT HAPPENS.',
  'NOTHING HAPPENS UNSEEN.',
  // 'SEE DEEPER. AS IT HAPPENS.',
]

export default function SeeDeeperSection() {
  return (
    <section className="see-deeper-section">
      <div className="see-deeper-container">
        {/* Horizontal scanlines grid overlay across the complete section */}
        <div className="see-deeper-grid" aria-hidden="true" />

        {/* Main Headline Rows: 4 lines with monotone noise starting at left: 31.99px */}
        <div className="see-deeper-headline-group" aria-label="SEE DEEPER. AS IT HAPPENS. NOTHING HAPPENS UNSEEN.">
          <h2 className="see-deeper-title-line see-deeper-title-line-1">
            SEE DEEPER.
          </h2>
          <h2 className="see-deeper-title-line see-deeper-title-line-2">
            AS IT HAPPENS.
          </h2>
          <h2 className="see-deeper-title-line see-deeper-title-line-3">
            NOTHING
          </h2>
          <h2 className="see-deeper-title-line see-deeper-title-line-4">
            HAPPENS UNSEEN.
          </h2>
        </div>

        {/* Floating Overlapping Graphic Image across columns */}
        <img
          src={leafImg}
          alt=""
          loading="lazy"
          decoding="async"
          className="see-deeper-leaf-img"
          aria-hidden="true"
        />

        {/* Left Column (Width: 1222px at 1920px) */}
        <div className="see-deeper-left-col">
          {/* Top Rectangle: 1222px x 600px, #00487C with duotone noise effect and DitherVideo */}
          <div className="see-deeper-left-top">
            <div className="see-deeper-top-noise" aria-hidden="true" />

            <DitherVideo
              src={seeDeeperTopVideo}
              className="see-deeper-video"
              style="threshold"
              size={1}
              levels={5}
              brightness={100}
              contrast={0.92}
              mono={false}
              monoColor="#0900FF"
              mixBlendMode="difference"
              opacity={1}
              cropShift={{ x: 0.0, y: 0.0 }}
              noise={{
                size: 1,
                density: 100,
                color: '#00000057',
              }}
            />
          </div>

          {/* Bottom Rectangle (Video): 1222px x 900px, #340064 with duotone noise and DitherVideo */}
          <div className="see-deeper-left-bottom">
            <div className="see-deeper-bottom-noise" aria-hidden="true" />

            {/* Spec Text on top-left of waves box */}
            <p className="see-deeper-spec-text">
              ENTERPRISE COMPUTING IS BECOMING INCREASINGLY HETEROGENEOUS BUT OPERATING SYSTEMS STILL PRESENT AS GENERIC COMPUTING MODEL
            </p>

            <DitherVideo
              src={seeDeeperBottomVideo}
              className="see-deeper-video"
              style="threshold"
              size={1}
              levels={2}
              brightness={100}
              contrast={1}
              mono={false}
              monoColor="#0900FF"
              mixBlendMode="overlay"
              opacity={1}
              cropShift={{ x: 0.0, y: 0.0 }}
              noise={{
                size: 1,
                density: 100,
                color: '#00000057',
              }}
            />
          </div>
        </div>

        {/* Right Column (Width: 698px at 1920px) */}
        <div className="see-deeper-right-col">
          {/* Right Top Box: 698px x 946px, bg #192C09, duotone noise, image, spec text */}
          <div className="see-deeper-right-top">
            <div className="see-deeper-right-top-noise" aria-hidden="true" />
            <img
              src={rightTopImg}
              alt=""
              loading="lazy"
              decoding="async"
              className="see-deeper-right-top-img"
              aria-hidden="true"
            />
            {/* Spec Text on right top box */}
            <p className="see-deeper-right-spec-text">
              provide unified visibility into system, application, network, and hardware performance
            </p>
          </div>

          {/* Right Bottom Box: 698px x 554px, bg #006451, duotone noise, repeated text overlay, and DitherVideo */}
          <div className="see-deeper-right-bottom">
            <div className="see-deeper-right-bottom-noise" aria-hidden="true" />

            {/* Repeating Background Text Overlay (placed below video) */}
            <div className="see-deeper-ticker-wrap" aria-hidden="true">
              {REPEATED_LINES.map((line, idx) => (
                <div key={idx} className="see-deeper-ticker-line">
                  {line}
                </div>
              ))}
            </div>

            <DitherVideo
              src={seeDeeperRightBottomVideo}
              className="see-deeper-video"
              style="threshold"
              crop="center"
              rotation={-90}
              size={1}
              levels={2}
              brightness={100}
              contrast={1}
              mono={false}
              monoColor="#0900FF"
              mixBlendMode="overlay"
              opacity={1}
              cropShift={{ x: 0.0, y: -0.05 }}
              noise={{
                size: 1,
                density: 100,
                color: '#00000057',
              }}
            />

            {/* Center Concentric Rotating Badge (Big clockwise, Small anticlockwise) */}
            <div className="see-deeper-badge-wrapper" aria-hidden="true">
              <img
                src={unseenBigSvg}
                alt=""
                loading="lazy"
                decoding="async"
                className="see-deeper-circle-big"
              />
              <img
                src={unseenSmallSvg}
                alt=""
                loading="lazy"
                decoding="async"
                className="see-deeper-circle-small"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

