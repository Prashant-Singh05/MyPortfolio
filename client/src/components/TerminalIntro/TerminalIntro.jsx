import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import './TerminalIntro.css';

/**
 * TerminalIntro Component
 *
 * Fullscreen Linux/Unix TTY terminal inspired by fahru.me/home.
 * Features:
 * - Large ASCII Art banner for PRASHANT.
 * - Progressive typewriter greeting introduction.
 * - Interactive command prompt (guest@portfolio:~$ ).
 * - Arrow-key history navigation (Up / Down).
 * - Tab key autocompletion for commands and files.
 * - Built-in commands: 'help', 'startx', 'desktop', 'about', 'skills', 'projects', 'ls', 'cat', 'pwd', 'whoami', 'date', 'echo', 'neofetch', 'clear', 'reboot'.
 * - Instant desktop launch on ENTER or clicking 'startx' / 'Launch Desktop'.
 * - Persistent first-visit storage via localStorage.
 */
function TerminalIntro({ onComplete }) {
  const ASCII_BANNER = [
    '    ____  ____  ___   _____ __  _____    _   ________',
    '   / __ \\/ __ \\/   | / ___// / / /   |  / | / /_  __/',
    '  / /_/ / /_/ / /| | \\__ \\/ /_/ / /| | /  |/ / / /   ',
    ' / ____/ _, _/ ___ |___/ / __  / ___ |/ /|  / / /    ',
    '/_/   /_/ |_/_/  |_/____/_/ /_/_/  |_/_/ |_/ /_/     ',
  ].join('\n');

  const GREETING_LINES = [
    'Hello, my name is Prashant',
    "I'm a B.Tech CSE student & aspiring developer",
    'and this is my personal site',
    '. . .',
    'To see available commands',
    "type 'help' and hit ENTER or RETURN",
  ];

  const COMMAND_LIST = [
    'help', 'startx', 'desktop', 'about', 'skills', 'projects',
    'ls', 'dir', 'tree', 'cat', 'pwd', 'whoami', 'uname', 'uptime',
    'git', 'node', 'python', 'cal', 'date', 'echo', 'neofetch', 'clear', 'reboot'
  ];

  // State
  const [visibleGreetings, setVisibleGreetings] = useState(0);
  const [greetingDone, setGreetingDone] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [historyCommands, setHistoryCommands] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const exitGuardRef = useRef(false);

  // Check reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Transitions into the GUI Desktop environment.
   */
  const handleLaunchDesktop = useCallback(() => {
    if (exitGuardRef.current) return;
    exitGuardRef.current = true;
    setIsExiting(true);

    try {
      localStorage.setItem('prashant_portfolio_boot_seen', 'true');
    } catch {
      // Storage access might fail in private browsing
    }

    const timer = setTimeout(() => {
      onComplete();
    }, prefersReducedMotion ? 0 : 350);

    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  // Sequential reveal of greeting lines
  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleGreetings(GREETING_LINES.length);
      setGreetingDone(true);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleGreetings(current);
      if (current >= GREETING_LINES.length) {
        clearInterval(interval);
        setGreetingDone(true);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Keep input focused automatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [greetingDone]);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleGreetings, commandHistory]);

  /**
   * Executes typed terminal commands
   */
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    const cmd = rawCmd.toLowerCase();

    // If user presses ENTER on empty command, or types startx / desktop / gui -> launch desktop
    if (!cmd || cmd === 'startx' || cmd === 'desktop' || cmd === 'gui' || cmd === 'launch') {
      handleLaunchDesktop();
      return;
    }

    setHistoryCommands((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const parts = rawCmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const argStr = parts.slice(1).join(' ');

    let response = null;

    if (mainCmd === 'help') {
      response = (
        <div className="terminal-cmd-output">
          <p className="help-heading">Available commands:</p>
          <div className="help-grid">
            <span className="help-cmd">startx</span>
            <span className="help-desc">access GUI / desktop (or hit ENTER)</span>
            <span className="help-cmd">desktop</span>
            <span className="help-desc">access GUI / desktop</span>
            <span className="help-cmd">ls, dir</span>
            <span className="help-desc">list directory contents</span>
            <span className="help-cmd">tree</span>
            <span className="help-desc">display directory hierarchy</span>
            <span className="help-cmd">cat &lt;file&gt;</span>
            <span className="help-desc">view file contents (README.md, skills.txt)</span>
            <span className="help-cmd">about</span>
            <span className="help-desc">about Prashant Singh</span>
            <span className="help-cmd">skills</span>
            <span className="help-desc">technical proficiencies</span>
            <span className="help-cmd">projects</span>
            <span className="help-desc">featured works</span>
            <span className="help-cmd">git status</span>
            <span className="help-desc">git repository status</span>
            <span className="help-cmd">node, python</span>
            <span className="help-desc">runtime environment versions</span>
            <span className="help-cmd">cal</span>
            <span className="help-desc">display current calendar</span>
            <span className="help-cmd">neofetch</span>
            <span className="help-desc">system & specs info</span>
            <span className="help-cmd">whoami</span>
            <span className="help-desc">display active user</span>
            <span className="help-cmd">uname, uptime</span>
            <span className="help-desc">kernel & system uptime</span>
            <span className="help-cmd">pwd</span>
            <span className="help-desc">print working directory</span>
            <span className="help-cmd">clear</span>
            <span className="help-desc">clear the terminal</span>
            <span className="help-cmd">reboot</span>
            <span className="help-desc">restart the terminal</span>
            <span className="help-cmd">help</span>
            <span className="help-desc">getting this help</span>
          </div>
        </div>
      );
    } else if (mainCmd === 'ls' || mainCmd === 'dir') {
      response = (
        <div className="terminal-cmd-output">
          <p style={{ color: '#58a6ff', fontWeight: 700 }}>
            profile/ &nbsp;&nbsp; works/ &nbsp;&nbsp; contact/ &nbsp;&nbsp; resume/ &nbsp;&nbsp;
            <span style={{ color: '#e6edf3', fontWeight: 400 }}>README.md &nbsp;&nbsp; skills.txt</span>
          </p>
        </div>
      );
    } else if (mainCmd === 'cat') {
      if (!argStr) {
        response = <p className="cmd-error">cat: missing file name (e.g. 'cat README.md')</p>;
      } else if (argStr.toLowerCase() === 'readme.md') {
        response = (
          <div className="terminal-cmd-output">
            <p className="cmd-highlight"># Prashant Singh - Full Stack Developer</p>
            <p>B.Tech in Computer Science and Engineering (CSE).</p>
            <p>Interactive portfolio with tiling window management, React 19, and Vite.</p>
          </div>
        );
      } else if (argStr.toLowerCase() === 'skills.txt') {
        response = (
          <div className="terminal-cmd-output">
            <p className="cmd-highlight">Technical Proficiencies:</p>
            <p>&bull; React 19, Vite, JavaScript (ES6+), HTML5, CSS3, Motion</p>
            <p>&bull; Node.js, Express.js, MongoDB, Mongoose, RESTful APIs</p>
          </div>
        );
      } else {
        response = <p className="cmd-error">cat: {argStr}: No such file or directory</p>;
      }
    } else if (mainCmd === 'about') {
      response = (
        <div className="terminal-cmd-output">
          <p className="cmd-highlight">Prashant Singh</p>
          <p>B.Tech in Computer Science and Engineering (CSE)</p>
          <p>Student & Aspiring Developer passionate about modern full-stack web applications and interactive OS experiences.</p>
        </div>
      );
    } else if (mainCmd === 'skills') {
      response = (
        <div className="terminal-cmd-output">
          <p className="cmd-highlight">Core Proficiencies:</p>
          <p>&bull; Frontend: React.js, Vite, HTML5, CSS3, JavaScript (ES6+), Motion</p>
          <p>&bull; Backend:  Node.js, Express.js, RESTful APIs</p>
          <p>&bull; Database: MongoDB, Mongoose</p>
          <p>&bull; Core:     Data Structures, Algorithms, Git & GitHub, Linux/Bash</p>
        </div>
      );
    } else if (mainCmd === 'projects') {
      response = (
        <div className="terminal-cmd-output">
          <p className="cmd-highlight">Featured Projects:</p>
          <p>1. Retro Desktop Portfolio - Interactive OS with tiling window management</p>
          <p>2. Task Management Engine - MERN full-stack collaboration workspace</p>
          <p>3. Document & Resume Generator - Backend PDF/DOCX compilation pipeline</p>
        </div>
      );
    } else if (mainCmd === 'tree') {
      response = (
        <div className="terminal-cmd-output">
          <p style={{ color: '#8b949e', margin: 0 }}>.</p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>├── <span style={{ color: '#58a6ff', fontWeight: 700 }}>profile/</span></p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>├── <span style={{ color: '#58a6ff', fontWeight: 700 }}>works/</span></p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>├── <span style={{ color: '#58a6ff', fontWeight: 700 }}>contact/</span></p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>├── <span style={{ color: '#58a6ff', fontWeight: 700 }}>resume/</span></p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>├── README.md</p>
          <p style={{ color: '#8b949e', margin: '2px 0' }}>└── skills.txt</p>
          <p style={{ color: '#6e7681', marginTop: '6px' }}>4 directories, 2 files</p>
        </div>
      );
    } else if (mainCmd === 'pwd') {
      response = <p className="terminal-cmd-output">/home/prashant/portfolio</p>;
    } else if (mainCmd === 'whoami') {
      response = <p className="terminal-cmd-output">prashant (guest)</p>;
    } else if (mainCmd === 'uname') {
      response = <p className="terminal-cmd-output">Linux prashant-portfolio 6.8.0-generic #45-Ubuntu x86_64 GNU/Linux</p>;
    } else if (mainCmd === 'uptime') {
      response = <p className="terminal-cmd-output">02:40:00 up 42 days, 3:14, 1 user, load average: 0.08, 0.04, 0.01</p>;
    } else if (mainCmd === 'git') {
      if (argStr === 'status') {
        response = (
          <div className="terminal-cmd-output">
            <p style={{ color: '#7ee787' }}>On branch main</p>
            <p style={{ color: '#8b949e' }}>nothing to commit, working tree clean</p>
          </div>
        );
      } else {
        response = <p className="terminal-cmd-output">git version 2.44.0.windows.1 (type 'git status')</p>;
      }
    } else if (mainCmd === 'node') {
      response = <p className="terminal-cmd-output">v20.12.2</p>;
    } else if (mainCmd === 'python' || mainCmd === 'python3') {
      response = <p className="terminal-cmd-output">Python 3.12.3</p>;
    } else if (mainCmd === 'cal') {
      const now = new Date();
      response = (
        <pre className="terminal-cmd-output" style={{ color: '#79c0ff', margin: 0 }}>
{`    October 2026
Su Mo Tu We Th Fr Sa
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31`}
        </pre>
      );
    } else if (mainCmd === 'date') {
      response = <p className="terminal-cmd-output">{new Date().toLocaleString()}</p>;
    } else if (mainCmd === 'echo') {
      response = <p className="terminal-cmd-output">{argStr}</p>;
    } else if (mainCmd === 'neofetch') {
      response = (
        <div className="terminal-cmd-output" style={{ display: 'flex', gap: '20px' }}>
          <pre style={{ margin: 0, color: '#7ee787', fontWeight: 700 }}>
{`       /\\
      /  \\
     / /\\ \\
    / /__\\ \\
   / /____\\ \\
  /_/      \\_\\`}
          </pre>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#79c0ff' }}>prashant@portfolio</p>
            <p style={{ margin: '2px 0', color: '#484f58' }}>------------------</p>
            <p style={{ margin: 0 }}>OS: PrashantOS Web Desktop</p>
            <p style={{ margin: 0 }}>Degree: B.Tech CSE (Class of 2026)</p>
            <p style={{ margin: 0 }}>Kernel: React 19.2.8 + Vite 8</p>
            <p style={{ margin: 0 }}>Shell: WebCLI v1.2</p>
          </div>
        </div>
      );
    } else if (mainCmd === 'clear') {
      setCommandHistory([]);
      setInputVal('');
      return;
    } else if (mainCmd === 'reboot') {
      setCommandHistory([]);
      setVisibleGreetings(0);
      setGreetingDone(false);
      setInputVal('');
      return;
    } else {
      response = (
        <div className="terminal-cmd-output">
          <p className="cmd-error">command not found: {rawCmd}</p>
          <p>Type <span className="cmd-highlight">'help'</span> for available commands or hit <span className="cmd-highlight">ENTER</span> to start GUI.</p>
        </div>
      );
    }

    setCommandHistory((prev) => [
      ...prev,
      { cmd: rawCmd, output: response },
    ]);
    setInputVal('');
  };

  /**
   * Keyboard Navigation (Up / Down History & Tab Autocomplete)
   */
  const handleKeyDown = (e) => {
    // Arrow Up: Previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyCommands.length === 0) return;
      const nextIdx = historyIndex === -1 ? historyCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(historyCommands[nextIdx] || '');
      return;
    }

    // Arrow Down: Next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= historyCommands.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(historyCommands[nextIdx] || '');
      }
      return;
    }

    // Tab: Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = COMMAND_LIST.find((c) => c.startsWith(current));
      if (match) {
        setInputVal(match + ' ');
      }
      return;
    }

    // Ctrl + L: Clear terminal
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setCommandHistory([]);
      return;
    }

    // Escape: Skip to desktop
    if (e.key === 'Escape') {
      e.preventDefault();
      handleLaunchDesktop();
    }
  };

  return (
    <div
      className={`fahru-terminal-screen ${isExiting ? 'fahru-terminal-exiting' : ''}`}
      onClick={() => inputRef.current?.focus()}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Terminal"
    >
      <motion.div
        className="fahru-terminal-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.98 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      >
        {/* Top Action Bar for Quick Access */}
        <div className="terminal-top-bar">
          <span className="terminal-status-tag">TTY1 &bull; PORTFOLIO SHELL</span>
          <div className="terminal-quick-actions">
            <button
              type="button"
              className="quick-action-btn"
              onClick={handleLaunchDesktop}
              title="Launch GUI Desktop (Enter)"
            >
              Start Desktop [ENTER ↵]
            </button>
            <button
              type="button"
              className="quick-action-btn"
              onClick={handleLaunchDesktop}
              title="Skip animation (Esc)"
            >
              Skip [Esc]
            </button>
          </div>
        </div>

        {/* ASCII Art Banner */}
        <pre className="ascii-banner" aria-label="PRASHANT ASCII Art">
          {ASCII_BANNER}
        </pre>

        {/* Greeting Sequence */}
        <div className="greeting-block">
          {GREETING_LINES.slice(0, visibleGreetings).map((line, idx) => (
            <p key={idx} className="greeting-line">
              {line}
            </p>
          ))}
        </div>

        {/* Executed Command History */}
        {commandHistory.map((item, index) => (
          <div key={index} className="history-item">
            <div className="prompt-row">
              <span className="prompt-label">guest@portfolio:~$</span>
              <span className="prompt-cmd">{item.cmd}</span>
            </div>
            {item.output}
          </div>
        ))}

        {/* Active Command Prompt Line */}
        <form className="active-prompt-form" onSubmit={handleCommandSubmit}>
          <label htmlFor="terminal-cli-input" className="prompt-label">
            guest@portfolio:~$
          </label>
          <div className="input-with-caret">
            <input
              id="terminal-cli-input"
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-real-input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
            <span className="rendered-text">{inputVal}</span>
            <span className="blinking-block-caret" aria-hidden="true" />
          </div>
        </form>

        <div ref={terminalEndRef} />
      </motion.div>
    </div>
  );
}

export default TerminalIntro;
