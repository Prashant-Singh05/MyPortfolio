import React from 'react';
import './Navbar.css';

/**
 * Navbar Component
 * Renders the top OS system header bar with system status and folder sizing controls.
 */
function Navbar({ folderIconSize = 'medium', onFolderSizeChange }) {
  return (
    <nav className="navbar-system-bar" aria-label="System Menu Bar">
      <aside className="navbar-folder-size-widget" aria-label="Folder size controls">
        <span className="navbar-size-label">Size:</span>
        <div className="navbar-btn-group">
          <button
            type="button"
            className={`navbar-size-btn ${folderIconSize === 'small' ? 'navbar-size-btn-active' : ''}`}
            onClick={() => onFolderSizeChange && onFolderSizeChange('small')}
            title="Small Folders (50px)"
          >
            S
          </button>
          <button
            type="button"
            className={`navbar-size-btn ${folderIconSize === 'medium' ? 'navbar-size-btn-active' : ''}`}
            onClick={() => onFolderSizeChange && onFolderSizeChange('medium')}
            title="Medium Folders (64px)"
          >
            M
          </button>
          <button
            type="button"
            className={`navbar-size-btn ${folderIconSize === 'large' ? 'navbar-size-btn-active' : ''}`}
            onClick={() => onFolderSizeChange && onFolderSizeChange('large')}
            title="Large Folders (80px)"
          >
            L
          </button>
        </div>
      </aside>
    </nav>
  );
}

export default Navbar;
