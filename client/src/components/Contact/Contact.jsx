import React, { useState } from 'react';
import './Contact.css';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleanBase = rawApiUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

/**
 * Contact Component
 * Represents the Contact section of Prashant Singh's Portfolio.
 * Connects directly to the Express + MongoDB backend (POST /api/contact).
 */
function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Server returned status ${response.status}`);
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage(
        err.message || 'Failed to send message. Please ensure the backend server is reachable.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <article className="contact-section" aria-label="Contact Section">
      <h2 className="contact-section-title">GET IN TOUCH</h2>

      {/* Quick Contact Information Pills */}
      <div className="contact-info-cards-strip">
        <div className="contact-info-pill">
          <span className="contact-pill-label">Email:</span>
          <a href="mailto:prashanttsinghh205@gmail.com" className="contact-pill-value">
            prashanttsinghh205@gmail.com
          </a>
        </div>
        <div className="contact-info-pill">
          <span className="contact-pill-label">Location:</span>
          <span className="contact-pill-value">Jaipur, Rajasthan</span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="contact-success-notice">
          <strong>Thank you for reaching out!</strong>
          <p style={{ margin: '6px 0 12px' }}>
            Your message has been received. I will review it and get in touch with you shortly.
          </p>
          <button
            type="button"
            className="contact-submit-button contact-send-another-btn"
            onClick={handleReset}
          >
            &larr; Send Another Message
          </button>
        </div>
      ) : (
        <form className="contact-form-container" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="contact-error-banner" role="alert">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="contact-field-group">
            <label className="contact-field-label" htmlFor="contact-form-name">
              Your Name
            </label>
            <input
              id="contact-form-name"
              type="text"
              className="contact-field-input"

              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="contact-field-group">
            <label className="contact-field-label" htmlFor="contact-form-email">
              Email Address
            </label>
            <input
              id="contact-form-email"
              type="email"
              className="contact-field-input"
            
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="contact-field-group">
            <label className="contact-field-label" htmlFor="contact-form-message">
              Message
            </label>
            <textarea
              id="contact-form-message"
              className="contact-field-textarea"
            
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="contact-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Send Message \u2192'}
          </button>
        </form>
      )}
    </article>
  );
}

export default Contact;
