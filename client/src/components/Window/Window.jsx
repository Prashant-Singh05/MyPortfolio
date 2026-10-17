import React from 'react';
import './Window.css';

/**
 * Reusable Retro Desktop Window Component
 * 
 * Provides the window frame, olive title bar with path name,
 * pink close button, drop shadow, and cream-colored scrollable body.
 */
function Window({
  id,
  title,
  isActive = false,
  zIndex = 50,
  offsetIndex = 0,
  onClose,
  onFocus,
  children,
}) {
  // Bring window to front when clicked
  const handleWindowClick = (e) => {
    e.stopPropagation();
    if (onFocus) {
      onFocus(id);
    }
  };

  // Close window when user clicks the pink '×' button
  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(id);
    }
  };

  // Subtle cascading offset (24px per open window) so windows don't hide each other completely
  const cascadeOffset = offsetIndex * 24;

  return (
    <div
      className={`retro-window ${isActive ? 'retro-window-active' : ''}`}
      style={{
        zIndex: zIndex,
        '--cascade-offset': `${cascadeOffset}px`,
      }}
      onClick={handleWindowClick}
      role="dialog"
      aria-labelledby={`window-title-${id}`}
    >
      {/* Retro Title Bar */}
      <div className="retro-window-titlebar">
        <span className="retro-window-title" id={`window-title-${id}`}>
          {title}
        </span>
        <button
          type="button"
          className="retro-window-close-btn"
          onClick={handleCloseClick}
          aria-label={`Close ${title}`}
          title="Close window"
        >
          &times;
        </button>
      </div>

      {/* Window Interior Content */}
      <div className="retro-window-body">
        {children}
      </div>
    </div>
  );
}

export default Window;
