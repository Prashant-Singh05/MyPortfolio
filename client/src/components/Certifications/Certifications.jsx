import React from 'react';
import './Certifications.css';

/**
 * Certifications Component
 * Displays verified certifications from Prashant Singh's resume.
 */
function Certifications() {
  const certs = [
    {
      name: 'Programming for Everybody (Getting Started with Python)',
      field: 'Python Programming',
    },
    {
      name: 'Programming in C',
      field: 'Core Systems Programming',
    },
  ];

  return (
    <section className="certifications-component" aria-label="Certifications">
      <h3 className="certifications-heading">CERTIFICATIONS</h3>
      <div className="certifications-list">
        {certs.map((c, i) => (
          <div key={i} className="certification-card">
            <div className="certification-info">
              <h4 className="certification-name">{c.name}</h4>
              <p className="certification-issuer">{c.field}</p>
            </div>
            <span className="certification-badge">Verified</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Certifications;
