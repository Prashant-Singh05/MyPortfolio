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
 * Top OS Navigation Bar - Authentic Linux Hyprland / Waybar
 * Features:
 * - Professional Arch/Hyprland launcher button with crisp SVG logo and spring micro-physics
 * - Real, workable system tray:
 *   1. Network: Live online/offline detection + interactive ping / connection flyout
 *   2. Audio: Workable volume slider, mute toggle, and Web Audio sound pip feedback
 *   3. Battery: Real navigator.getBattery() integration + interactive power profile flyout
 *   4. Theme Toggle: Positioned before the tray with seamless hardware switch
 */
function Navbar({ onOpenWindow, theme = 'light', onToggleTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tray Flyouts: 'network' | 'volume' | 'battery' | null
  const [activeFlyout, setActiveFlyout] = useState(null);

  // Network State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pingMs, setPingMs] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  // Volume State
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Battery State
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(true);
  const [powerProfile, setPowerProfile] = useState('balanced'); // 'power-saver', 'balanced', 'performance'

  const menuRef = useRef(null);
  const trayRef = useRef(null);
  const searchInputRef = useRef(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Battery API Integration
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        const onLevelChange = () => setBatteryLevel(Math.round(battery.level * 100));
        const onChargingChange = () => setIsCharging(battery.charging);

        battery.addEventListener('levelchange', onLevelChange);
        battery.addEventListener('chargingchange', onChargingChange);
        return () => {
          battery.removeEventListener('levelchange', onLevelChange);
          battery.removeEventListener('chargingchange', onChargingChange);
        };
      }).catch(() => {
        // Fallback default is already set
      });
    }
  }, []);

  // Close menus/flyouts on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setSearchQuery('');
      }
      if (trayRef.current && !trayRef.current.contains(event.target)) {
        setActiveFlyout(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when launcher opens
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

  // Play audio pip on volume change
  const playAudioPip = (volLevel) => {
    if (isMuted || volLevel <= 0) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime((volLevel / 100) * 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // Audio context restricted by autoplay policy
    }
  };

  const handleVolumeChange = (newVal) => {
    setVolume(newVal);
    if (isMuted) setIsMuted(false);
    playAudioPip(newVal);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute) {
      playAudioPip(volume);
    }
  };

  // Ping test function
  const runPingTest = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
      setPingMs(Math.round(performance.now() - start));
    } catch {
      setPingMs(Math.round(performance.now() - start));
    } finally {
      setIsPinging(false);
    }
  };

  const toggleFlyout = (name) => {
    if (activeFlyout === name) {
      setActiveFlyout(null);
    } else {
      setActiveFlyout(name);
      if (name === 'network' && pingMs === null) {
        runPingTest();
      }
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
      {/* =========================================================
          LEFT MODULE: Professional Hyprland Launcher & Workspaces
          ========================================================= */}
      <div className="hypr-left-module" ref={menuRef}>
        {/* Sleek Icon-Only App Launcher Squircle */}
        <motion.button
          type="button"
          className={`hypr-pill hypr-launcher-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setSearchQuery('');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          title="Applications Menu (Wofi / Rofi)"
        >
          <span className={`hypr-launcher-glyph ${isMenuOpen ? 'open' : ''}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
            </svg>
          </span>
        </motion.button>

        {/* Wofi / Rofi Launcher Popover */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="hypr-launcher-window"
              role="menu"
              initial={{ opacity: 0, scale: 0.94, y: -10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.94, y: -8, filter: 'blur(6px)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              {/* Search prompt */}
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

              {/* App List */}
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

              <div className="hypr-launcher-footer">
                <span>[1-6] quick launch</span>
                <span>[esc] close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          CENTER MODULE: Floating Waybar Clock
          ========================================================= */}
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

      {/* =========================================================
          RIGHT MODULE: Theme Switch & Workable System Tray
          ========================================================= */}
      <div className="hypr-right-module" ref={trayRef}>
        {/* Hardware Capsule Theme Toggle (Placed before System Tray) */}
        <div className="hypr-pill hypr-toggle-pill" title="Toggle Light / Dark Mode">
          <ThemeToggle
            id="navbar-theme-toggle"
            isDark={theme === 'dark'}
            onToggle={onToggleTheme}
            className="navbar-theme-toggle"
          />
        </div>

        {/* WORKABLE SYSTEM TRAY ISLAND */}
        <div className="hypr-pill hypr-tray-pill" aria-label="System Tray">
          {/* 1. Network / Wi-Fi Button */}
          <button
            type="button"
            className={`hypr-tray-btn ${activeFlyout === 'network' ? 'active' : ''}`}
            onClick={() => toggleFlyout('network')}
            aria-label="Network Status"
            title={isOnline ? 'Network: Online' : 'Network: Disconnected'}
          >
            {isOnline ? (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.55 0 6.78 1.41 9.15 3.69L12 18.39 2.85 11.19C5.22 8.91 8.45 7.5 12 7.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#ef4444">
                <path d="M22.99 9C20.89 6.89 18.06 5.56 15 5.16L17.7 7.86C19.78 8.35 21.6 9.54 22.99 11.01L24 9.99 22.99 9zM2.81 2.81L1.39 4.22l2.6 2.6C2.4 7.6 1.09 8.71 0 9.99L12 22l4.18-4.18 4.6 4.6 1.41-1.41L2.81 2.81z" />
              </svg>
            )}
          </button>

          {/* 2. Audio / Volume Button */}
          <button
            type="button"
            className={`hypr-tray-btn ${activeFlyout === 'volume' ? 'active' : ''}`}
            onClick={() => toggleFlyout('volume')}
            aria-label="Audio Volume Control"
            title={`Audio: ${isMuted ? 'Muted' : `${volume}%`}`}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          {/* 3. Battery Button */}
          <button
            type="button"
            className={`hypr-tray-btn hypr-tray-battery ${activeFlyout === 'battery' ? 'active' : ''}`}
            onClick={() => toggleFlyout('battery')}
            aria-label="Battery Status"
            title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}
          >
            {isCharging ? (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
              </svg>
            )}
            <span className="hypr-battery-pct">{batteryLevel}%</span>
          </button>
        </div>

        {/* =========================================================
            WORKABLE FLYOUT PANELS (Waybar Quick Controls)
            ========================================================= */}
        <AnimatePresence>
          {/* Network Flyout */}
          {activeFlyout === 'network' && (
            <motion.div
              className="hypr-flyout-card"
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              <div className="flyout-header">
                <span className="flyout-icon">📶</span>
                <span className="flyout-title">Network Interface</span>
                <span className={`flyout-badge ${isOnline ? 'badge-online' : 'badge-offline'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flyout-body">
                <div className="flyout-row">
                  <span className="flyout-label">Interface:</span>
                  <span className="flyout-val">wlan0 (802.11ax)</span>
                </div>
                <div className="flyout-row">
                  <span className="flyout-label">Gateway:</span>
                  <span className="flyout-val">192.168.1.1</span>
                </div>
                <div className="flyout-row">
                  <span className="flyout-label">Latency:</span>
                  <span className="flyout-val">{pingMs !== null ? `${pingMs} ms` : 'Testing...'}</span>
                </div>
              </div>

              <button
                type="button"
                className="flyout-action-btn"
                onClick={runPingTest}
                disabled={isPinging}
              >
                {isPinging ? 'Testing Ping...' : 'Refresh / Ping Test'}
              </button>
            </motion.div>
          )}

          {/* Volume Flyout */}
          {activeFlyout === 'volume' && (
            <motion.div
              className="hypr-flyout-card"
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              <div className="flyout-header">
                <span className="flyout-icon">{isMuted ? '🔇' : '🔊'}</span>
                <span className="flyout-title">PipeWire Audio</span>
                <span className="flyout-badge">{isMuted ? 'Muted' : `${volume}%`}</span>
              </div>

              <div className="flyout-body">
                <div className="flyout-slider-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                    className="hypr-flyout-slider"
                    aria-label="Volume Slider"
                  />
                </div>
              </div>

              <div className="flyout-actions-row">
                <button
                  type="button"
                  className={`flyout-action-btn ${isMuted ? 'active-mute' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? 'Unmute' : 'Mute Audio'}
                </button>
                <button
                  type="button"
                  className="flyout-action-btn"
                  onClick={() => playAudioPip(volume)}
                  disabled={isMuted}
                >
                  Test Pip
                </button>
              </div>
            </motion.div>
          )}

          {/* Battery Flyout */}
          {activeFlyout === 'battery' && (
            <motion.div
              className="hypr-flyout-card"
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -6 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              <div className="flyout-header">
                <span className="flyout-icon">{isCharging ? '⚡' : '🔋'}</span>
                <span className="flyout-title">Power Supply</span>
                <span className="flyout-badge">{batteryLevel}%</span>
              </div>

              <div className="flyout-body">
                <div className="flyout-row">
                  <span className="flyout-label">Status:</span>
                  <span className="flyout-val">{isCharging ? 'AC (Charging)' : 'Discharging'}</span>
                </div>
                <div className="flyout-row">
                  <span className="flyout-label">Health:</span>
                  <span className="flyout-val">Good (100%)</span>
                </div>

                <div className="flyout-section-title">Power Profile:</div>
                <div className="flyout-profiles-group">
                  <button
                    type="button"
                    className={`profile-pill ${powerProfile === 'power-saver' ? 'active' : ''}`}
                    onClick={() => setPowerProfile('power-saver')}
                  >
                    Eco
                  </button>
                  <button
                    type="button"
                    className={`profile-pill ${powerProfile === 'balanced' ? 'active' : ''}`}
                    onClick={() => setPowerProfile('balanced')}
                  >
                    Balanced
                  </button>
                  <button
                    type="button"
                    className={`profile-pill ${powerProfile === 'performance' ? 'active' : ''}`}
                    onClick={() => setPowerProfile('performance')}
                  >
                    Performance
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
