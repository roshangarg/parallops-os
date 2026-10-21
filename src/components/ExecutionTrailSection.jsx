import React from 'react'
import './ExecutionTrailSection.css'
import DitherVideo from './DitherVideo'
import executionGrid1Video from '../assets/executionGrid1video.mp4'
import nothingBigSvg from '../assets/nothingBig.svg'
import nothingSmallSvg from '../assets/nothingSmall.svg'
import executionGrid2Img from '../assets/executionGrid2img.png'
import executionGrid3Img from '../assets/executionGrid3img.png'
import executionGrid4Video from '../assets/executionGrid4Video.webm'

const TEXT_PHRASE = 'EVERY EXECUTION LEAVES A TRAIL. '

// 12 lines total (6 in top 400px row, 6 in bottom 400px row)
// Odd lines (0, 2, 4, 6, 8, 10): Bright #E0ECD9, moves right-to-left
// Even lines (1, 3, 5, 7, 9, 11): Dim #E0ECD957, moves left-to-right
const ROWS = [
  { id: 1, isBright: true, direction: 'left', delay: -8 },
  { id: 2, isBright: false, direction: 'right', delay: -22 },
  { id: 3, isBright: true, direction: 'left', delay: -37 },
  { id: 4, isBright: false, direction: 'right', delay: -14 },
  { id: 5, isBright: true, direction: 'left', delay: -29 },
  { id: 6, isBright: false, direction: 'right', delay: -44 },
  { id: 7, isBright: true, direction: 'left', delay: -5 },
  { id: 8, isBright: false, direction: 'right', delay: -33 },
  { id: 9, isBright: true, direction: 'left', delay: -18 },
  { id: 10, isBright: false, direction: 'right', delay: -48 },
  { id: 11, isBright: true, direction: 'left', delay: -25 },
  { id: 12, isBright: false, direction: 'right', delay: -11 },
]

export default function ExecutionTrailSection() {
  return (
    <section className="trail-section" aria-label="Execution Trail Section">
      <div className="trail-container">
        {/* Background Marquee Text Rows */}
        <div className="trail-bg-marquee" aria-hidden="true">
          {ROWS.map((row) => (
            <div key={row.id} className="trail-row">
              <div
                className={`trail-track trail-track-${row.direction}`}
                style={{ animationDelay: `${row.delay}s` }}
              >
                {/* Two identical groups for seamless 100% infinite loop */}
                <div className={`trail-group ${row.isBright ? 'trail-text-bright' : 'trail-text-dim'}`}>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                </div>
                <div className={`trail-group ${row.isBright ? 'trail-text-bright' : 'trail-text-dim'}`}>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                  <span>{TEXT_PHRASE}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monotone Noise Overlay (size 0.5, density 64%, color #0000008A) */}
        <div className="trail-noise-overlay" aria-hidden="true" />

        {/* Horizontal Scanlines Grid Overlay */}
        <div className="trail-scanlines" aria-hidden="true" />

        {/* Center Grid Dividing Lines */}
        <div className="trail-divider-vertical" aria-hidden="true" />
        <div className="trail-divider-horizontal" aria-hidden="true" />

        {/* 2x2 Grid of 4 Boxes (each 960px x 400px at 1920px width)
            Box 1 (top-left): Video 1 (to be added next)
            Box 2 (top-right): Pink Flower Image (to be added next)
            Box 3 (bottom-left): Teal Bird Image (to be added next)
            Box 4 (bottom-right): Landscape Video 2 (to be added next)
        */}
        <div className="trail-grid-layout">
          <div className="trail-box trail-box-1" data-box="1">
            {/* Background #910BF8 with Duotone Noise */}
            <div className="trail-box-1-bg" />
            <div className="trail-box-1-noise" aria-hidden="true" />

            {/* Dither Video: Threshold, Size 1, Levels 8, Brightness 100%, Contrast 1.4, Rotated 90deg, Difference blend */}
            <DitherVideo
              src={executionGrid1Video}
              style="threshold"
              size={1}
              levels={8}
              brightness={1}
              contrast={1.4}
              mono={false}
              mixBlendMode="difference"
              opacity={1}
              crop="center"
              cropShift={{ x: 0, y: 0 }}
              noise={true}
              rotation={90}
              className="trail-box-1-video"
            />

            {/* Center Concentric Rotating Badge (Big Clockwise, Small Anticlockwise) */}
            <div className="trail-badge-wrapper" aria-hidden="true">
              <img
                src={nothingBigSvg}
                alt=""
                loading="lazy"
                decoding="async"
                className="trail-circle-big"
              />
              <img
                src={nothingSmallSvg}
                alt=""
                loading="lazy"
                decoding="async"
                className="trail-circle-small"
              />
            </div>
          </div>
          <div className="trail-box trail-box-2" data-box="2">
            <img
              src={executionGrid2Img}
              alt=""
              loading="lazy"
              decoding="async"
              className="trail-box-2-img"
            />
          </div>
          <div className="trail-box trail-box-3" data-box="3">
            <img
              src={executionGrid3Img}
              alt=""
              loading="lazy"
              decoding="async"
              className="trail-box-3-img"
            />
          </div>
          <div className="trail-box trail-box-4" data-box="4">
            {/* Background #003858 with Duotone Noise */}
            <div className="trail-box-4-bg" />
            <div className="trail-box-4-noise" aria-hidden="true" />

            {/* Dither Video: Threshold, Size 1, Levels 8, Brightness 100%, Contrast 1.4, Hard light blend */}
            <DitherVideo
              src={executionGrid4Video}
              style="threshold"
              size={1}
              levels={8}
              brightness={1}
              contrast={1.4}
              mono={false}
              mixBlendMode="hard-light"
              opacity={1}
              crop="center"
              cropShift={{ x: 0, y: 0 }}
              noise={true}
              rotation={0}
              className="trail-box-4-video"
            />

            {/* Bottom-Left Caption */}
            <p className="trail-box-4-caption">
              One continuous audit trail across the stack. connecting application, and network activity to make every action traceable, accountable, and explainable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
