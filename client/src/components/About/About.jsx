import React from 'react';
import userAvatar from '../../assets/icons/male-user.png';
import './About.css';

/**
 * About Component
 * Represents the Profile / About Me section of Prashant Singh's OS Portfolio.
 * Displays verified personal biography, education, technical interests, and contact details.
 */
function About() {
  return (
    <article className="about-section" aria-label="Profile and Bio">
      <div className="about-top-row">
        <div className="about-avatar-wrapper" aria-label="Profile Avatar">
          <img src={userAvatar} alt="Prashant Singh" className="about-avatar-img" />
        </div>
        <div className="about-intro">
          <p className="about-greeting">hi! i'm</p>
          <h2 className="about-name">Prashant Singh</h2>
          <div className="about-role">B.Tech in Computer Science and Engineering</div>
          <p className="about-quote">
            "Passionate about software development, responsive web engineering, and modern full-stack architectures."
          </p>
        </div>
      </div>

      <p className="about-bio">
        I am a Computer Science and Engineering student at JK Lakshmipat University, Jaipur, focused on software development. I specialize in building responsive web applications and full-stack solutions using JavaScript, React, Node.js, Express, and MongoDB, with a strong foundation in core programming and database systems.
      </p>

      {/* Verified Academic & Contact Highlights */}
      <div className="about-highlights-grid">
        <div className="about-highlight-card">
          <span className="highlight-label">Degree</span>
          <span className="highlight-value">B.Tech in CSE</span>
        </div>
        <div className="about-highlight-card">
          <span className="highlight-label">Institution</span>
          <span className="highlight-value">JK Lakshmipat University</span>
        </div>
        <div className="about-highlight-card">
          <span className="highlight-label">Duration</span>
          <span className="highlight-value">2024 — 2028</span>
        </div>
        <div className="about-highlight-card">
          <span className="highlight-label">Location</span>
          <span className="highlight-value">Jaipur, Rajasthan</span>
        </div>
        <div className="about-highlight-card">
          <span className="highlight-label">Email</span>
          <span className="highlight-value">
            <a href="mailto:prashanttsinghh205@gmail.com" className="about-contact-link">
              prashanttsinghh205@gmail.com
            </a>
          </span>
        </div>
        <div className="about-highlight-card">
          <span className="highlight-label">Phone</span>
          <span className="highlight-value">
            <a href="tel:+918302840321" className="about-contact-link">
              +91-8302840321
            </a>
          </span>
        </div>
      </div>

      {/* Core Technical Proficiencies Summary */}
      <div className="about-skills-overview">
        <h3 className="about-section-subhead">TECHNICAL FOCUS</h3>
        <div className="about-focus-tags">
          <span className="about-focus-tag">React.js & Next.js</span>
          <span className="about-focus-tag">Node.js & Express</span>
          <span className="about-focus-tag">JavaScript & TypeScript</span>
          <span className="about-focus-tag">Python & C</span>
          <span className="about-focus-tag">MongoDB & MySQL</span>
          <span className="about-focus-tag">Tailwind CSS</span>
          <span className="about-focus-tag">Git & GitHub</span>
          <span className="about-focus-tag">RESTful APIs</span>
        </div>
      </div>
    </article>
  );
}

export default About;
