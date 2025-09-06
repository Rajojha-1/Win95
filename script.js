(function () {
  const startButton = document.getElementById('startButton');
  const startMenu = document.getElementById('startMenu');
  const taskbar = document.getElementById('taskbar-windows');
  const iconsContainer = document.querySelector('.icons');
  let zIndexCounter = 1000;

  // --- Reusable Templates ---
  const folderWindowTemplate = (content = '') => `
    <div class="menu-bar">
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span>Help</span>
    </div>
    <div class="photos-canvas beveled-box-inset">
        <div class="folder-contents">
          ${content}
        </div>
    </div>
    <div class="status-bar">
      <div class="status-bar-panel beveled-box-inset"></div>
      <div class="status-bar-panel beveled-box-inset"></div>
    </div>`;

  const simpleFolderWindowTemplate = (content = '') => `
    <div class="photos-canvas beveled-box-inset">
        <div class="folder-contents">
          ${content}
        </div>
    </div>
    <div class="status-bar">
      <div class="status-bar-panel beveled-box-inset"></div>
      <div class="status-bar-panel beveled-box-inset"></div>
    </div>`;

  // --- Data for Applications/Folders ---
  const appData = {
    'my-computer': {
      name: 'My Computer',
      content: simpleFolderWindowTemplate(`
          <div class="computer-drive" data-folder-name="Local Disk (C:)" data-folder-content="<h2>Local Disk (C:)</h2><p>System files...</p>">
            <span class="drive-icon">💾</span> Local Disk (C:)
          </div>
          <div class="computer-drive" data-folder-name="Local Disk (D:)" data-folder-content="<h2>Local Disk (D:)</h2><p>Media files...</p>">
            <span class="drive-icon">💿</span> Local Disk (D:)
          </div>
        `)
    },
    'my-documents': {
      name: 'My Documents',
      content: simpleFolderWindowTemplate(`
          <div class="folder-item" data-app-id="photos">Photos</div>
          <div class="folder-item" data-app-id="music">Music</div>
        `)
    },
    'photos': {
  name: 'Photos',
  content: folderWindowTemplate(
    `<div class="folder-item" data-app-id="vacations">Vacations</div>
     <div class="folder-item" data-app-id="family">Family</div>
     <div class="folder-item" data-app-id="friends">Friends</div>
     <div class="folder-item" data-app-id="test">Test</div>`
    )
    },
    'vacations': {
      name: 'Vacations',
      content: folderWindowTemplate(
        `<div class="photo-item" data-src="/assets/win95 start.png" data-size="15328">
            <img src="/assets/Photo_icon.png" class="photo-item-thumbnail" alt="Photo Icon">
            <span class="photo-item-label">win95_start.png</span>
        </div>`
      )
    },
    'family': { name: 'Family', content: folderWindowTemplate() },
    'friends': { name: 'Friends', content: folderWindowTemplate() },
    'test': { name: 'Test', content: folderWindowTemplate() },
    'Resume': {
      name: 'Resume',
      content: `
        <div class="pdf-toolbar">
            <a href="assets/sample_resume.pdf" target="_blank" class="beveled-box pdf-button">📄 Open in New Tab</a>
            <a href="assets/sample_resume.pdf" download="Janhavi_Resume.pdf" class="beveled-box pdf-button">💾 Download</a>
        </div>
        <div class="photos-canvas beveled-box-inset" style="padding: 0; overflow: hidden;">
            <iframe src="assets/sample_resume.pdf" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
        <div class="status-bar">
            <div class="status-bar-panel beveled-box-inset"></div>
            <div class="status-bar-panel beveled-box-inset"></div>
        </div>
      `
    },
    'music': {
      name: 'Music',
      content: simpleFolderWindowTemplate(`<div>Your music files.</div>`)
    },
    'network': {
      name: 'Network Neighborhood',
      content: `<h2>Network Neighborhood</h2><p>No network connections found.</p>`
    },
    'ie': {
      name: 'Internet Explorer',
      content: `<h2>Internet Explorer</h2><p>Welcome to the World Wide Web!</p>`
    },
    'notepad': {
      name: 'Notepad',
      content: `<h2>Untitled - Notepad</h2><textarea style='width:100%;height:calc(100% - 20px);border:none;background:white;font-family:monospace;'>Welcome to Notepad!</textarea>`
    },
    'paint': {
      name: 'Paint',
      content: `
        <div class="paint-canvas-container beveled-box-inset">
            <canvas class="paint-canvas"></canvas>
        </div>
      `
    }
  };

  // --- Core Functions ---

  function updateStatusBar(win) {
    const contentArea = win.querySelector('.window-content');
    if (!contentArea) return;

    // Find items. These are the things we want to count.
    const items = contentArea.querySelectorAll('.folder-item, .computer-drive, .photo-item');
    const countPanel = win.querySelector('.status-bar .status-bar-panel:first-child');

    if (countPanel) {
        const count = items.length;
        countPanel.textContent = `${count} object(s)`;
    }

    // Calculate total size of photos
    const photoItems = contentArea.querySelectorAll('.photo-item[data-size]');
    const sizePanel = win.querySelector('.status-bar .status-bar-panel:last-child');
    if (sizePanel) {
      let totalSize = 0;
      photoItems.forEach(item => {
        totalSize += parseInt(item.dataset.size || '0', 10);
      });

      let sizeString = '';
      if (totalSize > 0) {
        sizeString = `${Math.round(totalSize / 1024)}KB`;
      }
      sizePanel.textContent = sizeString;
    }
  }

  function setupPaintCanvas(win) {
    const canvas = win.querySelector('.paint-canvas');
    const container = win.querySelector('.paint-canvas-container');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    // Set initial canvas size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
  }

  function bringToFront(win) {
    win.style.zIndex = ++zIndexCounter;
  }

  function openWindow(name, contentHTML) {
    const existingWindow = document.querySelector(`[data-window-name="${name}"]`);
    if (existingWindow) {
      existingWindow.style.display = 'block';
      bringToFront(existingWindow);
      updateTaskbarButton(name, false);
      return;
    }

    const win = document.createElement('div');
    win.className = 'window beveled-box';
    win.dataset.windowName = name;
    win.style.top = `${100 + Math.random() * 50}px`;
    win.style.left = `${100 + Math.random() * 100}px`;
    win.style.display = 'block';
    bringToFront(win);

    win.innerHTML = `
      <div class="window-titlebar">
        <span class="title">${name}</span>
        <div class="window-controls">
          <button class="minimize beveled-box">_</button>
          <button class="resize beveled-box">[]</button>
          <button class="close beveled-box">X</button>
        </div>
      </div>
      <div class="window-content">
        ${contentHTML}
      </div>
    `;

    document.body.appendChild(win);
    updateStatusBar(win);
    addWindowInteractivity(win);
    addToTaskbar(name, win);
  }

  function addWindowInteractivity(win) {
    const titlebar = win.querySelector('.window-titlebar');
    const closeBtn = win.querySelector('.close');
    const minimizeBtn = win.querySelector('.minimize');
    const resizeBtn = win.querySelector('.resize');
    const content = win.querySelector('.window-content');
    const name = win.dataset.windowName;

    // --- App-specific setups ---
    if (name === 'Paint') {
      setupPaintCanvas(win);
    }

    // Close
    closeBtn.addEventListener('click', () => {
      removeFromTaskbar(name);
      win.remove();
    });

    // Minimize
    minimizeBtn.addEventListener('click', () => {
      win.style.display = 'none';
      updateTaskbarButton(name, true);
    });

    // Maximize/Restore
    resizeBtn.addEventListener('click', () => {
      if (!win.dataset.maximized || win.dataset.maximized === 'false') {
        win.dataset.prevTop = win.style.top;
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = `calc(100% - ${taskbar.parentElement.offsetHeight}px)`;
        win.dataset.maximized = 'true';
      } else {
        win.style.top = win.dataset.prevTop;
        win.style.left = win.dataset.prevLeft;
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.dataset.maximized = 'false';
      }
    });

    // Dragging
    let isDragging = false, offsetX, offsetY;
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      bringToFront(win);
    });

    // Bring to front on click
    win.addEventListener('mousedown', () => bringToFront(win));

    // Event delegation for folder contents
    content.addEventListener('click', (e) => {
      const item = e.target.closest('[data-app-id], [data-folder-name], .photo-item');
      if (item) {
        const appId = item.dataset.appId;
        const folderName = item.dataset.folderName;
        const photoSrc = item.dataset.src;

        if (appId && appData[appId]) {
          // Handle items linked to appData
          const app = appData[appId];
          openWindow(app.name, app.content);
        } else if (folderName) {
          // Handle legacy items with inline content
          const folderContent = item.dataset.folderContent || '';
          openWindow(folderName, folderContent);
        } else if (photoSrc) {
          // Handle opening a photo
          const fileName = photoSrc.split('/').pop();
          const photoViewerContent = `<div style="width:100%;height:100%;background:#333;display:flex;align-items:center;justify-content:center;overflow:auto;"><img src="${photoSrc}" alt="${fileName}" style="max-width:100%;max-height:100%;object-fit:contain;"></div>`;
          openWindow(fileName, photoViewerContent);
        }
      }
    });

    // Global mouse move/up for dragging
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // --- Taskbar Functions ---

  function addToTaskbar(name, win) {
    const taskBtn = document.createElement('button');
    taskBtn.id = `task-${name.replace(/\s/g, '-')}`;
    taskBtn.textContent = name;
    taskBtn.className = 'taskbar-button beveled-box';
    taskBtn.addEventListener('click', () => {
      const isMinimized = win.style.display === 'none';
      if (isMinimized) {
        win.style.display = 'block';
        bringToFront(win);
        updateTaskbarButton(name, false);
      } else {
        bringToFront(win);
      }
    });
    taskbar.appendChild(taskBtn);
  }

  function removeFromTaskbar(name) {
    const taskBtn = document.getElementById(`task-${name.replace(/\s/g, '-')}`);
    if (taskBtn) taskBtn.remove();
  }

  function updateTaskbarButton(name, minimized) {
    const taskBtn = document.getElementById(`task-${name.replace(/\s/g, '-')}`);
    if (taskBtn) {
      if (minimized) {
        taskBtn.classList.add('beveled-box-inset');
      } else {
        taskBtn.classList.remove('beveled-box-inset');
      }
    }
  }

  // --- Initial Event Listeners ---

  // Start Menu
  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    startButton.classList.toggle('active');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    startButton.classList.remove('active');
    startMenu.style.display = 'none';
  });

  startMenu.addEventListener('click', (e) => {
    const item = e.target.closest('.start-menu-item');
    if (item) {
      const type = item.dataset.folderName; // e.g., "Resume", "Shutdown"
      if (appData[type]) {
        // This handles "Resume" and any other app defined in appData
        openWindow(appData[type].name, appData[type].content);
      }
    }
  });

  // Desktop Icons
  iconsContainer.addEventListener('click', (e) => {
    const icon = e.target.closest('.icon');
    if (icon) {
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    }
  });

  iconsContainer.addEventListener('dblclick', (e) => {
    const icon = e.target.closest('.icon');
    if (icon) {
      const type = icon.dataset.iconType;
      if (appData[type]) {
        openWindow(appData[type].name, appData[type].content);
      }
    }
  });

  // Clock
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const displayHours = String(hours).padStart(2, ' ');
    document.querySelector('.clock').textContent = `${displayHours}:${minutes} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

})();
