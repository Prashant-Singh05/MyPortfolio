import React from 'react';
import './BottomBar.css';
import linkedinIcon from '../../assets/icons/linkedin-transparent.gif';
import githubIcon from '../../assets/icons/github.png';
import instaIcon from '../../assets/icons/instagram-transparent.gif';

const BottomBar = () => {
  const dockItems = [
    { name: 'LinkedIn', icon: linkedinIcon, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: githubIcon, url: 'https://github.com' },
    { name: 'Instagram', icon: instaIcon, url: 'https://instagram.com' },
  ];

  return (
    <footer className="bottom-bar" aria-label="Bottom Taskbar">
      <nav className="bottom-bar-dock" aria-label="Social Dock">
        {dockItems.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`dock-icon-link dock-icon-${item.type}`}
            aria-label={item.name}
            title={item.name}
          >
            <span className="dock-icon-box">
              <img src={item.icon} alt={item.name} className="dock-icon-img" />
            </span>
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default BottomBar;
