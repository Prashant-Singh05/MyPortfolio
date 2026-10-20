import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import './Window.css';

/**
 * Reusable Retro Desktop Window Component
 *
 * Implements:
 * - Windows OS-style titlebar controls (Minimize, Maximize/Restore, Close).
 * - Interactive corner drag resizing and native CSS resize.
 * - Draggable titlebar (double-click to maximize/restore).
 * - macOS-inspired origin-aware folder-to-window zoom animation.
 * - Dynamic tiling window manager coordinate placement.
 */
function Window({
  id,
  title,
  isActive = false,
  zIndex = 50,
  originRect = null,
  tileLayout = null,
  onClose,
  onFocus,
  children,
}) {
  const windowRef = useRef(null);

  // Window state: custom size and custom position when user resizes or drags
  const [customSize, setCustomSize] = useState(null);
  const [customPos, setCustomPos] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Track viewport dimensions
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compute target layout dimensions and coordinates
  const windowWidth = viewport.width;
  const windowHeight = viewport.height;

  const targetLeft = isMaximized
    ? 16
    : (customPos?.left ?? tileLayout?.left ?? Math.round((windowWidth - 620) / 2));

  const targetTop = isMaximized
    ? 16
    : (customPos?.top ?? tileLayout?.top ?? Math.round((windowHeight - 500) / 2));

  const targetWidth = isMaximized
    ? Math.max(300, windowWidth - 32)
    : (customSize?.width ?? tileLayout?.width ?? Math.min(620, windowWidth - 32));

  const targetHeight = isMaximized
    ? Math.max(200, windowHeight - 144)
    : (customSize?.height ?? tileLayout?.height ?? Math.min(500, windowHeight - 160));

  // Compute center delta for macOS-style folder zoom transition
  const finalCenterX = targetLeft + targetWidth / 2;
  const finalCenterY = targetTop + targetHeight / 2;

  let deltaX = 0;
  let deltaY = 30;

  if (originRect) {
    deltaX = originRect.x - finalCenterX;
    deltaY = originRect.y - finalCenterY;
  }

  // Animation variants
  const initialVariant = prefersReducedMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.12,
        x: deltaX,
        y: deltaY,
      };

  const animateVariant = prefersReducedMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      };

  const exitVariant = prefersReducedMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.12,
        x: deltaX,
        y: deltaY,
      };

  // Bring window to front
  const handleWindowClick = (e) => {
    e.stopPropagation();
    if (onFocus) {
      onFocus(id);
    }
  };

  // Close window
  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(id);
    }
  };

  // Toggle Maximize / Restore
  const handleMaximizeToggle = (e) => {
    e?.stopPropagation();
    setIsMaximized((prev) => !prev);
    if (onFocus) onFocus(id);
  };

  // Minimize (closes or hides window)
  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(id);
    }
  };

  // Draggable Titlebar (Windows OS behavior)
  const handleTitleBarMouseDown = (e) => {
    // Left click only, ignore when clicking action buttons
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    if (onFocus) onFocus(id);

    // If maximized, dragging restores first
    let currentX = targetLeft;
    let currentY = targetTop;
    if (isMaximized) {
      setIsMaximized(false);
      currentX = Math.max(10, Math.min(windowWidth - 400, e.clientX - 200));
      currentY = Math.max(10, e.clientY - 20);
      setCustomPos({ left: currentX, top: currentY });
    }

    setIsDragging(true);
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const initialLeft = currentX;
    const initialTop = currentY;

    const handleMouseMove = (moveEvent) => {
      const nextLeft = initialLeft + (moveEvent.clientX - startMouseX);
      const nextTop = initialTop + (moveEvent.clientY - startMouseY);

      // Keep titlebar within viewport bounds
      const clampedLeft = Math.max(-targetWidth + 80, Math.min(windowWidth - 80, nextLeft));
      const clampedTop = Math.max(0, Math.min(windowHeight - 80, nextTop));

      setCustomPos({ left: clampedLeft, top: clampedTop });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Interactive Bottom-Right Corner Resize Handle
  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFocus) onFocus(id);

    setIsResizing(true);
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const initialWidth = targetWidth;
    const initialHeight = targetHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaW = moveEvent.clientX - startMouseX;
      const deltaH = moveEvent.clientY - startMouseY;

      const nextWidth = Math.max(280, Math.min(windowWidth - targetLeft - 10, initialWidth + deltaW));
      const nextHeight = Math.max(180, Math.min(windowHeight - targetTop - 120, initialHeight + deltaH));

      setCustomSize({ width: Math.round(nextWidth), height: Math.round(nextHeight) });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const isTerminal = id === 'terminal';
  const isSettings = id === 'settings';

  return (
    <motion.div
      ref={windowRef}
      className={`retro-window ${isTerminal ? 'retro-window-terminal' : ''} ${
        isActive ? 'retro-window-active' : ''
      } ${isDragging ? 'retro-window-dragging' : ''} ${
        isResizing ? 'retro-window-resizing' : ''
      }`}
      style={{
        zIndex: isActive ? 100 : zIndex,
        left: `${targetLeft}px`,
        top: `${targetTop}px`,
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        position: 'absolute',
      }}
      initial={initialVariant}
      animate={animateVariant}
      exit={exitVariant}
      transition={
        prefersReducedMotion
          ? { duration: 0.05 }
          : {
              type: 'spring',
              damping: 24,
              stiffness: 280,
              mass: 0.82,
            }
      }
      onClick={handleWindowClick}
      role="dialog"
      aria-labelledby={`window-title-${id}`}
    >
      {/* Retro Title Bar with Windows OS Controls */}
      <div
        className="retro-window-titlebar"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleMaximizeToggle}
        title="Drag to move, double-click to maximize/restore"
      >
        <span className="retro-window-title" id={`window-title-${id}`}>
          {title}
        </span>

        {/* Windows OS 3-Button Controls (Minimize, Maximize/Restore, Close) */}
        <div className="retro-window-controls" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="retro-window-btn retro-window-min-btn"
            onClick={handleMinimizeClick}
            aria-label={`Minimize ${title}`}
            title="Minimize"
          >
            _
          </button>
          <button
            type="button"
            className="retro-window-btn retro-window-max-btn"
            onClick={handleMaximizeToggle}
            aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            type="button"
            className="retro-window-btn retro-window-close-btn"
            onClick={handleCloseClick}
            aria-label={`Close ${title}`}
            title="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Window Interior Content */}
      <motion.div
        className={`retro-window-body ${isTerminal ? 'retro-window-body-terminal' : ''} ${
          isSettings ? 'retro-window-body-settings' : ''
        }`}
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.08, duration: 0.18 }}
      >
        {children}
      </motion.div>

      {/* Interactive Bottom-Right Corner Resize Grip Handle */}
      {!isMaximized && (
        <div
          className="retro-window-resize-handle"
          onMouseDown={handleResizeStart}
          title="Drag to resize window"
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" className="resize-grip-svg">
            <line x1="14" y1="2" x2="2" y2="14" stroke="#72775f" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="14" y1="6" x2="6" y2="14" stroke="#72775f" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="14" y1="10" x2="10" y2="14" stroke="#72775f" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default Window;
