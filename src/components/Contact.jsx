import { useState } from 'react';
import Footer from './Footer';
import './Contact.css';

function Contact({ email, socialLinks }) {
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && userName.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        setUserName('');
      }, 4000);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div className="contact-container">
          <div className="section-label">
            <span className="label-dot"></span>
            Contact Me
          </div>
          <h2 className="section-heading">
            Let's start a<br />
            <span className="heading-accent">conversation</span>
          </h2>

          <div className="contact-layout">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name-input" className="form-label">Full Name</label>
                <input 
                  type="text" 
                  id="name-input"
                  className="form-input" 
                  placeholder="Enter your name" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message-input" className="form-label">Message</label>
                <textarea 
                  id="message-input"
                  className="form-textarea" 
                  rows="5"
                  placeholder="Tell me about your project or offer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                />
                
                {/* Controlled Input: Live Character Count */}
                <div className="counter-container">
                  <span className={`char-counter ${message.length >= 450 ? 'limit-warning' : ''}`}>
                    Characters: {message.length} / 500
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn">
                Send Message
              </button>

              {isSubmitted && (
                <div className="submit-success-toast">
                  ✓ Thank you, {userName}! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer email={email} socialLinks={socialLinks} />
    </div>
  );
}

export default Contact;
