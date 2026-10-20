import React, { useState } from 'react';
import Skills from '../../Skills/Skills';
import Timeline from '../../Timeline/Timeline';
import Certifications from '../../Certifications/Certifications';
import { downloadResume, getResumeViewUrl } from '../../../services/resumeService';
import '../WindowContent.css';

/**
 * ResumeContent Component
 * Assembles verified resume sections: Summary, Education, Skills, Project Highlights,
 * Certifications, Languages, and functional PDF & DOCX download buttons backed by Express API.
 */
function ResumeContent() {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleDownload = async (format) => {
    try {
      setDownloadingFormat(format);
      setStatusMessage(null);

      await downloadResume(format);

      setStatusMessage({
        type: 'success',
        text: `Prashant_Singh_Resume.${format} downloaded successfully from server.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Download failed: ${err.message || 'Server connection error'}. Please verify server is running.`,
      });
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handlePreviewPdf = () => {
    const previewUrl = getResumeViewUrl();
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="window-resume" aria-label="Curriculum Vitae">
      {/* Resume Header & Contact Strip */}
      <div className="resume-header">
        <h2 className="resume-title">PRASHANT SINGH</h2>
        <div className="resume-contact-bar">
          <span>+91-8302840321</span>
          <span className="bullet-sep">&bull;</span>
          <a href="mailto:prashanttsinghh205@gmail.com" className="resume-link">
            prashanttsinghh205@gmail.com
          </a>
          <span className="bullet-sep">&bull;</span>
          <span>Jaipur, Rajasthan</span>
        </div>
      </div>

      {/* Professional Summary */}
      <section className="resume-section">
        <h3 className="resume-section-heading">PROFESSIONAL SUMMARY</h3>
        <p className="resume-summary-text">
          Computer Science and Engineering undergraduate at JK Lakshmipat University, Jaipur (2024–2028),
          specializing in responsive web engineering and full-stack software development with React,
          Node.js, Express, and MongoDB.
        </p>
      </section>

      {/* Education Timeline */}
      <Timeline />

      {/* Technical Skills */}
      <Skills />

      {/* Project Highlights */}
      <section className="resume-section">
        <h3 className="resume-section-heading">PROJECT HIGHLIGHTS</h3>
        <div className="resume-projects-list">
          <div className="resume-project-item">
            <div className="resume-project-header">
              <h4 className="resume-project-name">TIFFIN HUB</h4>
              <span className="resume-project-stack">React Native | Expo | Node.js | Express.js | MongoDB</span>
            </div>
            <p className="resume-project-summary">
              A cross-platform food delivery and meal subscription application featuring authentication, kitchen discovery, cart management, order tracking, and subscriptions.
            </p>
          </div>

          <div className="resume-project-item">
            <div className="resume-project-header">
              <h4 className="resume-project-name">SMART PUBLIC TRANSPORT & TICKETING SYSTEM</h4>
              <span className="resume-project-stack">HTML5 | CSS3 | JavaScript | Chart.js | qrcode.js | JSON</span>
            </div>
            <p className="resume-project-summary">
              A responsive public transportation management application featuring route discovery, schedules, digital QR-code tickets, student discounts, vehicle management, and admin analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <Certifications />

      {/* Languages */}
      <section className="resume-section">
        <h3 className="resume-section-heading">LANGUAGES</h3>
        <div className="resume-languages-wrap">
          <span className="resume-language-badge">English (Fluent)</span>
          <span className="resume-language-badge">Hindi (Fluent)</span>
        </div>
      </section>

      {/* Working Resume Document Downloads */}
      <section className="resume-section resume-download-box">
        <h3 className="resume-section-heading">OFFICIAL RESUME DOWNLOADS</h3>
        <p className="resume-download-desc">
          Download Prashant Singh's verified resume served directly by the Node.js/Express backend API (excluding cover letter).
        </p>

        <div className="resume-actions-group">
          <button
            type="button"
            className="resume-download-btn resume-btn-pdf"
            onClick={() => handleDownload('pdf')}
            disabled={downloadingFormat === 'pdf'}
          >
            {downloadingFormat === 'pdf' ? 'Downloading...' : '⬇ Download PDF Resume'}
          </button>

          <button
            type="button"
            className="resume-download-btn resume-btn-docx"
            onClick={() => handleDownload('docx')}
            disabled={downloadingFormat === 'docx'}
          >
            {downloadingFormat === 'docx' ? 'Downloading...' : '⬇ Download Word (.docx)'}
          </button>

          <button
            type="button"
            className="resume-download-btn resume-btn-preview"
            onClick={handlePreviewPdf}
          >
            ↗ Preview PDF in Browser
          </button>
        </div>

        {/* Feedback / Error Notification */}
        {statusMessage && (
          <div
            className={`resume-status-alert ${
              statusMessage.type === 'success' ? 'status-success' : 'status-error'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </section>
    </article>
  );
}

export default ResumeContent;
