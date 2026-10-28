import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import About from './About';
import Skills from './Skills';
import PortfolioProjects from './PortfolioProjects';
import Process from './Process';
import './Home.css';

function Home({ name, title, skills }) {
  const [showTip, setShowTip] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const targetId = decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [location.hash]);

  return (
    <div className="home-page">
      <Header name={name} title={title} />
      <About />
      <Skills skills={skills} />
      <PortfolioProjects />
      <Process />

      <div className="toggle-section-container">
        <div className="toggle-card">
          <button 
            className="toggle-header-btn" 
            onClick={() => setShowTip(!showTip)}
            aria-expanded={showTip}
          >
            <span>💡 Quick Academic Tip of the Day</span>
            <span className={`toggle-icon ${showTip ? 'open' : ''}`}>▼</span>
          </button>
          
          {showTip && (
            <div className="toggle-content" id="academic-tip">
              <p>
                As a Computer Science student, the best way to master development is 
                to build real projects. Don't just read code—write it, break it, 
                and debug it! Focus on solidifying your data structures, Git usage, 
                and clean component architectures early on.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
