import { Link } from 'react-router-dom';
import './Header.css';

function Header({ name, title }) {
  const handleScrollToAbout = (e) => {
    e.preventDefault();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header" id="header">
      <div className="hero-section" id="hero">
        <div className="hero-badge">👋 Welcome to my portfolio</div>
        <h1 className="hero-name">{name}</h1>
        <p className="hero-title">{title}</p>
        <div className="hero-cta">
          <a href="#about" onClick={handleScrollToAbout} className="btn btn-primary">Learn More</a>
          <Link to="/contact" className="btn btn-outline">Get in Touch</Link>
        </div>
        <div className="hero-glow"></div>
      </div>
    </header>
  );
}

export default Header;
