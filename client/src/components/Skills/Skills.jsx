import React from 'react';
import './Skills.css';

/**
 * Skills Component
 * Represents technical proficiencies categorized exactly according to Prashant Singh's verified resume.
 */
function Skills() {
  const categories = [
    {
      name: 'Languages',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Python', 'C'],
    },
    {
      name: 'Frameworks / Libraries',
      skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Express.js', 'Node.js'],
    },
    {
      name: 'Backend',
      skills: ['MySQL', 'RESTful APIs'],
    },
    {
      name: 'Developer Tools',
      skills: ['Git', 'GitHub', 'VS Code', 'Vite', 'npm', 'Vercel'],
    },
  ];

  return (
    <section className="skills-component" aria-label="Technical Skills">
      <h3 className="skills-heading">TECHNICAL SKILLS</h3>
      {categories.map((cat) => (
        <div key={cat.name} className="skills-category-group">
          <h4 className="skills-category-title">{cat.name}</h4>
          <div className="skills-badges-wrap">
            {cat.skills.map((skill) => (
              <span key={skill} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Skills;
