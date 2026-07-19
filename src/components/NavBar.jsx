import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Meet Nakarani</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/projects" className={`navbar-link ${location.pathname === '/projects' ? 'active' : ''}`}>
            Projects
          </Link>
          <Link to="/contact" className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
          
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
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
