import { useState } from 'react';
import Footer from './Footer';
import { eventBus, EVENT_TYPES } from '../services/eventBus';
import { processContactSubmission, validateContactSubmission } from '../services/contactService';
import { useReveal } from '../hooks/useReveal';
import './Contact.css';

function Contact({ email, socialLinks }) {
  const reveal = useReveal();
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const payload = {
      name: userName,
      email: userEmail,
      message,
    };

    const result = validateContactSubmission(payload);

    if (!result.valid) {
      setFeedback({ type: 'error', message: result.errors[0] });
      eventBus.emit(EVENT_TYPES.MESSAGE_PROCESSING_FAILED, {
        status: 'failed',
        description: 'Contact form validation failed before processing.',
        data: {
          errors: result.errors,
          payload: result.payload,
        },
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'info', message: 'Submitting your message to the simulated async queue…' });

    eventBus.emit(EVENT_TYPES.CONTACT_FORM_SUBMITTED, {
      status: 'received',
      description: 'Contact form submitted and accepted for asynchronous processing.',
      data: {
        ...result.payload,
      },
    });

    eventBus.emit(EVENT_TYPES.MESSAGE_PROCESSING_STARTED, {
      status: 'processing',
      description: 'Simulated message processing started.',
      data: {
        ...result.payload,
      },
    });

    try {
      await processContactSubmission(result.payload, { delay: 1800, shouldFail: simulateFailure });

      setFeedback({
        type: 'success',
        message: 'Your message was accepted by the simulated processing workflow. No real email was sent.',
      });

      eventBus.emit(EVENT_TYPES.MESSAGE_PROCESSING_COMPLETED, {
        status: 'success',
        description: 'Simulated contact processing completed successfully.',
        data: {
          ...result.payload,
        },
      });

      setMessage('');
      setUserName('');
      setUserEmail('');
    } catch (error) {
      const errorMessage = error.message || 'We could not process your message right now.';
      setFeedback({ type: 'error', message: errorMessage });

      eventBus.emit(EVENT_TYPES.MESSAGE_PROCESSING_FAILED, {
        status: 'failed',
        description: 'Simulated message processing failed.',
        data: {
          error: errorMessage,
          payload: result.payload,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div
          className="contact-container"
          ref={reveal.ref}
          data-reveal={reveal.isObserving ? 'ready' : undefined}
          data-revealed={reveal.isVisible ? 'true' : 'false'}
        >
          <div className="section-label">
            <span className="label-dot"></span>
            Contact / Say hello
          </div>
          <h2 className="contact-heading">LET'S TALK <span aria-hidden="true">:)</span></h2>

          <div className="contact-intro-panel">
            <span className="contact-panel-label">OPEN CHANNEL</span>
            <p>Have a question, an idea, or just want to connect? Send a note and I’ll get back to you.</p>
            <a href={`mailto:${email}`} className="contact-email-strip">{email}<span aria-hidden="true">↗</span></a>
          </div>

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
                  onChange={(event) => setUserName(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-input" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email-input"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  disabled={isSubmitting}
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
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={500}
                  disabled={isSubmitting}
                  required
                />

                <div className="counter-container">
                  <span className={`char-counter ${message.length >= 450 ? 'limit-warning' : ''}`}>
                    Characters: {message.length} / 500
                  </span>
                </div>
              </div>

              <label className="failure-toggle" htmlFor="simulate-failure">
                <input
                  id="simulate-failure"
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(event) => setSimulateFailure(event.target.checked)}
                  disabled={isSubmitting}
                />
                Simulate a processing failure for demonstration purposes
              </label>

              <button
                type="submit"
                className="btn btn-primary form-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing Message...' : 'Send Message'}
              </button>

              <p className="simulated-note">
                This form demonstrates an asynchronous event-driven workflow. It does not send a real email.
              </p>

              {feedback.message && (
                <div className={`submit-status ${feedback.type}`} role="status" aria-live="polite">
                  {feedback.message}
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
