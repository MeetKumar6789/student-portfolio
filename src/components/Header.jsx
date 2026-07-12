import './Header.css';

function Header({ name, title }) {
  return (
    <header className="header" id="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Portfolio</span>
        </div>
        <nav className="header-nav" id="main-nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#footer" className="nav-link">Contact</a>
        </nav>
      </div>
      <div className="hero-section" id="hero">
        <div className="hero-badge">👋 Welcome to my portfolio</div>
        <h1 className="hero-name">{name}</h1>
        <p className="hero-title">{title}</p>
        <div className="hero-cta">
          <a href="#about" className="btn btn-primary">Learn More</a>
          <a href="#footer" className="btn btn-outline">Get in Touch</a>
        </div>
        <div className="hero-glow"></div>
      </div>
    </header>
  );
}

export default Header;
