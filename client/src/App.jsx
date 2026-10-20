import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import Footer from './components/Footer/Footer';
import Window from './components/Window/Window';
import TerminalIntro from './components/TerminalIntro/TerminalIntro';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Hero from './components/Hero/Hero';
import Navbar from './components/Navbar/Navbar';
import ResumeContent from './components/Window/content/ResumeContent';
import TerminalAppContent from './components/Window/content/TerminalAppContent';
import userIcon from './assets/icons/male-user.png';

// Configuration mapping folder IDs to their retro path titles
const WINDOW_REGISTRY = {
  profile: {
    title: 'C:\\PORTFOLIO\\profile',
  },
  works: {
    title: 'C:\\PORTFOLIO\\works',
  },
  contact: {
    title: 'C:\\PORTFOLIO\\contact',
  },
  resume: {
    title: 'C:\\PORTFOLIO\\resume',
  },
  terminal: {
    title: 'C:\\PORTFOLIO\\terminal.exe (bash)',
  },
};

/**
 * Calculates Windows OS-style tiling coordinates for open windows.
 * Windows are placed side-by-side or in master-stack grids, ensuring
 * that desktop shortcuts and taskbar remain visible and accessible.
 *
 * @param {number} index - Index of current window in openWindows array
 * @param {number} total - Total open windows count
 * @param {number} windowWidth - Viewport width in pixels
 * @param {number} windowHeight - Viewport height in pixels
 * @returns {object} Layout geometry { left, top, width, height }
 */
function getTileLayout(index, total, windowWidth, windowHeight) {
  // Margins to preserve space for left shortcuts, right shortcuts, and bottom dock
  const leftMargin = windowWidth > 1200 ? 130 : 90;
  const rightMargin = windowWidth > 1200 ? 130 : 90;
  const topMargin = 28;
  const bottomMargin = 138; // taskbar clearance

  const availableWidth = Math.max(300, windowWidth - leftMargin - rightMargin);
  const availableHeight = Math.max(200, windowHeight - topMargin - bottomMargin);

  // Mobile & Tablet (< 860px): Stacked responsive cards
  if (windowWidth < 860) {
    const cascade = Math.min(index * 16, 48);
    return {
      left: 12,
      top: 16 + cascade,
      width: Math.max(280, windowWidth - 24),
      height: Math.min(500, windowHeight - 160),
    };
  }

  // 1 Window: Cleanly centered in the middle of the desktop
  if (total === 1) {
    const width = Math.min(650, availableWidth);
    const height = Math.min(610, availableHeight);
    return {
      left: Math.round(leftMargin + (availableWidth - width) / 2),
      top: Math.round(topMargin + (availableHeight - height) / 2),
      width,
      height,
    };
  }

  // 2 Windows (Windows Snap 50/50 side-by-side split):
  if (total === 2) {
    const gap = 16;
    const width = Math.floor((availableWidth - gap) / 2);
    const height = Math.min(540, availableHeight);
    const top = Math.round(topMargin + (availableHeight - height) / 2);
    const left = index === 0 ? leftMargin : leftMargin + width + gap;

    return { left, top, width, height };
  }

  // 3 Windows (Master on left, 2 stacked on right):
  if (total === 3) {
    const gap = 14;
    const colWidth = Math.floor((availableWidth - gap) / 2);
    const fullHeight = Math.min(540, availableHeight);
    const halfHeight = Math.floor((fullHeight - gap) / 2);
    const topBase = Math.round(topMargin + (availableHeight - fullHeight) / 2);

    if (index === 0) {
      // Left master
      return {
        left: leftMargin,
        top: topBase,
        width: colWidth,
        height: fullHeight,
      };
    }
    if (index === 1) {
      // Right top
      return {
        left: leftMargin + colWidth + gap,
        top: topBase,
        width: colWidth,
        height: halfHeight,
      };
    }
    // Right bottom
    return {
      left: leftMargin + colWidth + gap,
      top: topBase + halfHeight + gap,
      width: colWidth,
      height: halfHeight,
    };
  }

  // 4 or more Windows (2x2 Quadrant Grid):
  const gap = 14;
  const colWidth = Math.floor((availableWidth - gap) / 2);
  const fullHeight = Math.min(540, availableHeight);
  const rowHeight = Math.floor((fullHeight - gap) / 2);
  const topBase = Math.round(topMargin + (availableHeight - fullHeight) / 2);

  const isLeftCol = index % 2 === 0;
  const isTopRow = index < 2;

  return {
    left: isLeftCol ? leftMargin : leftMargin + colWidth + gap,
    top: isTopRow ? topBase : topBase + rowHeight + gap,
    width: colWidth,
    height: rowHeight,
  };
}

function App() {
  // First-visit intro detection: checked synchronously from localStorage
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem('prashant_portfolio_boot_seen') !== 'true';
    } catch {
      return false;
    }
  });

  // Controls whether the desktop is currently executing its staggered entrance animation
  const [isDesktopEntering, setIsDesktopEntering] = useState(false);

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('prashant_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('prashant_theme', theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Array of open window IDs (e.g. ['profile', 'works'])
  const [openWindows, setOpenWindows] = useState([]);

  // ID of the currently focused/active window
  const [activeWindowId, setActiveWindowId] = useState(null);

  // Screen coordinates map for originating folder icons { [windowId]: { x, y } }
  const [originRects, setOriginRects] = useState({});

  // Dynamic folder icon sizing: 'small' (50px), 'medium' (64px), 'large' (80px)
  const [folderIconSize, setFolderIconSize] = useState('medium');

  // Viewport tracking for dynamic tiling recalculation
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Track window resize events
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Completes the terminal intro and triggers the staggered desktop entrance.
   */
  const handleTerminalComplete = useCallback(() => {
    setShowIntro(false);
    setIsDesktopEntering(true);

    setTimeout(() => {
      setIsDesktopEntering(false);
    }, prefersReducedMotion ? 0 : 500);
  }, [prefersReducedMotion]);

  /**
   * Replays the terminal boot intro on demand.
   */
  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  /**
   * Opens a window or brings it to the front if already open.
   * Records the originating icon's screen position for the macOS zoom animation.
   *
   * @param {string} windowId - Target window ID
   * @param {object} [rect] - Center coordinates { x, y, width, height } of clicked icon
   */
  const handleOpenWindow = (windowId, rect) => {
    if (rect) {
      setOriginRects((prev) => ({ ...prev, [windowId]: rect }));
    }

    if (openWindows.includes(windowId)) {
      // Window is already open -> bring it to front
      setActiveWindowId(windowId);
    } else {
      // Open new window and make it active
      setOpenWindows((prev) => [...prev, windowId]);
      setActiveWindowId(windowId);
    }
  };

  /**
   * Closes a window by removing it from the openWindows list.
   * Preserves originRect so the exit animation shrinks back to the originating icon.
   */
  const handleCloseWindow = (windowId) => {
    setOpenWindows((prev) => prev.filter((id) => id !== windowId));

    // If the active window was closed, focus the last remaining open window
    setActiveWindowId((currentActive) => {
      if (currentActive === windowId) {
        const remaining = openWindows.filter((id) => id !== windowId);
        return remaining.length > 0 ? remaining[remaining.length - 1] : null;
      }
      return currentActive;
    });
  };

  /**
   * Brings a clicked window to the top layer.
   */
  const handleFocusWindow = (windowId) => {
    setActiveWindowId(windowId);
  };

  // Keyboard shortcut (Ctrl+Alt+T) to replay terminal boot sequence
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleReplayIntro();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  /**
   * Renders the corresponding content for each open window
   */
  const getWindowContent = (windowId) => {
    switch (windowId) {
      case 'profile':
        return <About />;
      case 'works':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'resume':
        return <ResumeContent />;
      case 'terminal':
        return (
          <TerminalAppContent
            onOpenWindow={(target) => handleOpenWindow(target)}
            onCloseWindow={(target) => handleCloseWindow(target)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="desktop">
      {/* PHASE 2: Terminal Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <TerminalIntro onComplete={handleTerminalComplete} />
        )}
      </AnimatePresence>

      {/* PHASE 3: Desktop Workspace with Staggered Entrance */}
      <main className="desktop-workspace">
        {/* Top OS System Status Bar with Folder Size & Theme Controls */}
        <Navbar
          folderIconSize={folderIconSize}
          onFolderSizeChange={setFolderIconSize}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Left Column: Profile and Works */}
        <motion.section
          className="icons-column icons-left"
          aria-label="Left Shortcuts"
          initial={isDesktopEntering && !prefersReducedMotion ? { x: -40, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <DesktopIcon
            label="profile"
            customIcon={userIcon}
            isOpen={openWindows.includes('profile')}
            iconSize={folderIconSize}
            onClick={(rect) => handleOpenWindow('profile', rect)}
          />
          <DesktopIcon
            label="works"
            isOpen={openWindows.includes('works')}
            iconSize={folderIconSize}
            onClick={(rect) => handleOpenWindow('works', rect)}
          />
        </motion.section>

        {/* Center: Retro PORTFOLIO Heading */}
        <Hero
          isDesktopEntering={isDesktopEntering}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Right Column: Contact and Resume */}
        <motion.section
          className="icons-column icons-right"
          aria-label="Right Shortcuts"
          initial={isDesktopEntering && !prefersReducedMotion ? { x: 40, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <DesktopIcon
            label="contact"
            isOpen={openWindows.includes('contact')}
            iconSize={folderIconSize}
            onClick={(rect) => handleOpenWindow('contact', rect)}
          />
          <DesktopIcon
            label="resume"
            isOpen={openWindows.includes('resume')}
            iconSize={folderIconSize}
            onClick={(rect) => handleOpenWindow('resume', rect)}
          />
        </motion.section>

        {/* PHASE 4 & 5: Windows OS-Style Tiling Layer with macOS Folder Zoom Transitions */}
        <AnimatePresence>
          {openWindows.map((windowId, index) => {
            const config = WINDOW_REGISTRY[windowId];
            if (!config) return null;

            const isActive = activeWindowId === windowId;
            const zIndex = isActive ? 100 : 50 + index;
            const tileLayout = getTileLayout(
              index,
              openWindows.length,
              windowSize.width,
              windowSize.height
            );
            const originRect = originRects[windowId] || null;

            return (
              <Window
                key={windowId}
                id={windowId}
                title={config.title}
                isActive={isActive}
                zIndex={zIndex}
                originRect={originRect}
                tileLayout={tileLayout}
                onClose={handleCloseWindow}
                onFocus={handleFocusWindow}
              >
                {getWindowContent(windowId)}
              </Window>
            );
          })}
        </AnimatePresence>
      </main>

      {/* Retro Bottom Taskbar with Terminal Launcher */}
      <motion.div
        initial={isDesktopEntering && !prefersReducedMotion ? { y: 35, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.44, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <Footer
          onOpenTerminal={(rect) => handleOpenWindow('terminal', rect)}
          onReplayIntro={handleReplayIntro}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </motion.div>
    </div>
  );
}

export default App;
