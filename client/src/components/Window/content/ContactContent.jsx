import React, { useState } from 'react';
import '../WindowContent.css';

/**
 * Contact Window Content
 * Displays contact info and a retro placeholder contact form.
 */
function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <article className="window-contact">
      <h2 className="contact-title">GET IN TOUCH</h2>
      
      <div className="contact-info-strip">
        <div className="contact-info-item">
          <strong>Email:</strong> prashant.portfolio@example.com
        </div>
        <div className="contact-info-item">
          <strong>Location:</strong> Delhi, India
        </div>
        <div className="contact-info-item">
          <strong>Status:</strong> Open to opportunities
        </div>
      </div>

      {submitted ? (
        <div className="profile-bio" style={{ borderLeftColor: '#696c53' }}>
          Thank you for reaching out! Your message was received in demo mode. The backend endpoint (POST /api/contact) will be linked in the upcoming integration phase.
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              type="text"
              className="form-input"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              className="form-input"
              placeholder="e.g. jane@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              className="form-textarea"
              placeholder="Type your message here..."
              rows={3}
              required
            />
          </div>

          <button type="submit" className="retro-submit-btn">
            Send Message &rarr;
          </button>
        </form>
      )}
    </article>
  );
}

export default ContactContent;
