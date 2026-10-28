import { Link } from 'react-router-dom';
import './Header.css';

function Header({ name, title }) {
  return (
    <header className="header" id="header">
      <div className="hero-section" id="hero">
        <div className="hero-copy">
          <div className="hero-badge"><span className="hero-status-dot" /> Computer Science student</div>
          <p className="hero-name">{name}</p>
          <h1 className="hero-title">BUILDING DIGITAL<br /><span>EXPERIENCES</span><br />THROUGH CODE.</h1>
          <p className="hero-description">
            {title}, exploring full-stack development, data science, and the ideas that make useful software feel thoughtful.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">Explore my work <span aria-hidden="true">↘</span></a>
            <Link to="/contact" className="btn btn-outline">Get in touch <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-tech-line">
            <span>FOCUS AREAS</span>
            <span>WEB DEVELOPMENT</span>
            <span>DATA SCIENCE</span>
            <span>BACKEND SYSTEMS</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-art-orbit hero-art-orbit-one" />
          <span className="hero-art-orbit hero-art-orbit-two" />
          <div className="hero-art-frame">
            <span className="hero-art-label">DESIGN / DEVELOP / LEARN</span>
            <span className="hero-art-mark">&lt; M /&gt;</span>
            <span className="hero-art-index">REACT / NODE<br />DATA / SYSTEMS</span>
          </div>
          <span className="hero-art-accent" />
        </div>
        <a className="hero-scroll" href="#about">Scroll to explore <span aria-hidden="true">↓</span></a>
      </div>
    </header>
  );
}

export default Header;
