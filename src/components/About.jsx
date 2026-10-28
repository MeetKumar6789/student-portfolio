import { useReveal } from '../hooks/useReveal';
import './About.css';

function About() {
  const reveal = useReveal();

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="section-label">
          <span className="label-dot"></span>
          A little about me
        </div>
        <div
          className="about-content"
          ref={reveal.ref}
          data-reveal={reveal.isObserving ? 'ready' : undefined}
          data-revealed={reveal.isVisible ? 'true' : 'false'}
        >
          <div className="about-title-column">
            <p className="about-index">01 / PROFILE</p>
            <h2 className="section-heading">ABOUT<br /><span className="heading-accent">ME.</span></h2>
            <div className="about-visual" aria-hidden="true">
              <span className="about-visual-grid" />
              <span className="about-visual-monogram">MN</span>
              <span className="about-visual-caption">Curious by default.</span>
            </div>
          </div>
          <div className="about-text">
            <p>
              I’m Meet Nakarani, a Computer Science student interested in how thoughtful design and reliable engineering can work together.
            </p>
            <p>
              My work and learning span full-stack web development, backend systems, databases, and data science. I enjoy turning a clear problem into a practical product, then improving it through testing and iteration.
            </p>
            <div className="about-facts">
              <span>Computer Science student</span>
              <span>Full-stack development</span>
              <span>Data science</span>
              <span>Continuous learning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
