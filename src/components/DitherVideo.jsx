import { useEffect, useRef } from 'react'
import './DitherVideo.css'

function hexToRgb(hex) {
  if (!hex) return [0.035, 0.0, 1.0] // fallback to #0900FF
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('')
  }
  const num = parseInt(cleaned.slice(0, 6), 16) || 0
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

const VS_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FS_SOURCE = `
precision mediump float;

varying vec2 v_uv;
uniform sampler2D u_video;
uniform vec2 u_resolution;
uniform vec2 u_videoResolution;
uniform vec2 u_cropShift;
uniform float u_size;
uniform float u_dpr;
uniform float u_levels;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_noiseAmount;
uniform int u_style;
uniform int u_mono;
uniform vec3 u_monoColor;
uniform int u_cropMode;
uniform float u_rotation;

// Interleaved Gradient Noise for random noise dither style
float ign(vec2 p) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(p, magic.xy)));
}

// 4x4 Bayer Matrix for ordered dither style
float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int idx = x + y * 4;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  vec2 norm = gl_FragCoord.xy / u_resolution;
  norm.y = 1.0 - norm.y; // top is 0.0, bottom is 1.0

  vec2 uv = norm;
  if (u_videoResolution.x > 0.0 && u_videoResolution.y > 0.0) {
    float cAspect = u_resolution.x / u_resolution.y;
    float vAspect = u_videoResolution.x / u_videoResolution.y;

    if (u_rotation == 90.0 || u_rotation == -90.0 || u_rotation == 270.0) {
      vAspect = u_videoResolution.y / u_videoResolution.x;
    }

    if (u_cropMode == 1) {
      // Centered scale-crop: perfectly centers the video in the container
      if (cAspect > vAspect) {
        float sY = vAspect / cAspect;
        uv.x = clamp(norm.x + u_cropShift.x, 0.0, 1.0);
        uv.y = clamp((norm.y - 0.5) * sY + 0.5 + u_cropShift.y, 0.0, 1.0);
      } else {
        float sX = cAspect / vAspect;
        uv.x = clamp((norm.x - 0.5) * sX + 0.5 + u_cropShift.x, 0.0, 1.0);
        uv.y = clamp(norm.y + u_cropShift.y, 0.0, 1.0);
      }
    } else {
      // Legacy Scale-crop: cut from left and bottom (anchor to top-right)
      if (cAspect > vAspect) {
        float sY = vAspect / cAspect;
        uv.y = clamp(norm.y * sY + u_cropShift.y, 0.0, 1.0);
        uv.x = clamp(u_cropShift.x + norm.x * (1.0 - u_cropShift.x), 0.0, 1.0);
      } else {
        float sX = cAspect / vAspect;
        uv.x = clamp(u_cropShift.x + norm.x * (1.0 - u_cropShift.x) * sX, 0.0, 1.0);
        uv.y = clamp(norm.y + u_cropShift.y, 0.0, 1.0);
      }
    }

    if (u_rotation == 90.0) {
      vec2 p = uv - vec2(0.5);
      uv = clamp(vec2(p.y, -p.x) + vec2(0.5), 0.0, 1.0);
    } else if (u_rotation == -90.0 || u_rotation == 270.0) {
      vec2 p = uv - vec2(0.5);
      uv = clamp(vec2(-p.y, p.x) + vec2(0.5), 0.0, 1.0);
    } else if (u_rotation == 180.0) {
      uv = clamp(vec2(1.0) - uv, 0.0, 1.0);
    }
  }

  vec4 sampleColor = texture2D(u_video, uv);
  vec3 rgb = sampleColor.rgb;

  // Monotone noise on video before dither (size 1, density 100%, color #00000057)
  if (u_noiseAmount > 0.0) {
    vec2 nCoord = floor(gl_FragCoord.xy / max(1.0, u_dpr));
    float n = fract(sin(dot(nCoord, vec2(12.9898, 78.233))) * 43758.5453);
    rgb = mix(rgb, vec3(0.0), n * u_noiseAmount);
  }

  // Brightness (100% = 1.0) & Contrast (1.0)
  rgb = (rgb - 0.5) * u_contrast + 0.5;
  rgb = rgb * u_brightness;
  rgb = clamp(rgb, 0.0, 1.0);

  float numLevels = max(2.0, u_levels);
  vec3 quant = vec3(0.0);

  if (u_style == 0) {
    // Style = Threshold: PURE threshold quantization (No Bayer matrix, no dither shift)
    if (u_mono == 1) {
      float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
      float quantLum = clamp(floor(lum * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
      quant = quantLum * u_monoColor;
    } else {
      quant = clamp(floor(rgb * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
    }
  } else if (u_style == 1) {
    // Style = Bayer / Ordered Dither
    vec2 ditherPos = floor(gl_FragCoord.xy / max(1.0, u_size));
    float ditherVal = bayer4(ditherPos);
    float spread = 1.0 / (numLevels - 1.0);
    if (u_mono == 1) {
      float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
      float shifted = lum + (ditherVal - 0.5) * spread;
      float quantLum = clamp(floor(shifted * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
      quant = quantLum * u_monoColor;
    } else {
      vec3 shifted = rgb + (ditherVal - 0.5) * spread;
      quant = clamp(floor(shifted * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
    }
  } else {
    // Style = Noise Dither
    vec2 ditherPos = floor(gl_FragCoord.xy / max(1.0, u_size));
    float ditherVal = ign(ditherPos);
    float spread = 1.0 / (numLevels - 1.0);
    if (u_mono == 1) {
      float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
      float shifted = lum + (ditherVal - 0.5) * spread;
      float quantLum = clamp(floor(shifted * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
      quant = quantLum * u_monoColor;
    } else {
      vec3 shifted = rgb + (ditherVal - 0.5) * spread;
      quant = clamp(floor(shifted * (numLevels - 1.0) + 0.5) / (numLevels - 1.0), 0.0, 1.0);
    }
  }

  gl_FragColor = vec4(quant, sampleColor.a);
}
`

export default function DitherVideo({
  src,
  style = 'threshold',
  size = 1,
  levels = 2,
  brightness = 1,
  contrast = 1,
  mono = false,
  monoColor = '#0900FF',
  mixBlendMode = 'color-dodge',
  opacity = 1,
  cropShift = { x: 0.12, y: 0.0 },
  crop = 'cover',
  noise = true,
  className = '',
  rotation = 0,
  dither,
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Resolve config from props or dither object
  const activeStyle = dither?.style ?? style
  const activeSize = dither?.size ?? size
  const activeLevels = dither?.levels ?? levels
  const activeBrightness = dither?.brightness
    ? (typeof dither.brightness === 'number' && dither.brightness > 5 ? dither.brightness / 100 : dither.brightness)
    : (brightness > 5 ? brightness / 100 : brightness)
  const activeContrast = dither?.contrast ?? contrast
  const activeMono = dither?.mono ?? mono
  const activeMonoColor = dither?.monoColor ?? monoColor
  const activeCropShift = dither?.cropShift ?? cropShift
  const activeCrop = dither?.crop ?? crop
  const activeRotation = dither?.rotation ?? rotation

  const activeNoise = dither?.noise ?? noise
  const activeNoiseAmount = activeNoise
    ? (typeof activeNoise === 'object' && activeNoise.color === '#00000057'
      ? 0.341
      : (typeof activeNoise === 'number' ? activeNoise : 0.341))
    : 0.0

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!video || !canvas || !container) return

    let animId

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, preserveDrawingBuffer: false })
    if (!gl) return

    function createShader(gl, type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    gl.useProgram(program)

    // Full-screen quad buffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    )

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const uVideo = gl.getUniformLocation(program, 'u_video')
    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uVideoResolution = gl.getUniformLocation(program, 'u_videoResolution')
    const uCropShift = gl.getUniformLocation(program, 'u_cropShift')
    const uCropMode = gl.getUniformLocation(program, 'u_cropMode')
    const uSize = gl.getUniformLocation(program, 'u_size')
    const uDpr = gl.getUniformLocation(program, 'u_dpr')
    const uLevels = gl.getUniformLocation(program, 'u_levels')
    const uBrightness = gl.getUniformLocation(program, 'u_brightness')
    const uContrast = gl.getUniformLocation(program, 'u_contrast')
    const uNoiseAmount = gl.getUniformLocation(program, 'u_noiseAmount')
    const uStyle = gl.getUniformLocation(program, 'u_style')
    const uMono = gl.getUniformLocation(program, 'u_mono')
    const uMonoColor = gl.getUniformLocation(program, 'u_monoColor')
    const uRotation = gl.getUniformLocation(program, 'u_rotation')

    // Create texture for video
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // Video lazy playback management via IntersectionObserver
    video.muted = true
    video.playsInline = true
    video.loop = true

    const rgbMono = hexToRgb(activeMonoColor)
    let styleCode = 0
    const s = (activeStyle || '').toLowerCase()
    if (s === 'ordered' || s.startsWith('bayer')) {
      styleCode = 1
    } else if (s === 'noise' || s === 'random') {
      styleCode = 2
    } else {
      styleCode = 0 // 'threshold'
    }

    let isVisible = false
    let hasLoadedSrc = false

    const render = () => {
      if (!isVisible) return

      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const targetW = Math.round(rect.width * dpr)
      const targetH = Math.round(rect.height * dpr)

      if (targetW > 0 && targetH > 0) {
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW
          canvas.height = targetH
          gl.viewport(0, 0, targetW, targetH)
        }
      }

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
      }

      gl.useProgram(program)
      gl.uniform1i(uVideo, 0)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform2f(uVideoResolution, video.videoWidth || canvas.width, video.videoHeight || canvas.height)
      gl.uniform2f(uCropShift, activeCropShift?.x ?? 0.18, activeCropShift?.y ?? 0.0)
      gl.uniform1i(uCropMode, activeCrop === 'center' ? 1 : 0)
      gl.uniform1f(uSize, Math.max(1.0, Number(activeSize) * dpr))
      gl.uniform1f(uDpr, dpr)
      gl.uniform1f(uLevels, Number(activeLevels))
      gl.uniform1f(uBrightness, Number(activeBrightness))
      gl.uniform1f(uContrast, Number(activeContrast))
      gl.uniform1f(uNoiseAmount, activeNoiseAmount)
      gl.uniform1i(uStyle, styleCode)
      gl.uniform1i(uMono, activeMono ? 1 : 0)
      gl.uniform3f(uMonoColor, rgbMono[0], rgbMono[1], rgbMono[2])
      gl.uniform1f(uRotation, Number(activeRotation || 0))

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animId = requestAnimationFrame(render)
    }

    const startPlaying = () => {
      isVisible = true
      if (!hasLoadedSrc) {
        hasLoadedSrc = true
        if (!video.src && src) {
          video.src = src
          video.load()
        }
      }
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => { })
      }
      if (!animId) {
        animId = requestAnimationFrame(render)
      }
    }

    const stopPlaying = () => {
      isVisible = false
      video.pause()
      if (animId) {
        cancelAnimationFrame(animId)
        animId = null
      }
    }

    let observer = null
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            startPlaying()
          } else {
            stopPlaying()
          }
        },
        { rootMargin: '250px 0px' }
      )
      observer.observe(container)
    } else {
      startPlaying()
    }

    return () => {
      if (observer) observer.disconnect()
      if (animId) cancelAnimationFrame(animId)
      video.pause()
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteTexture(texture)
      gl.deleteBuffer(positionBuffer)
    }
  }, [
    src,
    activeStyle,
    activeSize,
    activeLevels,
    activeBrightness,
    activeContrast,
    activeMono,
    activeMonoColor,
    activeCropShift,
    activeCrop,
    activeNoiseAmount,
    activeRotation,
  ])

  return (
    <div
      ref={containerRef}
      className={`dither-video-wrap ${className}`}
      style={{
        mixBlendMode,
        opacity,
      }}
    >
      <video
        ref={videoRef}
        preload="none"
        className="dither-video-media"
        muted
        loop
        playsInline
      />
      <canvas ref={canvasRef} className="dither-video-canvas" />
      {noise && <div className="dither-video-noise" aria-hidden="true" />}
    </div>
  )
}
