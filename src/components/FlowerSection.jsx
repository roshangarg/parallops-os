import React from 'react'
import './FlowerSection.css'

import flowerLandRImg from '../assets/flowerLandRimg.png'
import smallImg from '../assets/smallimg.png'
import mediumImg from '../assets/mediumimg.png'
import largeImg from '../assets/largeimg.png'
import flowerSmallText from '../assets/flowerSmallText.svg'
import flowerMediumText from '../assets/flowerMediumText.svg'
import flowerLargeText from '../assets/flowerLargeText.svg'

export default function FlowerSection() {
  return (
    <section className="flower-section" aria-label="Flower Section">
      <div className="flower-container">
        {/* Left Flower (224px x 224px, static) */}
        <div className="flower-side-wrapper flower-side-left">
          <img
            src={flowerLandRImg}
            alt="Left blue flower"
            className="flower-side-img"
          />
        </div>

        {/* Center Concentric Flowers & Rotating Text Box (322.98px x 322.98px) */}
        <div className="flower-center-box">
          {/* 1. Large Text Ring (below large flower, clockwise rotation) */}
          <div className="flower-layer flower-text-large-wrap">
            <img
              src={flowerLargeText}
              alt="Adaptive Fabric Plane OS text ring"
              className="flower-text-svg flower-text-large"
            />
          </div>

          {/* 2. Large Flower (Blue, on top of large text, static) */}
          <img
            src={largeImg}
            alt=""
            className="flower-layer flower-img-large"
          />

          {/* 3. Medium Text Ring (below medium flower, anticlockwise rotation) */}
          <div className="flower-layer flower-text-medium-wrap">
            <img
              src={flowerMediumText}
              alt="Accelerators OS Core text ring"
              className="flower-text-svg flower-text-medium"
            />
          </div>

          {/* 4. Medium Flower (Brown, on top of medium text, static) */}
          <img
            src={mediumImg}
            alt=""
            className="flower-layer flower-img-medium"
          />

          {/* 5. Small Text Ring (below small flower, clockwise rotation) */}
          <div className="flower-layer flower-text-small-wrap">
            <img
              src={flowerSmallText}
              alt="Thin Kernel OS text ring"
              className="flower-text-svg flower-text-small"
            />
          </div>

          {/* 6. Small Flower (Red hibiscus, on top of small text, static) */}
          <img
            src={smallImg}
            alt=""
            className="flower-layer flower-img-small"
          />
        </div>

        {/* Right Flower (224px x 224px, static) */}
        <div className="flower-side-wrapper flower-side-right">
          <img
            src={flowerLandRImg}
            alt="Right blue flower"
            className="flower-side-img"
          />
        </div>
      </div>
    </section>
  )
}
