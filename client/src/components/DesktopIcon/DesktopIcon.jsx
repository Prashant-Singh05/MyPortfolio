import React from 'react';
import closedFolder from '../../assets/icons/Closed-folder.png';
import openedFolder from '../../assets/icons/opened-folder.png';
import './DesktopIcon.css';

/**
 * DesktopIcon Component
 *
 * Represents an interactive retro desktop shortcut.
 * Uses Closed-folder.png and opened-folder.png with macOS-style state transitions.
 * When the corresponding window is open, it holds the opened folder visual state.
 * Supports dynamic folder icon sizing ('small', 'medium', 'large').
 *
 * @param {string} label - Text label displayed under the shortcut
 * @param {function} onClick - Click handler receiving origin bounding coordinates
 * @param {string} [customIcon] - Optional custom image source (e.g. male-user.png)
 * @param {boolean} [isOpen] - Indicates whether the corresponding window is currently active/open
 * @param {string} [iconSize] - Sizing mode: 'small' (50px), 'medium' (64px), 'large' (80px)
 */
function DesktopIcon({ label, onClick, customIcon, isOpen = false, iconSize = 'medium' }) {
  const sizePx = iconSize === 'small' ? 50 : iconSize === 'large' ? 80 : 64;

  const handleClick = (e) => {
    if (onClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      onClick({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  return (
    <button
      type="button"
      className={`desktop-icon ${isOpen ? 'desktop-icon-open' : ''}`}
      onClick={handleClick}
      aria-label={`${label} folder ${isOpen ? '(open)' : ''}`}
      aria-expanded={isOpen}
      style={{ '--icon-size': `${sizePx}px` }}
    >
      <div className="icon-image-container">
        {customIcon ? (
          /* Custom icon (e.g. profile male-user.png) */
          <img
            src={customIcon}
            alt=""
            className="folder-img"
            width={sizePx}
            height={sizePx}
          />
        ) : isOpen ? (
          /* When window is currently open, show opened folder state */
          <img
            src={openedFolder}
            alt=""
            className="folder-img folder-persisted-open"
            width={sizePx}
            height={sizePx}
          />
        ) : (
          /* Default folder behavior: closed by default, open on hover/focus */
          <>
            <img
              src={closedFolder}
              alt=""
              className="folder-img folder-closed"
              width={sizePx}
              height={sizePx}
            />
            <img
              src={openedFolder}
              alt=""
              className="folder-img folder-opened"
              width={sizePx}
              height={sizePx}
            />
          </>
        )}
      </div>
      <span className="icon-label">
        {label}
        {isOpen && <span className="icon-active-indicator" aria-hidden="true" />}
      </span>
    </button>
  );
}

export default DesktopIcon;
