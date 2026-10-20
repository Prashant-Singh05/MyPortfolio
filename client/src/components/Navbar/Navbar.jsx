import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Navbar.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

// Hyprland / Waybar app launcher registry
const APPS = [
  { id: 'profile', name: 'profile', icon: '👤', tag: '~/.about', key: '1' },
  { id: 'works', name: 'works', icon: '💼', tag: '~/.projects', key: '2' },
  { id: 'contact', name: 'contact', icon: '✉️', tag: '~/.mail', key: '3' },
  { id: 'resume', name: 'resume.pdf', icon: '📄', tag: '~/.cv', key: '4' },
  { id: 'settings', name: 'settings', icon: '⚙️', tag: '~/.config', key: '5' },
  { id: 'terminal', name: 'terminal', icon: '💻', tag: '/bin/bash', key: '6' },
];

/**
 * Top OS Navigation Bar - Linux Hyprland / Waybar Aesthetic
 * Ultra-modern, frosted glass island pills, micro-spring transitions, and dmenu/wofi style app launcher.
 */
function Navbar({ onOpenWindow, theme = 'light', onToggleTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setSearchQuery('');
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isMenuOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isMenuOpen]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMenuOpen) return;

      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setSearchQuery('');
        return;
      }

      // Quick launch via number keys 1-6 when not actively typing queries
      if (!searchQuery && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const app = APPS.find((a) => a.key === e.key);
        if (app) handleLaunchApp(app.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, searchQuery]);

  const handleLaunchApp = (windowId) => {
    setIsMenuOpen(false);
    setSearchQuery('');
    if (onOpenWindow) {
      onOpenWindow(windowId);
    }
  };

  // Filter apps based on search
  const filteredApps = APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dateStr = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = currentTime.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header className="hypr-bar" role="banner">
      {/* LEFT MODULE: Hyprland App Launcher */}
      <div className="hypr-left-module" ref={menuRef}>
        <motion.button
          type="button"
          className={`hypr-pill hypr-launcher-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setSearchQuery('');
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          title="Hyprland App Launcher (Wofi/Rofi)"
        >
          {/* Linux Terminal / Arch Prompt Icon */}
          <span className="hypr-launcher-icon">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M4 4h4l8 8-8 8H4l8-8z" />
            </svg>
          </span>
          <span className="hypr-launcher-label">menu</span>
          <span className="hypr-status-dot" />
        </motion.button>

        {/* WOFI / ROFI STYLE APP LAUNCHER MODAL */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="hypr-launcher-window"
              role="menu"
              initial={{ opacity: 0, scale: 0.93, y: -10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.93, y: -8, filter: 'blur(6px)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              {/* Launcher Search Bar */}
              <div className="hypr-search-box">
                <span className="hypr-prompt-symbol">❯</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="hypr-search-input"
                  placeholder="type to filter apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredApps.length > 0) {
                      handleLaunchApp(filteredApps[0].id);
                    }
                  }}
                />
                <span className="hypr-search-badge">wofi</span>
              </div>

              {/* Application List (Clean, no verbose AI fluff) */}
              <div className="hypr-app-list">
                {filteredApps.length === 0 ? (
                  <div className="hypr-no-results">No matches found</div>
                ) : (
                  filteredApps.map((app) => (
                    <motion.button
                      key={app.id}
                      type="button"
                      className="hypr-app-row"
                      role="menuitem"
                      onClick={() => handleLaunchApp(app.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="hypr-app-glyph">{app.icon}</span>
                      <span className="hypr-app-name">{app.name}</span>
                      <span className="hypr-app-tag">{app.tag}</span>
                      <span className="hypr-app-key">[{app.key}]</span>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Launcher Quick Hint Footer */}
              <div className="hypr-launcher-footer">
                <span>[1-6] quick launch</span>
                <span>[esc] close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CENTER MODULE: Floating Clock Pill */}
      <div className="hypr-center-module">
        <motion.div
          className="hypr-pill hypr-clock-pill"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="hypr-clock-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
          <span className="hypr-date">{dateStr}</span>
          <span className="hypr-clock-sep">•</span>
          <span className="hypr-time">{timeStr}</span>
        </motion.div>
      </div>

      {/* RIGHT MODULE: Theme Switch & System Tray */}
      <div className="hypr-right-module">
        {/* Hardware Capsule Theme Toggle (Placed before System Tray) */}
        <div className="hypr-pill hypr-toggle-pill" title="Toggle Light / Dark Mode">
          <ThemeToggle
            id="navbar-theme-toggle"
            isDark={theme === 'dark'}
            onToggle={onToggleTheme}
            className="navbar-theme-toggle"
          />
        </div>

        {/* System Tray (Network, Audio, Battery) */}
        <div className="hypr-pill hypr-tray-pill" aria-label="System Tray">
          {/* Network */}
          <div className="hypr-tray-item" title="Network: eth0 1Gbps (Connected)" aria-label="Wi-Fi">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.55 0 6.78 1.41 9.15 3.69L12 18.39 2.85 11.19C5.22 8.91 8.45 7.5 12 7.5z" />
            </svg>
          </div>

          {/* Volume */}
          <div className="hypr-tray-item" title="PipeWire: 100%" aria-label="Audio">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>

          {/* Battery */}
          <div className="hypr-tray-item hypr-battery-item" title="BAT0: 100% (AC)" aria-label="Battery">
            <svg viewBox="0 0 24 24" width="14" height="13" fill="currentColor">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
            <span className="hypr-battery-pct">100%</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
