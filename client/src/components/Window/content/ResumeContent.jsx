import React from 'react';
import '../WindowContent.css';

/**
 * Resume Window Content
 * Displays education, core skills, and a placeholder resume download button.
 */
function ResumeContent() {
  const skills = [
    'React.js', 'Node.js', 'Express.js', 'MongoDB',
    'JavaScript (ES6+)', 'HTML5 & CSS3', 'RESTful APIs',
    'Git & GitHub', 'Responsive UI Design', 'Mongoose'
  ];

  const handleDownloadNotice = () => {
    alert('Resume download will connect to server endpoints (/api/resume/pdf and /api/resume/docx) in the backend integration step!');
  };

  return (
    <article className="window-resume">
      <div className="resume-header">
        <h2 className="resume-title">CURRICULUM VITAE</h2>
      </div>

      <section className="resume-section">
        <h3 className="resume-section-heading">Education</h3>
        <div className="resume-item">
          <h4 className="resume-item-title">Bachelor of Technology (B.Tech) - Computer Science</h4>
          <p className="resume-item-subtitle">Graduation Year: 2026</p>
        </div>
      </section>

      <section className="resume-section">
        <h3 className="resume-section-heading">Technical Proficiencies</h3>
        <div className="resume-skills-list">
          {skills.map((skill) => (
            <span key={skill} className="resume-skill-chip">{skill}</span>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3 className="resume-section-heading">Resume Document</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555944' }}>
          Official resume copy formatted according to standard college and industry rubrics.
        </p>
        <button
          type="button"
          className="resume-download-placeholder"
          onClick={handleDownloadNotice}
        >
          &darr; Download PDF Resume (Demo)
        </button>
      </section>
    </article>
  );
}

export default ResumeContent;
