import React from 'react';
import closedFolder from '../../assets/icons/Closed-folder.png';
import openedFolder from '../../assets/icons/opened-folder.png';
import './DesktopIcon.css';

/**
 * DesktopIcon Component
 *
 * Represents an interactive retro desktop shortcut.
 * If a customIcon (like male-user.png) is passed, it displays that icon.
 * Otherwise, it uses the closed/open folder images toggled on hover/focus.
 *
 * @param {string} label - Text label displayed under the shortcut
 * @param {function} onClick - Click handler for folder actions
 * @param {string} [customIcon] - Optional custom image source (e.g. male-user.png)
 */
function DesktopIcon({ label, onClick, customIcon }) {
  return (
    <button
      type="button"
      className="desktop-icon"
      onClick={onClick}
      aria-label={label}
    >
      <div className="icon-image-container">
        {customIcon ? (
          /* Custom icon (e.g. profile male-user.png) */
          <img
            src={customIcon}
            alt=""
            className="folder-img"
            width="64"
            height="64"
          />
        ) : (
          /* Default folder behavior: closed by default, open on hover/focus */
          <>
            <img
              src={closedFolder}
              alt=""
              className="folder-img folder-closed"
              width="64"
              height="64"
            />
            <img
              src={openedFolder}
              alt=""
              className="folder-img folder-opened"
              width="64"
              height="64"
            />
          </>
        )}
      </div>
      <span className="icon-label">{label}</span>
    </button>
  );
}

export default DesktopIcon;
