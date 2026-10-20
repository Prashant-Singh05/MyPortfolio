import React from 'react';
import { projectsData } from '../../data/projectsData';
import './Projects.css';

/**
 * Projects Component
 * Represents the Works / Projects section of Prashant Singh's Portfolio.
 * Displays Tiffin Hub and Smart Public Transport & Ticketing System with full details and GitHub links.
 */
function Projects() {
  return (
    <article className="projects-section" aria-label="Projects and Works">
      <div className="projects-header-banner" aria-hidden="true" />
      <h2 className="projects-section-title">FEATURED PROJECTS</h2>

      <div className="projects-cards-grid">
        {projectsData.map((project) => (
          <div key={project.id} className="project-item-card">
            <div className="project-item-header">
              <div>
                <h3 className="project-item-title">{project.title}</h3>
                {project.subtitle && (
                  <span className="project-item-subtitle">{project.subtitle}</span>
                )}
              </div>
              <span className="project-item-badge">{project.category}</span>
            </div>

            <p className="project-item-desc">{project.description}</p>

            <div className="project-item-footer">
              <div className="project-item-tags" aria-label="Tech Stack">
                {project.technologies.map((tech) => (
                  <span key={tech} className="project-item-tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* GitHub and Live Demo Action Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div className="project-item-actions">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link"
                      title={`View ${project.title} on GitHub`}
                    >
                      GitHub &rarr;
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link project-action-live"
                    >
                      Live Demo &rarr;
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default Projects;
