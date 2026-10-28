import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar({ theme, toggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const isHome = location.pathname === '/';
  const items = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/#about', section: 'about' },
    { label: 'Skills', to: '/#skills', section: 'skills' },
    { label: 'Projects', to: '/#projects', section: 'projects' },
    { label: 'Process', to: '/#process', section: 'process' },
    { label: 'Contact', to: '/contact' },
    { label: 'Event Monitor', to: '/event-monitor' },
    { label: 'Task Manager', to: '/projects' },
  ];

  return (
    <nav className="navbar" id="main-nav" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">Meet Nakarani<span className="logo-period">.</span></span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div className={`navbar-menu ${menuOpen ? 'menu-open' : ''}`} id="navbar-menu">
          {items.map((item) => {
            const active = item.section
              ? isHome && location.hash === `#${item.section}`
              : item.to === '/'
                ? isHome && !location.hash
                : location.pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`navbar-link ${active ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}

          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle dark/light theme"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
