import { useState } from 'react';
import './App.css';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import BottomBar from './components/BottomBar/BottomBar';
import Window from './components/Window/Window';
import ProfileContent from './components/Window/content/ProfileContent';
import WorksContent from './components/Window/content/WorksContent';
import ContactContent from './components/Window/content/ContactContent';
import ResumeContent from './components/Window/content/ResumeContent';
import userIcon from './assets/icons/male-user.png';

// Configuration mapping folder IDs to their retro path titles and content
const WINDOW_REGISTRY = {
  profile: {
    title: 'C:\\PORTFOLIO\\profile',
    content: <ProfileContent />,
  },
  works: {
    title: 'C:\\PORTFOLIO\\works',
    content: <WorksContent />,
  },
  contact: {
    title: 'C:\\PORTFOLIO\\contact',
    content: <ContactContent />,
  },
  resume: {
    title: 'C:\\PORTFOLIO\\resume',
    content: <ResumeContent />,
  },
};

function App() {
  // Array of open window IDs (e.g. ['profile', 'works'])
  const [openWindows, setOpenWindows] = useState([]);
  
  // ID of the currently focused/active window
  const [activeWindowId, setActiveWindowId] = useState(null);

  /**
   * Opens a window or brings it to the front if already open.
   */
  const handleOpenWindow = (windowId) => {
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

  return (
    <div className="desktop">
      {/* Upper desktop workspace containing shortcuts, central heading, and floating windows */}
      <main className="desktop-workspace">
        {/* Left Column: Profile and Works */}
        <section className="icons-column icons-left" aria-label="Left Shortcuts">
          <DesktopIcon
            label="profile"
            customIcon={userIcon}
            onClick={() => handleOpenWindow('profile')}
          />
          <DesktopIcon
            label="works"
            onClick={() => handleOpenWindow('works')}
          />
        </section>

        {/* Center: Retro PORTFOLIO Heading */}
        <header className="portfolio-header">
          <h1 className="portfolio-heading">PORTFOLIO</h1>
        </header>

        {/* Right Column: Contact and Resume */}
        <section className="icons-column icons-right" aria-label="Right Shortcuts">
          <DesktopIcon
            label="contact"
            onClick={() => handleOpenWindow('contact')}
          />
          <DesktopIcon
            label="resume"
            onClick={() => handleOpenWindow('resume')}
          />
        </section>

        {/* Floating Desktop Windows Layer */}
        {openWindows.map((windowId, index) => {
          const config = WINDOW_REGISTRY[windowId];
          if (!config) return null;

          const isActive = activeWindowId === windowId;
          // Active window gets highest z-index (100), others layered by their open order
          const zIndex = isActive ? 100 : 50 + index;

          return (
            <Window
              key={windowId}
              id={windowId}
              title={config.title}
              isActive={isActive}
              zIndex={zIndex}
              offsetIndex={index}
              onClose={handleCloseWindow}
              onFocus={handleFocusWindow}
            >
              {config.content}
            </Window>
          );
        })}
      </main>

      {/* Retro Bottom Taskbar */}
      <BottomBar />
    </div>
  );
}

export default App;
