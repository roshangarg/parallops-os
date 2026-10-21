import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Footer.css'
import footerSvg from '../assets/footer.svg'

export default function Footer() {
  const [toastMessage, setToastMessage] = useState(null)
  const currentYear = new Date(Date.now()).getFullYear()

  const copyToClipboardFallback = (text) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch (err) {
      console.warn('Fallback copy error:', err)
    }
  }

  const handleCopyEmail = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const email = 'system@parallops.com'

    // Show toast immediately
    setToastMessage('Email copied to clipboard')

    // Perform copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {
        copyToClipboardFallback(email)
      })
    } else {
      copyToClipboardFallback(email)
    }
  }

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => {
      setToastMessage(null)
    }, 2800)
    return () => clearTimeout(timer)
  }, [toastMessage])

  return (
    <div className="footer-reveal-container">
      {/* Toast Notification rendered via React Portal directly into body */}
      {toastMessage && typeof document !== 'undefined' && createPortal(
        <div className="footer-toast" role="status" aria-live="polite">
          <svg
            className="footer-toast-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" stroke="#CEFF2C" strokeWidth="1.5" />
            <path
              d="M5 8.2L7 10.2L11 6"
              stroke="#CEFF2C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="footer-toast-text">{toastMessage}</span>
        </div>,
        document.body
      )}

      {/* Fixed bottom footer revealed as curtain */}
      <footer className="footer-fixed" aria-label="Footer">
        {/* Duotone Noise Overlay (size 1, density 54%, #000000 & #E0ECD940) */}
        <div className="footer-noise" aria-hidden="true" />

        {/* Top Header Bar */}
        <div className="footer-top-bar">
          {/* Left: A THREADALITY Division Link */}
          <a
            href="https://threadality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-left-link"
            aria-label="A THREADALITY Division"
          >
            <div className="footer-link-line-1">
              <span className="footer-text-light">A</span>
              <span className="footer-text-bold">THREADALITY</span>
            </div>
            <div className="footer-link-line-2 footer-text-light">
              Division
            </div>
          </a>

          {/* Center: system@parallops.com (Click to copy) */}
          <button
            type="button"
            className="footer-email-btn"
            onClick={handleCopyEmail}
            title="Click to copy email address"
            aria-label="Copy system@parallops.com to clipboard"
          >
            system@parallops.com
          </button>

          {/* Right: A MORPHINE STUDIO Creation Link */}
          <a
            href="https://morphline.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-right-link"
            aria-label="A MORPHINE STUDIO Creation"
          >
            <div className="footer-link-line-1">
              <span className="footer-text-light">A</span>
              <span className="footer-text-bold">MORPHINE STUDIO</span>
            </div>
            <div className="footer-link-line-2 footer-text-light">
              Creation
            </div>
          </a>
        </div>

        {/* Copyright notice at top: 398.43px; right: 32px */}
        <div className="footer-copyright" aria-label={`Copyright ${currentYear}`}>
          &copy; {currentYear}
        </div>

        {/* Bottom Graphic: Large artistic Parallops OS graphic */}
        <img
          src={footerSvg}
          alt="Parallops OS"
          loading="lazy"
          decoding="async"
          className="footer-graphic"
        />
      </footer>
    </div>
  )
}
