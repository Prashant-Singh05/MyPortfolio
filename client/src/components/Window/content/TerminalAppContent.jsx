import React, { useState, useRef, useEffect } from 'react';
import './TerminalAppContent.css';

/**
 * TerminalAppContent Component
 *
 * A full-featured, realistic developer terminal window application.
 * Supports standard POSIX / Linux / Windows terminal commands:
 * - Navigation & Filesystem: ls (with -l, -a, -la flags), cd, pwd, cat, touch, mkdir, rm
 * - System Monitoring: uname, hostname, uptime, whoami, date, top, ps, df, free, ping, curl
 * - Portfolio Operations: open, start, close, neofetch, theme, history, clear, cls, help, man, exit
 * - Keystroke Features: ArrowUp / ArrowDown history, Tab autocompletion, Ctrl+L, Ctrl+C
 */
const renderNeofetchOutput = () => (
  <div className="neofetch-container">
    <pre className="neofetch-logo">
{`       /\\
      /  \\
     / /\\ \\
    / /__\\ \\
   / /____\\ \\
  /_/      \\_\\`}
    </pre>
    <div className="neofetch-info">
      <p className="neofetch-title">prashant@portfolio</p>
      <div className="neofetch-divider">------------------</div>
      <p><span className="neofetch-key">OS:</span> PrashantOS (Hyprland / Linux Desktop)</p>
      <p><span className="neofetch-key">Host:</span> Portfolio Workstation</p>
      <p><span className="neofetch-key">Kernel:</span> 6.8.0-generic x86_64</p>
      <p><span className="neofetch-key">Degree:</span> B.Tech CSE (Class of 2028)</p>
      <p><span className="neofetch-key">Framework:</span> React 19 + Vite 8</p>
      <p><span className="neofetch-key">Physics:</span> Motion (Spring Animations)</p>
      <p><span className="neofetch-key">Shell:</span> bash 5.2.21</p>
      <p><span className="neofetch-key">WM:</span> Hyprland / Wayland</p>
      <p><span className="neofetch-key">Uptime:</span> 100% Ready for Viva</p>
      <div className="neofetch-colors">
        <span className="color-box color-black" />
        <span className="color-box color-red" />
        <span className="color-box color-green" />
        <span className="color-box color-yellow" />
        <span className="color-box color-blue" />
        <span className="color-box color-magenta" />
        <span className="color-box color-cyan" />
        <span className="color-box color-white" />
      </div>
    </div>
  </div>
);

function TerminalAppContent({ onOpenWindow, onCloseWindow }) {
  const COMMAND_LIST = [
    'help', 'man', 'ls', 'dir', 'tree', 'cd', 'pwd', 'cat', 'grep', 'head', 'tail', 'wc',
    'find', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'git', 'node', 'npm', 'python', 'python3',
    'code', 'sudo', 'cal', 'env', 'printenv', 'which', 'where', 'calc', 'bc', 'matrix',
    'open', 'start', 'close', 'neofetch', 'fastfetch', 'whoami', 'uname',
    'hostname', 'uptime', 'date', 'top', 'ps', 'df', 'free', 'ping', 'curl',
    'echo', 'history', 'theme', 'clear', 'cls', 'reboot', 'exit'
  ];

  // Simulated virtual filesystem
  const [currentDir, setCurrentDir] = useState('~');
  const [fileSystem, setFileSystem] = useState({
    'profile': { type: 'dir', target: 'profile' },
    'works': { type: 'dir', target: 'works' },
    'contact': { type: 'dir', target: 'contact' },
    'resume': { type: 'dir', target: 'resume' },
    'README.md': {
      type: 'file',
      content: `# Prashant Singh - Portfolio Workspace\nB.Tech in Computer Science and Engineering (CSE).\nBuilt with React 19, Vite, CSS, and Motion physics.\nFeel free to explore via GUI or CLI.`
    },
    'skills.txt': {
      type: 'file',
      content: `[Languages]  HTML5, CSS3, JavaScript, TypeScript, Python, C\n[Frameworks] React.js, Next.js, Tailwind CSS, Bootstrap, Express.js, Node.js\n[Backend]    MySQL, RESTful APIs\n[Tools]      Git, GitHub, VS Code, Vite, npm, Vercel`
    },
    'package.json': {
      type: 'file',
      content: `{\n  "name": "prashant-singh-portfolio",\n  "version": "1.0.0",\n  "author": "Prashant Singh (B.Tech CSE)",\n  "institution": "JK Lakshmipat University, Jaipur",\n  "duration": "2024-2028"\n}`
    },
    'about.txt': {
      type: 'file',
      content: `Prashant Singh\nB.Tech in Computer Science and Engineering (2024–2028)\nJK Lakshmipat University, Jaipur (Rajasthan)\nFocused on software development, responsive web engineering, and scalable backend services.`
    }
  });

  const [inputVal, setInputVal] = useState('');
  const [themeMode, setThemeMode] = useState('default'); // 'default', 'matrix', 'amber', 'cyan'
  const [history, setHistory] = useState([
    {
      type: 'cmd',
      dir: '~',
      cmd: 'neofetch',
      output: renderNeofetchOutput(),
    },
  ]);

  const [enteredCommands, setEnteredCommands] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /**
   * Execute CLI Command
   */
  const executeCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { type: 'cmd', dir: currentDir, cmd: '', output: null }]);
      return;
    }

    setEnteredCommands((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const parts = trimmed.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const argStr = args.join(' ');

    let output = null;

    switch (cmd) {
      // 1. HELP & MANUAL
      case 'help':
        output = (
          <div className="cli-output-block">
            <p className="cli-heading">Essential POSIX & Portfolio Shell Commands:</p>
            <div className="cli-table">
              <span className="cli-col-cmd">ls, dir [-l -a]</span>
              <span className="cli-col-desc">List files/directories with detailed permissions</span>
              <span className="cli-col-cmd">tree</span>
              <span className="cli-col-desc">Display directory hierarchy as a tree</span>
              <span className="cli-col-cmd">cd &lt;dir&gt;</span>
              <span className="cli-col-desc">Change directory (e.g. cd works, cd ..)</span>
              <span className="cli-col-cmd">pwd</span>
              <span className="cli-col-desc">Print working directory</span>
              <span className="cli-col-cmd">cat &lt;file&gt;</span>
              <span className="cli-col-desc">Display file contents (e.g. cat README.md)</span>
              <span className="cli-col-cmd">grep &lt;text&gt; &lt;file&gt;</span>
              <span className="cli-col-desc">Search for text patterns inside files</span>
              <span className="cli-col-cmd">head, tail &lt;file&gt;</span>
              <span className="cli-col-desc">Display beginning or ending lines of a file</span>
              <span className="cli-col-cmd">wc &lt;file&gt;</span>
              <span className="cli-col-desc">Print line, word, and byte counts</span>
              <span className="cli-col-cmd">find [name]</span>
              <span className="cli-col-desc">Search files in virtual filesystem</span>
              <span className="cli-col-cmd">touch &lt;file&gt;</span>
              <span className="cli-col-desc">Create a new empty file</span>
              <span className="cli-col-cmd">mkdir &lt;dir&gt;</span>
              <span className="cli-col-desc">Create a new directory</span>
              <span className="cli-col-cmd">rm &lt;file&gt;</span>
              <span className="cli-col-desc">Remove a file or directory</span>
              <span className="cli-col-cmd">cp, mv &lt;src&gt; &lt;dst&gt;</span>
              <span className="cli-col-desc">Copy or move/rename files</span>
              <span className="cli-col-cmd">git &lt;subcommand&gt;</span>
              <span className="cli-col-desc">Git repository status, log, branch, diff</span>
              <span className="cli-col-cmd">node, npm, python</span>
              <span className="cli-col-desc">Developer environment runtimes & versions</span>
              <span className="cli-col-cmd">code [path]</span>
              <span className="cli-col-desc">Launch Visual Studio Code workspace</span>
              <span className="cli-col-cmd">sudo &lt;cmd&gt;</span>
              <span className="cli-col-desc">Execute command with superuser privileges</span>
              <span className="cli-col-cmd">cal</span>
              <span className="cli-col-desc">Display calendar of current month</span>
              <span className="cli-col-cmd">env, printenv</span>
              <span className="cli-col-desc">Print shell environment variables</span>
              <span className="cli-col-cmd">which &lt;cmd&gt;</span>
              <span className="cli-col-desc">Locate a command in PATH</span>
              <span className="cli-col-cmd">calc &lt;expr&gt;</span>
              <span className="cli-col-desc">Evaluate math expression (e.g. calc 24 * 7)</span>
              <span className="cli-col-cmd">matrix</span>
              <span className="cli-col-desc">Toggle Matrix green terminal rain</span>
              <span className="cli-col-cmd">open &lt;app&gt;</span>
              <span className="cli-col-desc">Launch GUI window (profile, works, contact, resume)</span>
              <span className="cli-col-cmd">close &lt;app&gt;</span>
              <span className="cli-col-desc">Close a GUI window</span>
              <span className="cli-col-cmd">neofetch</span>
              <span className="cli-col-desc">Show developer hardware & OS specs</span>
              <span className="cli-col-cmd">whoami</span>
              <span className="cli-col-desc">Display active user identity</span>
              <span className="cli-col-cmd">uname -a</span>
              <span className="cli-col-desc">Print operating system and kernel info</span>
              <span className="cli-col-cmd">uptime</span>
              <span className="cli-col-desc">Show system uptime</span>
              <span className="cli-col-cmd">top, ps</span>
              <span className="cli-col-desc">List active system processes</span>
              <span className="cli-col-cmd">df, free</span>
              <span className="cli-col-desc">Disk and memory usage stats</span>
              <span className="cli-col-cmd">ping &lt;host&gt;</span>
              <span className="cli-col-desc">Send ICMP packets (e.g. ping google.com)</span>
              <span className="cli-col-cmd">curl &lt;url&gt;</span>
              <span className="cli-col-desc">Fetch endpoint or mock API response</span>
              <span className="cli-col-cmd">echo &lt;msg&gt;</span>
              <span className="cli-col-desc">Print text (supports $USER, $SHELL, $HOME)</span>
              <span className="cli-col-cmd">theme &lt;name&gt;</span>
              <span className="cli-col-desc">Change theme: default, matrix, amber, cyan</span>
              <span className="cli-col-cmd">history</span>
              <span className="cli-col-desc">Show command history</span>
              <span className="cli-col-cmd">clear, cls</span>
              <span className="cli-col-desc">Clear the terminal screen</span>
              <span className="cli-col-cmd">exit</span>
              <span className="cli-col-desc">Close this terminal application</span>
            </div>
          </div>
        );
        break;

      case 'man':
        if (!argStr) {
          output = <p className="cli-error">What manual page do you want? Example: 'man ls'</p>;
        } else {
          output = (
            <div className="cli-output-block">
              <p className="cli-highlight">MANUAL PAGE: {argStr.toUpperCase()}(1)</p>
              <p>NAME: {argStr} - standard command line utility for PrashantOS</p>
              <p>DESCRIPTION: Built-in shell utility providing interactive terminal controls.</p>
            </div>
          );
        }
        break;

      // 2. FILESYSTEM NAVIGATION & MANIPULATION
      case 'pwd':
        output = <p className="cli-output-msg">/home/prashant/portfolio{currentDir === '~' ? '' : '/' + currentDir.replace('~/', '')}</p>;
        break;

      case 'cd':
        if (!argStr || argStr === '~' || argStr === '/' || argStr === '..') {
          setCurrentDir('~');
          output = null;
        } else {
          const target = argStr.replace(/\/$/, '').toLowerCase();
          if (fileSystem[target] && fileSystem[target].type === 'dir') {
            setCurrentDir(`~/${target}`);
            output = null;
          } else {
            output = <p className="cli-error">cd: {argStr}: No such file or directory</p>;
          }
        }
        break;

      case 'tree':
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">.</p>
            {Object.entries(fileSystem).map(([name, item], idx, arr) => {
              const isLast = idx === arr.length - 1;
              const branch = isLast ? '└── ' : '├── ';
              return (
                <p key={name} className="cli-dim" style={{ margin: '1px 0' }}>
                  {branch}
                  <span className={item.type === 'dir' ? 'file-dir' : 'file-txt'}>
                    {name}{item.type === 'dir' ? '/' : ''}
                  </span>
                </p>
              );
            })}
            <p className="cli-dim" style={{ marginTop: '6px' }}>
              {Object.values(fileSystem).filter(i => i.type === 'dir').length} directories,{' '}
              {Object.values(fileSystem).filter(i => i.type === 'file').length} files
            </p>
          </div>
        );
        break;

      case 'ls':
      case 'dir':
        const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');

        if (isLong) {
          output = (
            <div className="cli-output-block">
              <p className="cli-dim">total {Object.keys(fileSystem).length * 4}</p>
              {showAll && (
                <>
                  <p className="cli-dim">drwxr-xr-x  8 prashant staff   256 Oct 18 02:40 .</p>
                  <p className="cli-dim">drwxr-xr-x 12 prashant staff   384 Oct 18 01:00 ..</p>
                  <p className="cli-dim">-rw-r--r--  1 prashant staff    42 Oct 18 01:15 .env</p>
                </>
              )}
              {Object.entries(fileSystem).map(([name, item]) => (
                <p key={name} className="cli-long-row">
                  <span className="cli-perm">{item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}</span>
                  <span className="cli-owner">1 prashant staff</span>
                  <span className="cli-size">{item.type === 'dir' ? ' 128B' : '1.4KB'}</span>
                  <span className="cli-date">Oct 18 02:30</span>
                  <span className={item.type === 'dir' ? 'file-dir' : 'file-txt'}>
                    {name}{item.type === 'dir' ? '/' : ''}
                  </span>
                </p>
              ))}
            </div>
          );
        } else {
          output = (
            <div className="cli-output-block">
              <div className="cli-files-grid">
                {showAll && <span className="cli-dim">. .. .env</span>}
                {Object.entries(fileSystem).map(([name, item]) => (
                  <span
                    key={name}
                    className={item.type === 'dir' ? 'file-dir' : 'file-txt'}
                  >
                    {name}{item.type === 'dir' ? '/' : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        break;

      case 'cat':
        if (!argStr) {
          output = <p className="cli-error">cat: missing file operand. Example: 'cat README.md'</p>;
        } else if (fileSystem[argStr]) {
          if (fileSystem[argStr].type === 'dir') {
            output = <p className="cli-error">cat: {argStr}: Is a directory. Use 'open {argStr}' to launch it.</p>;
          } else {
            output = (
              <pre className="cli-code-block">
                {fileSystem[argStr].content}
              </pre>
            );
          }
        } else {
          output = <p className="cli-error">cat: {argStr}: No such file or directory</p>;
        }
        break;

      case 'grep':
        if (args.length < 2) {
          output = <p className="cli-error">grep: missing PATTERN or FILE. Usage: grep &lt;pattern&gt; &lt;file&gt;</p>;
        } else {
          const pattern = args[0];
          const targetFile = args[1];
          if (!fileSystem[targetFile]) {
            output = <p className="cli-error">grep: {targetFile}: No such file or directory</p>;
          } else if (fileSystem[targetFile].type === 'dir') {
            output = <p className="cli-error">grep: {targetFile}: Is a directory</p>;
          } else {
            const lines = fileSystem[targetFile].content.split('\n');
            const matches = lines
              .map((line, idx) => ({ line, num: idx + 1 }))
              .filter(({ line }) => line.toLowerCase().includes(pattern.toLowerCase()));
            if (matches.length === 0) {
              output = <p className="cli-dim">(no matches found)</p>;
            } else {
              output = (
                <div className="cli-output-block">
                  {matches.map(({ line, num }) => (
                    <p key={num} className="cli-output-msg">
                      <span className="cli-highlight">{num}:</span> {line}
                    </p>
                  ))}
                </div>
              );
            }
          }
        }
        break;

      case 'head':
        if (!argStr) {
          output = <p className="cli-error">head: missing file operand. Usage: head &lt;file&gt;</p>;
        } else {
          const target = args[args.length - 1];
          let count = 5;
          if (args[0] === '-n' && args[1]) {
            count = parseInt(args[1], 10) || 5;
          }
          if (!fileSystem[target]) {
            output = <p className="cli-error">head: {target}: No such file or directory</p>;
          } else if (fileSystem[target].type === 'dir') {
            output = <p className="cli-error">head: error reading '{target}': Is a directory</p>;
          } else {
            const lines = fileSystem[target].content.split('\n').slice(0, count);
            output = <pre className="cli-code-block">{lines.join('\n')}</pre>;
          }
        }
        break;

      case 'tail':
        if (!argStr) {
          output = <p className="cli-error">tail: missing file operand. Usage: tail &lt;file&gt;</p>;
        } else {
          const target = args[args.length - 1];
          let count = 5;
          if (args[0] === '-n' && args[1]) {
            count = parseInt(args[1], 10) || 5;
          }
          if (!fileSystem[target]) {
            output = <p className="cli-error">tail: {target}: No such file or directory</p>;
          } else if (fileSystem[target].type === 'dir') {
            output = <p className="cli-error">tail: error reading '{target}': Is a directory</p>;
          } else {
            const allLines = fileSystem[target].content.split('\n');
            const lines = allLines.slice(Math.max(0, allLines.length - count));
            output = <pre className="cli-code-block">{lines.join('\n')}</pre>;
          }
        }
        break;

      case 'wc':
        if (!argStr) {
          output = <p className="cli-error">wc: missing file operand. Usage: wc &lt;file&gt;</p>;
        } else {
          const target = argStr.trim();
          if (!fileSystem[target]) {
            output = <p className="cli-error">wc: {target}: No such file or directory</p>;
          } else if (fileSystem[target].type === 'dir') {
            output = <p className="cli-error">wc: {target}: read: Is a directory</p>;
          } else {
            const text = fileSystem[target].content;
            const lineCount = text.split('\n').length;
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
            const charCount = text.length;
            output = <p className="cli-output-msg">  {lineCount}  {wordCount} {charCount} {target}</p>;
          }
        }
        break;

      case 'find':
        const term = args[args.length - 1] === '.' ? '' : args[args.length - 1] || '';
        const fileKeys = Object.keys(fileSystem);
        const matched = term && term !== '.'
          ? fileKeys.filter(k => k.toLowerCase().includes(term.toLowerCase()))
          : fileKeys;
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">.</p>
            {matched.map(k => (
              <p key={k} className="cli-dim">./{k}</p>
            ))}
          </div>
        );
        break;

      case 'touch':
        if (!argStr) {
          output = <p className="cli-error">touch: missing file operand</p>;
        } else {
          setFileSystem((prev) => ({
            ...prev,
            [argStr]: { type: 'file', content: `Created on ${new Date().toLocaleTimeString()}` }
          }));
          output = null;
        }
        break;

      case 'mkdir':
        if (!argStr) {
          output = <p className="cli-error">mkdir: missing directory operand</p>;
        } else {
          setFileSystem((prev) => ({
            ...prev,
            [argStr]: { type: 'dir' }
          }));
          output = null;
        }
        break;

      case 'rm':
        if (!argStr) {
          output = <p className="cli-error">rm: missing operand</p>;
        } else if (fileSystem[argStr]) {
          setFileSystem((prev) => {
            const next = { ...prev };
            delete next[argStr];
            return next;
          });
          output = null;
        } else {
          output = <p className="cli-error">rm: cannot remove '{argStr}': No such file or directory</p>;
        }
        break;

      case 'cp':
        if (args.length < 2) {
          output = <p className="cli-error">cp: missing destination file operand after '{args[0] || ''}'. Usage: cp &lt;src&gt; &lt;dst&gt;</p>;
        } else {
          const [src, dst] = args;
          if (!fileSystem[src]) {
            output = <p className="cli-error">cp: cannot stat '{src}': No such file or directory</p>;
          } else if (fileSystem[src].type === 'dir') {
            output = <p className="cli-error">cp: -r not specified; omitting directory '{src}'</p>;
          } else {
            setFileSystem((prev) => ({
              ...prev,
              [dst]: { type: 'file', content: prev[src].content }
            }));
            output = null;
          }
        }
        break;

      case 'mv':
        if (args.length < 2) {
          output = <p className="cli-error">mv: missing destination file operand after '{args[0] || ''}'. Usage: mv &lt;src&gt; &lt;dst&gt;</p>;
        } else {
          const [src, dst] = args;
          if (!fileSystem[src]) {
            output = <p className="cli-error">mv: cannot stat '{src}': No such file or directory</p>;
          } else {
            setFileSystem((prev) => {
              const next = { ...prev };
              next[dst] = next[src];
              delete next[src];
              return next;
            });
            output = null;
          }
        }
        break;

      // 3. SYSTEM & HARDWARE COMMANDS
      case 'whoami':
        output = <p className="cli-output-msg">prashant-singh (B.Tech CSE Student & Aspiring Developer)</p>;
        break;

      case 'uname':
        if (args.includes('-a') || args.includes('-m')) {
          output = <p className="cli-output-msg">Linux prashant-portfolio 6.8.0-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</p>;
        } else {
          output = <p className="cli-output-msg">Linux</p>;
        }
        break;

      case 'hostname':
        output = <p className="cli-output-msg">portfolio-workstation</p>;
        break;

      case 'uptime':
        output = <p className="cli-output-msg"> 02:40:00 up 42 days, 3:14, 1 user, load average: 0.08, 0.04, 0.01</p>;
        break;

      case 'date':
        output = <p className="cli-output-msg">{new Date().toString()}</p>;
        break;

      case 'top':
      case 'ps':
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">PID  USER     PR  NI  VIRT   RES   %CPU %MEM   TIME+  COMMAND</p>
            <p>  1  root     20   0  168M   12M    0.0  0.1   0:02.1 systemd</p>
            <p>142  prashant 20   0  524M  140M    0.5  1.2   0:08.4 node vite (dev)</p>
            <p>256  prashant 20   0  380M   96M    0.2  0.8   0:03.2 react-19 (wm)</p>
            <p>410  prashant 20   0   48M    8M    0.0  0.1   0:00.6 bash (webcli)</p>
          </div>
        );
        break;

      case 'df':
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">Filesystem     1K-blocks      Used Available Use% Mounted on</p>
            <p>/dev/nvme0n1p2 512000000 128450000 383550000  25% /</p>
            <p>tmpfs            8192000         0   8192000   0% /dev/shm</p>
          </div>
        );
        break;

      case 'free':
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">               total        used        free      shared  buff/cache   available</p>
            <p>Mem:        16384000     4521000    10240000      210000     1623000    11653000</p>
            <p>Swap:        2097152           0     2097152</p>
          </div>
        );
        break;

      case 'ping':
        const host = argStr || 'google.com';
        output = (
          <div className="cli-output-block">
            <p className="cli-output-msg">PING {host} (142.250.190.46): 56 data bytes</p>
            <p>64 bytes from 142.250.190.46: icmp_seq=0 ttl=117 time=14.2 ms</p>
            <p>64 bytes from 142.250.190.46: icmp_seq=1 ttl=117 time=13.1 ms</p>
            <p>64 bytes from 142.250.190.46: icmp_seq=2 ttl=117 time=12.8 ms</p>
            <p className="cli-success">--- {host} ping statistics --- 3 packets transmitted, 3 received, 0% packet loss</p>
          </div>
        );
        break;

      case 'curl':
        if (!argStr) {
          output = <p className="cli-error">curl: try 'curl https://api.portfolio.dev/profile'</p>;
        } else {
          output = (
            <pre className="cli-code-block">
{`HTTP/1.1 200 OK
Content-Type: application/json
Date: ${new Date().toUTCString()}

{
  "status": "online",
  "endpoint": "${argStr}",
  "candidate": "Prashant Singh",
  "degree": "B.Tech CSE",
  "ready": true
}`}
            </pre>
          );
        }
        break;

      case 'echo':
        let echoed = argStr;
        echoed = echoed.replace('$USER', 'prashant');
        echoed = echoed.replace('$SHELL', '/bin/bash');
        echoed = echoed.replace('$HOME', '/home/prashant');
        echoed = echoed.replace('$OS', 'PrashantOS (Web Desktop)');
        output = <p className="cli-output-msg">{echoed}</p>;
        break;

      // 4. DEVELOPER TOOLS & WORKSPACE COMMANDS
      case 'git':
        const gitSub = args[0]?.toLowerCase();
        if (!gitSub || gitSub === 'help' || gitSub === '--help') {
          output = (
            <div className="cli-output-block">
              <p className="cli-heading">usage: git [--version] [--help] &lt;command&gt; [&lt;args&gt;]</p>
              <p className="cli-dim">Common Git commands used in Prashant's repository:</p>
              <div className="cli-table">
                <span className="cli-col-cmd">status</span>
                <span className="cli-col-desc">Show the working tree status</span>
                <span className="cli-col-cmd">log</span>
                <span className="cli-col-desc">Show recent commit logs</span>
                <span className="cli-col-cmd">branch</span>
                <span className="cli-col-desc">List local branches (* main)</span>
                <span className="cli-col-cmd">diff</span>
                <span className="cli-col-desc">Show changes between commits/working tree</span>
              </div>
            </div>
          );
        } else if (gitSub === 'status') {
          output = (
            <div className="cli-output-block">
              <p className="cli-success">On branch main</p>
              <p className="cli-dim">Your branch is up to date with 'origin/main'.</p>
              <p className="cli-output-msg">nothing to commit, working tree clean</p>
            </div>
          );
        } else if (gitSub === 'branch') {
          output = <p className="cli-success">* main</p>;
        } else if (gitSub === 'log') {
          output = (
            <div className="cli-output-block">
              <p><span className="cli-highlight">commit 8c4f92a</span> <span className="cli-success">(HEAD -&gt; main, origin/main)</span></p>
              <p className="cli-dim">Author: Prashant Singh &lt;prashant.singh@cse.portfolio.dev&gt;</p>
              <p className="cli-dim">Date:   {new Date().toDateString()}</p>
              <p style={{ margin: '4px 0 8px 16px' }}>feat: advanced OS desktop, tiling manager & developer WebCLI</p>
              <p><span className="cli-highlight">commit e31b490</span></p>
              <p className="cli-dim">Author: Prashant Singh &lt;prashant.singh@cse.portfolio.dev&gt;</p>
              <p className="cli-dim">Date:   Sat Oct 17 2026</p>
              <p style={{ margin: '4px 0 0 16px' }}>feat: interactive window animations and retro styling</p>
            </div>
          );
        } else if (gitSub === 'diff') {
          output = <p className="cli-dim">(no uncommitted working tree diff)</p>;
        } else if (gitSub === '--version' || gitSub === '-v') {
          output = <p className="cli-output-msg">git version 2.44.0.windows.1</p>;
        } else {
          output = <p className="cli-error">git: '{gitSub}' is not a valid git command. See 'git --help'.</p>;
        }
        break;

      case 'node':
        if (args.includes('-v') || args.includes('--version') || args.length === 0) {
          output = <p className="cli-output-msg">v20.12.2</p>;
        } else if (args[0] === '-e') {
          output = <p className="cli-success">[eval output]: execution finished cleanly.</p>;
        } else {
          output = <p className="cli-output-msg">Node.js REPL (v20.12.2). Type .exit to return.</p>;
        }
        break;

      case 'npm':
        const npmSub = args[0]?.toLowerCase();
        if (args.includes('-v') || args.includes('--version') || !npmSub) {
          output = <p className="cli-output-msg">10.5.0</p>;
        } else if (npmSub === 'run' || npmSub === 'test' || npmSub === 'start') {
          output = (
            <div className="cli-output-block">
              <p className="cli-dim">&gt; prashant-portfolio@1.0.0 {npmSub}</p>
              <p className="cli-success">&#10004; compiled successfully with Vite 8 (234ms)</p>
            </div>
          );
        } else {
          output = <p className="cli-output-msg">npm version 10.5.0 (Node v20.12.2)</p>;
        }
        break;

      case 'python':
      case 'python3':
        output = <p className="cli-output-msg">Python 3.12.3 (main, Apr 10 2024, 05:33:47) [GCC 13.2.0] on linux</p>;
        break;

      case 'code':
        output = (
          <div className="cli-output-block">
            <p className="cli-success">&#10004; Launched Visual Studio Code workspace for Prashant Singh.</p>
            <p className="cli-dim">Workspace: ~/portfolio [React 19, Motion, Node.js, Express]</p>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="cli-output-block">
            <p className="cli-dim">[sudo] password for prashant: **********</p>
            <p className="cli-error">prashant is not in the sudoers file. This incident will be reported to the College Viva Committee.</p>
          </div>
        );
        break;

      case 'cal':
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthName = now.toLocaleString('default', { month: 'long' });
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const currentDay = now.getDate();

        const calRows = [];
        let currentWeek = new Array(firstDay).fill('  ');
        for (let d = 1; d <= totalDays; d++) {
          currentWeek.push(d.toString().padStart(2, ' '));
          if (currentWeek.length === 7) {
            calRows.push(currentWeek);
            currentWeek = [];
          }
        }
        if (currentWeek.length > 0) {
          while (currentWeek.length < 7) currentWeek.push('  ');
          calRows.push(currentWeek);
        }

        output = (
          <pre className="cli-code-block" style={{ width: 'fit-content' }}>
{`    ${monthName} ${year}
Su Mo Tu We Th Fr Sa
${calRows.map(row => row.map(d => d.trim() === currentDay.toString() ? `[${d}]` : ` ${d}`).join('')).join('\n')}`}
          </pre>
        );
        break;

      case 'env':
      case 'printenv':
        output = (
          <div className="cli-output-block" style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>
            <p>USER=prashant</p>
            <p>HOME=/home/prashant</p>
            <p>SHELL=/bin/bash</p>
            <p>TERM=xterm-256color</p>
            <p>LANG=en_US.UTF-8</p>
            <p>DEGREE=B.Tech Computer Science and Engineering</p>
            <p>STATUS=Ready for Viva Presentation</p>
            <p>STACK=MERN Stack + Motion Physics + Tiling WM</p>
            <p>PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/bin</p>
          </div>
        );
        break;

      case 'which':
      case 'where':
        if (!argStr) {
          output = <p className="cli-error">which: missing argument</p>;
        } else {
          const q = argStr.trim().toLowerCase();
          if (COMMAND_LIST.includes(q)) {
            output = <p className="cli-output-msg">/usr/bin/{q}</p>;
          } else {
            output = <p className="cli-error">{q}: not found in PATH</p>;
          }
        }
        break;

      case 'calc':
      case 'bc':
        if (!argStr) {
          output = <p className="cli-error">calc: missing math expression. Example: 'calc 24 * 7' or 'calc (100 + 50) / 2'</p>;
        } else {
          try {
            const sanitized = argStr.replace(/[^0-9+\-*/().%^ ]/g, '');
            // eslint-disable-next-line no-eval
            const result = Function(`'use strict'; return (${sanitized})`)();
            output = <p className="cli-success">{argStr} = {result}</p>;
          } catch {
            output = <p className="cli-error">calc: syntax error in expression '{argStr}'</p>;
          }
        }
        break;

      case 'matrix':
        setThemeMode('matrix');
        output = (
          <div className="cli-output-block" style={{ color: '#00ff66' }}>
            <p className="cli-success">&#10004; Matrix digital rain mode activated.</p>
            <p className="cli-dim">01010000 01110010 01100001 01110011 01101000 01100001 01101110 01110100</p>
            <p className="cli-dim">Wake up, Neo... The Matrix has you. Follow the white rabbit.</p>
          </div>
        );
        break;

      // 5. PORTFOLIO & WINDOW MANAGEMENT
      case 'open':
      case 'start':
        if (!argStr) {
          output = <p className="cli-error">Usage: open &lt;profile | works | contact | resume&gt;</p>;
        } else {
          const target = argStr.replace(/\/$/, '').toLowerCase();
          if (['profile', 'works', 'contact', 'resume'].includes(target)) {
            if (onOpenWindow) {
              onOpenWindow(target);
            }
            output = <p className="cli-success">Launched '{target}' window in desktop.</p>;
          } else {
            output = <p className="cli-error">open: '{argStr}' is not an available application.</p>;
          }
        }
        break;

      case 'close':
        if (!argStr) {
          output = <p className="cli-error">Usage: close &lt;profile | works | contact | resume | terminal&gt;</p>;
        } else {
          const target = argStr.replace(/\/$/, '').toLowerCase();
          if (onCloseWindow) {
            onCloseWindow(target);
          }
          output = <p className="cli-success">Closed '{target}' window.</p>;
        }
        break;

      case 'neofetch':
      case 'fastfetch':
        output = renderNeofetchOutput();
        break;

      case 'theme':
        const chosenTheme = args[0]?.toLowerCase();
        if (['matrix', 'amber', 'cyan', 'default'].includes(chosenTheme)) {
          setThemeMode(chosenTheme);
          output = <p className="cli-success">Switched terminal color theme to '{chosenTheme}'.</p>;
        } else {
          output = <p className="cli-error">Available themes: 'default', 'matrix', 'amber', 'cyan'</p>;
        }
        break;

      case 'history':
        output = (
          <div className="cli-output-block">
            {enteredCommands.map((c, i) => (
              <p key={i} className="cli-history-row">
                <span className="history-num">{i + 1}</span> {c}
              </p>
            ))}
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'exit':
        if (onCloseWindow) {
          onCloseWindow('terminal');
        }
        return;

      case 'reboot':
        window.location.reload();
        return;

      default:
        output = (
          <p className="cli-error">
            {cmd}: command not found. Type <span className="cli-highlight">'help'</span> for list of commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      { type: 'cmd', dir: currentDir, cmd: trimmed, output },
    ]);
  };

  /**
   * Keyboard Navigation (Up/Down history, Tab autocompletion, Ctrl shortcuts)
   */
  const handleKeyDown = (e) => {
    // Arrow Up: Previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enteredCommands.length === 0) return;
      const nextIndex = historyPointer === -1
        ? enteredCommands.length - 1
        : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIndex);
      setInputVal(enteredCommands[nextIndex] || '');
      return;
    }

    // Arrow Down: Next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextIndex = historyPointer + 1;
      if (nextIndex >= enteredCommands.length) {
        setHistoryPointer(-1);
        setInputVal('');
      } else {
        setHistoryPointer(nextIndex);
        setInputVal(enteredCommands[nextIndex] || '');
      }
      return;
    }

    // Tab Key: Autocompletion
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;

      // Autocomplete command
      const matchingCmd = COMMAND_LIST.find((c) => c.startsWith(current));
      if (matchingCmd) {
        setInputVal(matchingCmd + ' ');
        return;
      }

      // Autocomplete file or directory argument
      const parts = inputVal.split(' ');
      if (parts.length >= 2) {
        const prefix = parts[0];
        const fileQuery = parts[1].toLowerCase();
        const availableFiles = Object.keys(fileSystem);
        const matchFile = availableFiles.find((f) => f.toLowerCase().startsWith(fileQuery));
        if (matchFile) {
          setInputVal(`${prefix} ${matchFile}`);
        }
      }
      return;
    }

    // Ctrl + L: Clear screen
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Ctrl + C: Abort line
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setHistory((prev) => [
        ...prev,
        { type: 'cmd', dir: currentDir, cmd: inputVal + '^C', output: null },
      ]);
      setInputVal('');
      setHistoryPointer(-1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
    setInputVal('');
  };

  const promptStr = `prashant@portfolio:${currentDir}$`;

  return (
    <div
      ref={containerRef}
      className={`terminal-app-window terminal-theme-${themeMode}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-app-scroll">
        {history.map((item, index) => (
          <div key={index} className="terminal-app-row">
            {item.type === 'cmd' ? (
              <>
                <div className="terminal-app-prompt-line">
                  <span className="terminal-ps-label">prashant@portfolio:{item.dir || '~'}$</span>
                  <span className="terminal-ps-input">{item.cmd}</span>
                </div>
                {item.output && <div className="terminal-output-container">{item.output}</div>}
              </>
            ) : (
              item.content
            )}
          </div>
        ))}

        {/* Active Command Line */}
        <form onSubmit={handleSubmit} className="terminal-active-line-form">
          <span className="terminal-ps-label">{promptStr}</span>
          <div className="terminal-interactive-input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-real-cli-input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
            <span className="terminal-cli-preview">{inputVal}</span>
            <span className="terminal-real-caret" aria-hidden="true" />
          </div>
        </form>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default TerminalAppContent;
