import React from 'react';
import './Settings.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const SIZE_MAP = { small: 1, medium: 2, large: 3 };
const SIZE_KEYS = ['small', 'medium', 'large'];
const SIZE_LABELS = {
  small: 'Small (50px)',
  medium: 'Medium (64px)',
  large: 'Large (80px)',
};

/**
 * Settings Component - Native Linux Control Center Style
 * Features:
 * 1. Dark/Light Mode using the hardware capsule ThemeToggle switch
 * 2. Folder Icon Size using a native styled range slider with discrete steps
 */
function Settings({
  theme = 'light',
  onSelectTheme,
  folderIconSize = 'medium',
  onFolderSizeChange,
}) {
  const isDark = theme === 'dark';
  const sliderValue = SIZE_MAP[folderIconSize] || 2;

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    const selectedSize = SIZE_KEYS[val - 1] || 'medium';
    if (onFolderSizeChange) {
      onFolderSizeChange(selectedSize);
    }
  };

  const handleToggleTheme = () => {
    if (onSelectTheme) {
      onSelectTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <div className="linux-settings">
      <div className="linux-group">
        <div className="linux-group-header">
          <span className="linux-group-title">APPEARANCE</span>
        </div>

        <div className="linux-card">
          {/* Row 1: Dark Mode Toggle */}
          <div className="linux-row">
            <div className="linux-row-left">
              <span className="linux-row-icon" aria-hidden="true">🌙</span>
              <div className="linux-row-text">
                <span className="linux-row-title">Dark Mode</span>
              </div>
            </div>

            <div className="linux-row-right">
              <span className="linux-status-pill">{isDark ? 'Enabled' : 'Disabled'}</span>
              <ThemeToggle
                id="settings-theme-toggle"
                isDark={isDark}
                onToggle={handleToggleTheme}
                className="settings-theme-toggle"
              />
            </div>
          </div>

          <div className="linux-row-divider" />

          {/* Row 2: Icon Size Range Slider */}
          <div className="linux-row linux-row-slider">
            <div className="linux-row-left">
              <span className="linux-row-icon" aria-hidden="true">📁</span>
              <div className="linux-row-text">
                <span className="linux-row-title">Icon Size</span>
              </div>
            </div>

            <div className="linux-row-right slider-right">
              <span className="linux-size-indicator">{SIZE_LABELS[folderIconSize]}</span>

              <div className="slider-wrapper">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="linux-slider"
                  aria-label="Desktop Icon Size Slider"
                />

                <div className="slider-ticks" aria-hidden="true">
                  <button
                    type="button"
                    className={`slider-tick ${sliderValue === 1 ? 'active' : ''}`}
                    onClick={() => onFolderSizeChange && onFolderSizeChange('small')}
                  >
                    S
                  </button>
                  <button
                    type="button"
                    className={`slider-tick ${sliderValue === 2 ? 'active' : ''}`}
                    onClick={() => onFolderSizeChange && onFolderSizeChange('medium')}
                  >
                    M
                  </button>
                  <button
                    type="button"
                    className={`slider-tick ${sliderValue === 3 ? 'active' : ''}`}
                    onClick={() => onFolderSizeChange && onFolderSizeChange('large')}
                  >
                    L
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
