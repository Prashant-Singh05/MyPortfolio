import React from 'react';
import '../WindowContent.css';

/**
 * Works Window Content
 * Displays featured projects and technical stack cards.
 */
function WorksContent() {
  const projects = [
    {
      title: 'Retro Desktop Portfolio',
      type: 'Frontend Application',
      description: 'An interactive retro OS desktop environment featuring draggable windows, custom graph-paper canvas, and dock navigation.',
      tags: ['React', 'Vite', 'CSS3', 'UI/UX'],
    },
    {
      title: 'Task Management Engine',
      type: 'MERN Full Stack',
      description: 'A collaborative project workspace with real-time status updates, RESTful APIs, and MongoDB schema validation.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    },
    {
      title: 'Document & Resume Generator',
      type: 'Backend Microservice',
      description: 'Automated server-side PDF and DOCX compilation pipeline with dynamic templating and file streaming.',
      tags: ['Node.js', 'Express', 'PDFKit', 'REST'],
    },
  ];

  return (
    <article className="window-works">
      <div className="works-header-banner" aria-hidden="true"></div>
      <h2 className="works-title">FEATURED PROJECTS</h2>

      <div className="projects-grid">
        {projects.map((proj) => (
          <div key={proj.title} className="project-card">
            <div className="project-card-header">
              <h3 className="project-card-title">{proj.title}</h3>
              <span className="project-card-badge">{proj.type}</span>
            </div>
            <p className="project-card-desc">{proj.description}</p>
            <div className="project-tags">
              {proj.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default WorksContent;
