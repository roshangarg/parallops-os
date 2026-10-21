import './ProblemSection.css'
import problemSectionImg from '../assets/problemsectionimg.webp'

export default function ProblemSection() {
  return (
    <section className="problem-section">
      {/* Background layer behind overflowing hero imagery */}
      <div className="problem-bg-layer" aria-hidden="true" />

      {/* Duotone noise texture overlay (Size 2, Density 54%) */}
      <div className="problem-noise-overlay" aria-hidden="true" />

      {/* Horizontal scanlines overlay */}
      <div className="problem-grid-lines" aria-hidden="true" />

      <div className="problem-content">
        <header className="problem-top-header">
          <h2 className="problem-line problem-line-1">Hardware driver complexity</h2>
          <h2 className="problem-line problem-line-2">Security &amp; access fragment</h2>
          <h2 className="problem-line problem-line-3">Stranded trouble shooting</h2>
          <h2 className="problem-line problem-line-4">One size fits all os</h2>
        </header>

        <div className="problem-sub-row">
          <p className="problem-sub-col problem-sub-left">
            Traditional operating systems are designed for general purpose computing and not for specific demands of modern businesses and industries.
          </p>
          <p className="problem-sub-col problem-sub-center">
            --- This disconnect ---
          </p>
          <p className="problem-sub-col problem-sub-right">
            forces applications to consume resources beyond what they actually need, while leaving critical gaps in policy enforcement, access management, compliance, and privacy.
          </p>
        </div>

        {/* Feature Banner Section with Image and Justified Center Text */}
        <div className="problem-banner-wrap">
          <img
            src={problemSectionImg}
            alt=""
            loading="lazy"
            decoding="async"
            className="problem-banner-img"
          />
          <div className="problem-banner-text-wrap">
            <p className="problem-banner-text">
              Businesses need an operating environment designed around their applications, their policies, and their industry not the other way around.
            </p>
          </div>
        </div>

        {/* Bottom Feature Header: 4 Massive Cream-Colored Lines */}
        <div className="problem-bottom-header">
          <h2 className="problem-bottom-line problem-bottom-line-1">Hardware Abstract</h2>
          <h2 className="problem-bottom-line problem-bottom-line-2">Policy &amp; security fabric</h2>
          <h2 className="problem-bottom-line problem-bottom-line-3">Observability &amp; telemetry</h2>
          <h2 className="problem-bottom-line problem-bottom-line-4">Industry profiled</h2>
        </div>
      </div>

      {/* Bottom bar with duotone noise (same as hero bottom bar) */}
      <div className="problem-bottom-bar" aria-hidden="true" />
    </section>
  )
}
