import React from 'react';
import './ThemeToggle.css';

/**
 * ThemeToggle Component
 * A retro-modern capsule toggle switch inspired by the classic OS hardware day/night switch.
 * Displays a sun icon on the left with 8 radial rays and a sliding circular white thumb.
 *
 * @param {boolean} isDark - Whether dark mode is currently active
 * @param {function} onToggle - Callback triggered when toggle is clicked
 * @param {string} [className] - Optional extra class names for positioning
 */
function ThemeToggle({ isDark, onToggle, className = '', id = 'theme-toggle-switch' }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`retro-theme-toggle ${isDark ? 'retro-theme-toggle-dark' : 'retro-theme-toggle-light'} ${className}`}
      onClick={onToggle}
    >
      {/* Sun icon on left with circular center and 8 radial rays */}
      <span className="toggle-icon toggle-sun-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <circle cx="12" cy="12" r="4.2" />
          {/* Top & Bottom */}
          <rect x="10.8" y="1.5" width="2.4" height="4" rx="0.8" />
          <rect x="10.8" y="18.5" width="2.4" height="4" rx="0.8" />
          {/* Left & Right */}
          <rect x="1.5" y="10.8" width="4" height="2.4" rx="0.8" />
          <rect x="18.5" y="10.8" width="4" height="2.4" rx="0.8" />
          {/* 4 Diagonal rays */}
          <rect
            x="10.8"
            y="1.5"
            width="2.4"
            height="4"
            rx="0.8"
            transform="rotate(45 12 12)"
          />
          <rect
            x="10.8"
            y="1.5"
            width="2.4"
            height="4"
            rx="0.8"
            transform="rotate(135 12 12)"
          />
          <rect
            x="10.8"
            y="1.5"
            width="2.4"
            height="4"
            rx="0.8"
            transform="rotate(225 12 12)"
          />
          <rect
            x="10.8"
            y="1.5"
            width="2.4"
            height="4"
            rx="0.8"
            transform="rotate(315 12 12)"
          />
        </svg>
      </span>

      {/* Crescent Moon icon on right */}
      <span className="toggle-icon toggle-moon-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Sliding white circular thumb */}
      <span className="toggle-thumb" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
