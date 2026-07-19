import { useState } from 'react';
import Header from './Header';
import About from './About';
import './Home.css';

function Home({ name, title }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="home-page">
      <Header name={name} title={title} />
      
      {/* Visibility Toggle Feature */}
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
            <div className="toggle-content">
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

      <About />
    </div>
  );
}

export default Home;
