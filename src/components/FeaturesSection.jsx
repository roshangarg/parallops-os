import { useEffect, useRef } from 'react'
import './FeaturesSection.css'
import featureImg from '../assets/featureimg.webp'

const leftColumns = [
  { text: 'Built for businesses', type: 'built' },
  { text: 'Not just computers', type: 'computers' },
  { text: 'Built for businesses', type: 'built' },
  { text: 'Not just computers', type: 'computers' },
  { text: 'Built for businesses', type: 'built' },
  { text: 'Not just computers', type: 'computers' },
  { text: 'Built for businesses', type: 'built' },
  { text: 'Not just computers', type: 'computers' },
  { text: 'Built for businesses', type: 'built' },
]

const featureItems = [
  {
    title: 'THIN CORE KERNEL',
    description:
      'A PURPOSE BUILT CORE ENGINEERED TO ORCHESTRATE CPU, MEMORY, STORAGE, NETWORKING, AND LOW-LEVEL INTERRUPTS WHILE KEEPING THE FIRMWARE-BACKED DEVICE LIGHTWEIGHT AND EFFICIENT.',
  },
  {
    title: 'DEVICE ABSTRACTION',
    description:
      'BRIDGES THE APPLICATION LAYER AND DEVICE INTERFACE THROUGH A SIMPLE, CONSISTENT ABSTRACTION THAT MAKES HARDWARE CAPABILITIES EASY TO ACCESS WITHOUT EXPOSING UNDERLYING COMPLEXITY.',
  },
  {
    title: 'DETERMINISTIC SECURITY',
    description:
      'ONE SECURITY MODEL ACROSS EVERY LAYER: IDENTITY, PERMISSIONS, ENDPOINTS, NETWORKS, APPLICATIONS, AND CYBER DEFENSE OPERATE UNDER UNIFIED POLICIES, ELIMINATING FRAGMENTED CONTROLS.',
  },
  {
    title: 'INTELLIGENT TELEMETRY',
    description:
      'ONE INTELLIGENT VIEW ACROSS THE ENTIRE STACK, CORRELATE APPLICATION, CONTAINER, DRIVER, AND NETWORK, TRACE FAILURES TO THEIR ROOT CAUSE REDUCING DIAGNOSTIC TIME, UNNECESSARY HANDOFFS, AND TRIAL-AND-ERROR TROUBLESHOOTING.',
  },
]

export default function FeaturesSection() {
  const canvasRef = useRef(null)
  const rightColRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = rightColRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let animId
    let offset = 0
    let lastTime = performance.now()

    const phrases = [
      { text: 'BUILT FOR BUSINESSES', color: '#E0ECD9' },
      { text: 'NOT JUST COMPUTERS', color: '#E0ECD9' },
    ]

    let cachedFontSize = null
    let cachedCharData = null

    const updateCharData = (fontSize) => {
      ctx.font = `500 ${fontSize}px "Funnel Display", sans-serif`
      const data = phrases.map((item) => {
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
      const innerBox = container.querySelector('.features-inner-box')
      const stripThickness = innerBox ? innerBox.offsetTop : Math.min(56, Math.max(38, (window.innerWidth / 1920) * 56))
      const pad = stripThickness / 2
      const fontSize = Math.min(32, Math.max(18, (stripThickness / 56) * 32))

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

      // Target gap between phrases requested: 34px (scaled proportionally with fontSize / 32)
      const targetGap = 34 * (fontSize / 32)

      // Find the count of phrase repetitions N that best fills the perimeter with ~34px gap
      let bestN = 2
      let bestDiff = Infinity
      let bestGap = targetGap

      for (let n = 2; n <= 30; n++) {
        let totalTextWidth = 0
        for (let i = 0; i < n; i++) {
          totalTextWidth += cachedCharData[i % cachedCharData.length].totalWidth
        }
        const gapForN = (totalPerimeter - totalTextWidth) / n
        if (gapForN < 12) continue

        const diff = Math.abs(gapForN - targetGap)
        // Prefer even N for symmetric alternation if gap difference is within 3px
        const score = (n % 2 === 0) ? diff : diff + 3.0

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
    <section className="features-section">
      <div className="features-container">
        {/* Left Side: 751px x 1042px with 9 vertical text strips */}
        <div className="features-left-col">
          {/* Scanline grid overlay on left column */}
          <div className="features-left-grid" aria-hidden="true" />

          {/* 9 alternating vertical text columns */}
          <div className="features-v-track">
            {leftColumns.map((col, idx) => (
              <div key={idx} className={`features-v-col features-v-col-${col.type}`}>
                <span className={`features-v-text features-v-text-${col.type}`}>
                  {col.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: with #0B3414 background, perimeter tickers, and framed inner box */}
        <div className="features-right-col" ref={rightColRef}>
          {/* Floating graphic image overflowing into problem section above */}
          <img
            src={featureImg}
            alt=""
            className="features-graphic-img"
            aria-hidden="true"
          />

          {/* Continuous Perimeter Snake Ticker Canvas */}
          <canvas className="features-snake-canvas" ref={canvasRef} aria-hidden="true" />

          {/* Inner Content Box with border: 1px solid #E0ECD9 */}
          <div className="features-inner-box">
            {/* Scanlines strictly inside that box only */}
            <div className="features-inner-grid" aria-hidden="true" />

            {/* Duotone Noise Overlay strictly inside that box only */}
            <div className="features-inner-noise" aria-hidden="true" />

            {/* 4 Feature Items Stacked on the Left */}
            <div className="features-inner-content">
              {featureItems.map((item, idx) => (
                <div key={idx} className="features-item">
                  <h3 className="features-item-title">{item.title}</h3>
                  <p className="features-item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
