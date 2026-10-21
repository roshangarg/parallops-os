import logo from '../assets/logo.svg'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="logo-link" aria-label="Parallops OS">
        <img src={logo} alt="Parallops" className="header-logo" loading="lazy" decoding="async" />
      </a>
    </header>
  )
}
