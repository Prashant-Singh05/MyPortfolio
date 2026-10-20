import React from 'react';
import './Timeline.css';

/**
 * Timeline Component
 * Represents Prashant Singh's verified educational background.
 */
function Timeline() {
  const educationHistory = [
    {
      period: '2024 — 2028',
      institution: 'JK Lakshmipat University, Jaipur (Rajasthan)',
      degree: 'B.Tech in Computer Science and Engineering',
      desc: 'Pursuing undergraduate degree in Computer Science and Engineering, focusing on software development, web technologies, and database systems.',
    },
  ];

  return (
    <section className="timeline-component" aria-label="Education Timeline">
      <h3 className="timeline-heading">EDUCATION</h3>
      <div className="timeline-track">
        {educationHistory.map((item, idx) => (
          <div key={idx} className="timeline-node">
            <span className="timeline-node-period">{item.period}</span>
            <h4 className="timeline-node-title">{item.degree}</h4>
            <div className="timeline-node-institution">{item.institution}</div>
            <p className="timeline-node-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
