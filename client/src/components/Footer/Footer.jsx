import React from 'react';
import './Footer.css';
import linkedinIcon from '../../assets/icons/linkedin-transparent.gif';
import githubIcon from '../../assets/icons/github.png';

/**
 * Footer Component
 * Houses social links, Terminal launcher in the retro dock,
 * and a Dark/Light mode theme toggle in the bottom right system tray.
 */
function Footer({ onOpenTerminal, onReplayIntro }) {
  const socialLinks = [
    { name: 'LinkedIn', icon: linkedinIcon, url: 'https://www.linkedin.com/in/prashant-singhh05/' },
    { name: 'GitHub', icon: githubIcon, url: 'https://github.com/Prashant-Singh05' },
  ];

  const handleTerminalClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (onOpenTerminal) {
      onOpenTerminal({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    } else if (onReplayIntro) {
      onReplayIntro();
    }
  };

  return (
    <footer className="footer-bar bottom-bar" aria-label="Desktop Taskbar Footer">
      <nav className="footer-dock bottom-bar-dock" aria-label="System Dock and Social Links">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`footer-icon-link dock-icon-link ${item.name === 'GitHub' ? 'dock-icon-github' : ''}`}
            aria-label={item.name}
            title={item.name}
          >
            <span className="footer-icon-box dock-icon-box">
              <img src={item.icon} alt={item.name} className="footer-icon-img dock-icon-img" />
            </span>
          </a>
        ))}

        {/* Terminal Application Dock Launcher */}
        <button
          type="button"
          className="footer-icon-link dock-icon-link footer-terminal-btn dock-terminal-btn"
          onClick={handleTerminalClick}
          aria-label="Open Terminal App"
          title="Open Terminal (CLI Shell)"
        >
          <span className="footer-icon-box dock-icon-box footer-terminal-box dock-terminal-box">
            <span className="footer-terminal-symbol dock-terminal-symbol">&gt;_</span>
          </span>
        </button>
      </nav>
    </footer>
  );
}

export default Footer;
