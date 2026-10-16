import { useEffect, useRef } from 'react'
import './LifecycleSection.css'
import DitherVideo from './DitherVideo'
import lifecycleVideo from '../assets/lifecycleVideo.webm'
import lifecycleImg from '../assets/lifecycleimg.webp'

const PHRASES = [
  { text: 'STAY SECURE', color: '#E0ECD9' },
  { text: 'STAY SUPPORTED', color: '#E0ECD9' },
  { text: 'STAY CURRENT', color: '#E0ECD9' },
]

export default function LifecycleSection() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let animId
    let offset = 0
    let lastTime = performance.now()

    let cachedFontSize = null
    let cachedCharData = null

    const updateCharData = (fontSize) => {
      ctx.font = `500 ${fontSize}px "Funnel Display", sans-serif`
      const data = PHRASES.map((item) => {
        const chars = []
        let totalWidth = 0
        for (const ch of item.text) {
          const w = ctx.measureText(ch).width
          chars.push({ ch, width: w })
          totalWidth += w
        }
        return {
          color: item.color,
          chars,
          totalWidth,
        }
      })
      cachedCharData = data
      cachedFontSize = fontSize
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        cachedFontSize = null
      })
    }

    const render = (now) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000)
      lastTime = now

      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const width = rect.width
      const height = rect.height

      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(render)
        return
      }

      // Sync canvas pixel resolution with device pixel ratio
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }

      // Calculate border strip thickness directly matching inner box inset
      const innerBox = container.querySelector('.lifecycle-inner-box')
      const stripThickness = (innerBox && innerBox.offsetTop > 0)
        ? innerBox.offsetTop
        : Math.min(46, Math.max(28, (window.innerWidth / 1920) * 46))
      const pad = stripThickness / 2
      const fontSize = Math.min(32, Math.max(18, (stripThickness / 46) * 32))

      const L_w = width - 2 * stripThickness
      const L_h = height - 2 * stripThickness

      if (L_w <= 0 || L_h <= 0) {
        animId = requestAnimationFrame(render)
        return
      }

      const arcLen = (Math.PI / 2) * pad
      const totalPerimeter = 2 * L_w + 2 * L_h + 4 * arcLen

      // Parametric segment offsets along perimeter
      const s0 = 0
      const s1 = s0 + L_w
      const s2 = s1 + arcLen
      const s3 = s2 + L_h
      const s4 = s3 + arcLen
      const s5 = s4 + L_w
      const s6 = s5 + arcLen
      const s7 = s6 + L_h
      const s8 = s7 + arcLen // totalPerimeter

      const getPathPoint = (s) => {
        let norm = ((s % totalPerimeter) + totalPerimeter) % totalPerimeter
        if (norm < s1) {
          // 1. Top straight: moving Left -> Right (heading 0)
          return {
            x: stripThickness + (norm - s0),
            y: pad,
            angle: 0,
          }
        } else if (norm < s2) {
          // 2. Top-Right corner curve: turning smoothly from 0 -> PI/2
          const progress = (norm - s1) / arcLen
          const theta = -Math.PI / 2 + progress * (Math.PI / 2)
          return {
            x: width - stripThickness + pad * Math.cos(theta),
            y: stripThickness + pad * Math.sin(theta),
            angle: theta + Math.PI / 2,
          }
        } else if (norm < s3) {
          // 3. Right straight: moving Top -> Bottom (heading PI/2)
          return {
            x: width - pad,
            y: stripThickness + (norm - s2),
            angle: Math.PI / 2,
          }
        } else if (norm < s4) {
          // 4. Bottom-Right corner curve: turning smoothly from PI/2 -> PI
          const progress = (norm - s3) / arcLen
          const theta = progress * (Math.PI / 2)
          return {
            x: width - stripThickness + pad * Math.cos(theta),
            y: height - stripThickness + pad * Math.sin(theta),
            angle: theta + Math.PI / 2,
          }
        } else if (norm < s5) {
          // 5. Bottom straight: moving Right -> Left (heading PI)
          return {
            x: width - stripThickness - (norm - s4),
            y: height - pad,
            angle: Math.PI,
          }
        } else if (norm < s6) {
          // 6. Bottom-Left corner curve: turning smoothly from PI -> 3*PI/2
          const progress = (norm - s5) / arcLen
          const theta = Math.PI / 2 + progress * (Math.PI / 2)
          return {
            x: stripThickness + pad * Math.cos(theta),
            y: height - stripThickness + pad * Math.sin(theta),
            angle: theta + Math.PI / 2,
          }
        } else if (norm < s7) {
          // 7. Left straight: moving Bottom -> Top (heading 3*PI/2)
          return {
            x: pad,
            y: height - stripThickness - (norm - s6),
            angle: (3 * Math.PI) / 2,
          }
        } else {
          // 8. Top-Left corner curve: turning smoothly from 3*PI/2 -> 2*PI (0)
          const progress = (norm - s7) / arcLen
          const theta = Math.PI + progress * (Math.PI / 2)
          return {
            x: stripThickness + pad * Math.cos(theta),
            y: stripThickness + pad * Math.sin(theta),
            angle: theta + Math.PI / 2,
          }
        }
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      // Clip strictly to border strip channel so inner box stays clean
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, width, height)
      ctx.rect(stripThickness, stripThickness, width - 2 * stripThickness, height - 2 * stripThickness)
      ctx.clip('evenodd')

      if (cachedFontSize !== fontSize || !cachedCharData) {
        updateCharData(fontSize)
      }

      ctx.font = `500 ${fontSize}px "Funnel Display", sans-serif`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      // Target gap between phrases: 34px (scaled proportionally with fontSize / 32)
      const targetGap = 34 * (fontSize / 32)

      // Find the count of phrase repetitions N that best fills the perimeter with ~34px gap
      let bestN = 3
      let bestDiff = Infinity
      let bestGap = targetGap

      for (let n = 3; n <= 45; n++) {
        let totalTextWidth = 0
        for (let i = 0; i < n; i++) {
          totalTextWidth += cachedCharData[i % cachedCharData.length].totalWidth
        }
        const gapForN = (totalPerimeter - totalTextWidth) / n
        if (gapForN < 8) continue

        const diff = Math.abs(gapForN - targetGap)
        // Prefer multiples of 3 for symmetric 3-phrase cycling
        const score = (n % 3 === 0) ? diff : diff + 4.0

        if (score < bestDiff) {
          bestDiff = score
          bestN = n
          bestGap = gapForN
        }
      }

      // Precompute cumulative starting offsets along perimeter to ensure exact seamless looping
      const itemOffsets = []
      let accS = 0
      for (let i = 0; i < bestN; i++) {
        itemOffsets.push(accS)
        const item = cachedCharData[i % cachedCharData.length]
        accS += item.totalWidth + bestGap
      }

      // Advance snake forward along perimeter (speed in px/s)
      const speed = 75
      offset = (offset + speed * dt) % totalPerimeter

      for (let i = 0; i < bestN; i++) {
        const item = cachedCharData[i % cachedCharData.length]
        let curS = offset + itemOffsets[i]
        ctx.fillStyle = item.color

        for (let cIdx = 0; cIdx < item.chars.length; cIdx++) {
          const c = item.chars[cIdx]
          const charCenterS = curS + c.width / 2

          if (c.ch !== ' ') {
            const pt = getPathPoint(charCenterS)
            ctx.save()
            ctx.translate(pt.x, pt.y)
            ctx.rotate(pt.angle)
            ctx.fillText(c.ch, 0, 0)
            ctx.restore()
          }

          curS += c.width
        }
      }

      ctx.restore() // restore clip
      ctx.restore() // restore scale

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section className="lifecycle-section">
      <div className="lifecycle-container" ref={containerRef}>
        {/* Slanted Watermark Text Overlay: "A LIFECYCLE WITHOUT THE SURPRISES" (below video) */}
        <div className="lifecycle-slanted-wrapper" aria-hidden="true">
          <div className="lifecycle-slanted-content">
            {Array.from({ length: 38 }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="lifecycle-slanted-row"
                style={{
                  transform: `translateX(${((rIdx * -145) % 697)}px)`,
                }}
              >
                {Array.from({ length: 7 }).map((_, cIdx) => (
                  <span key={cIdx} className="lifecycle-slanted-text">
                    A LIFECYCLE WITHOUT THE SURPRISES
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dither Video: 1920x1080 at top: -89.5px, Hard Light blend mode */}
        <DitherVideo
          src={lifecycleVideo}
          className="lifecycle-video"
          style="threshold"
          crop="center"
          size={1}
          levels={8}
          brightness={100}
          contrast={2}
          mono={false}
          monoColor="#0900FF"
          mixBlendMode="hard-light"
          opacity={1}
          cropShift={{ x: 0.0, y: 0.0 }}
          noise={{
            size: 1,
            density: 100,
            color: '#00000057',
          }}
        />

        {/* Outer 46px Border Channel with background #1D3E0B */}
        <div className="lifecycle-border-frame" aria-hidden="true">
          <div className="lifecycle-border-strip-top" />
          <div className="lifecycle-border-strip-bottom" />
          <div className="lifecycle-border-strip-left" />
          <div className="lifecycle-border-strip-right" />
        </div>

        {/* Framed Inner Box with border: 1px solid #E0ECD9 (1828px x 808px) */}
        <div className="lifecycle-inner-box" aria-hidden="true" />

        {/* Continuous Snake Perimeter Ticker Canvas */}
        <canvas className="lifecycle-snake-canvas" ref={canvasRef} aria-hidden="true" />

        {/* Foreground Flowers Image: 1920x754 at top 146.19px */}
        <img
          src={lifecycleImg}
          alt=""
          className="lifecycle-fg-img"
          aria-hidden="true"
        />

        {/* Horizontal scanlines grid overlay */}
        <div className="lifecycle-grid" aria-hidden="true" />
      </div>
    </section>
  )
}
