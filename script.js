const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
const taskbar = document.getElementById('taskbar-windows');

// Start button toggle
startButton.addEventListener('click', (e) => {
  e.stopPropagation();
  startButton.classList.toggle('active');
  startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
});

// Close start menu on document click
document.addEventListener('click', () => {
  startButton.classList.remove('active');
  startMenu.style.display = 'none';
});

// Clock
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');
  document.querySelector('.clock').textContent = `${hours}:${minutes} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);

// Icon select
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', function() {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    this.classList.add('selected');
  });
});

// Open folder window
function openFolder(name, contentHTML) {
  // Check if window already exists
  const existingWindow = document.querySelector(`[data-window-name="${name}"]`);
  if (existingWindow) {
    existingWindow.style.display = 'block';
    existingWindow.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 1000)) + 1;
    return;
  }

  const win = document.createElement('div');
  win.className = 'window';
  win.dataset.windowName = name;
  win.style.cssText = `
    display: block;
    position: absolute;
    top: ${100 + Math.random() * 100}px;
    left: ${100 + Math.random() * 100}px;
    width: 400px;
    height: 300px;
    z-index: ${1000 + Math.random() * 100};
  `;

  win.innerHTML = `
    <div class="window-titlebar">
      <span class="title">${name}</span>
      <div class="window-controls">
        <button class="minimize">_</button>
        <button class="resize">□</button>
        <button class="close">×</button>
      </div>
    </div>
    <div class="window-content">
      ${contentHTML}
    </div>
  `;

  document.body.appendChild(win);

  // Add to taskbar
  addToTaskbar(name, win);

  // Close
  win.querySelector('.close').addEventListener('click', () => {
    removeFromTaskbar(name);
    win.remove();
  });

  // Minimize
  win.querySelector('.minimize').addEventListener('click', () => {
    win.style.display = 'none';
    updateTaskbarButton(name, true);
  });

  // Resize / maximize
  win.querySelector('.resize').addEventListener('click', () => {
    if (!win.dataset.maximized || win.dataset.maximized === 'false') {
      win.dataset.prevTop = win.style.top;
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;

      win.style.top = '0';
      win.style.left = '0';
      win.style.width = '100%';
      win.style.height = 'calc(100% - 35px)';
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
  const titlebar = win.querySelector('.window-titlebar');
  let isDragging = false, offsetX = 0, offsetY = 0;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 1000)) + 1;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Bring to front on click
  win.addEventListener('mousedown', () => {
    win.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 1000)) + 1;
  });
}

// Add window to taskbar
function addToTaskbar(name, window) {
  const taskBtn = document.createElement('button');
  taskBtn.id = `task-${name}`;
  taskBtn.textContent = name;
  taskBtn.className = 'taskbar-button';
  taskBtn.addEventListener('click', () => {
    window.style.display = 'block';
    window.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 1000)) + 1;
    updateTaskbarButton(name, false);
  });
  taskbar.appendChild(taskBtn);
}

// Remove window from taskbar
function removeFromTaskbar(name) {
  const taskBtn = document.getElementById(`task-${name}`);
  if (taskBtn) taskBtn.remove();
}

// Update taskbar button state
function updateTaskbarButton(name, minimized) {
  const taskBtn = document.getElementById(`task-${name}`);
  if (taskBtn) {
    taskBtn.style.opacity = minimized ? '0.5' : '1';
  }
}

// Open My Computer
function openMyComputer() {
  openFolder('My Computer', `
    <h2>My Computer</h2>
    <div class="folder-contents">
      <div class="computer-drive" onclick="openFolder('Local Disk (C:)', \`
        <h2>Local Disk (C:)</h2>
        <div class='folder-contents'>
          <div class='folder-item' onclick='openFolder(\"Windows\", \"<h2>Windows</h2><p>System files</p>\")'>📁 Windows</div>
          <div class='folder-item' onclick='openFolder(\"Program Files\", \"<h2>Program Files</h2><p>Installed programs</p>\")'>📁 Program Files</div>
          <div class='folder-item' onclick='openFolder(\"Documents and Settings\", \"<h2>Documents and Settings</h2><p>User profiles</p>\")'>📁 Documents and Settings</div>
        </div>
      \`)">
        <span class="drive-icon">💾</span>
        Local Disk (C:)
      </div>
      <div class="computer-drive" onclick="openFolder('Local Disk (D:)', \`
        <h2>Local Disk (D:)</h2>
        <div class='folder-contents'>
          <div class='folder-item' onclick='openFolder(\"Games\", \"<h2>Games</h2><p>Installed games</p>\")'>🎮 Games</div>
          <div class='folder-item' onclick='openFolder(\"Media\", \"<h2>Media</h2><p>Music and videos</p>\")'>🎵 Media</div>
        </div>
      \`)">
        <span class="drive-icon">💿</span>
        Local Disk (D:)
      </div>
      <div class="computer-drive" onclick="openFolder('Control Panel', \`
        <h2>Control Panel</h2>
        <div class='folder-contents'>
          <div class='folder-item'>⚙️ Display</div>
          <div class='folder-item'>🔧 System</div>
          <div class='folder-item'>🌐 Network</div>
          <div class='folder-item'>🔊 Sound</div>
        </div>
      \`)">
        <span class="drive-icon">⚙️</span>
        Control Panel
      </div>
    </div>
  `);
}

// Open Photos folder
function openPhotosFolder() {
  openFolder('Photos', `
    <h2>Photos</h2>
    <div class="folder-contents">
      <div class="folder-item" onclick="openFolder('Vacation 2024', \`
        <h2>Vacation 2024</h2>
        <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;'>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>📷 Photo1</div>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>📷 Photo2</div>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>📷 Photo3</div>
        </div>
      \`)">📁 Vacation 2024</div>
      <div class="folder-item" onclick="openFolder('Family Photos', \`
        <h2>Family Photos</h2>
        <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;'>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>👨‍👩‍👧‍👦 Family1</div>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>👨‍👩‍👧‍👦 Family2</div>
        </div>
      \`)">📁 Family Photos</div>
      <div class="folder-item" onclick="openFolder('Screenshots', \`
        <h2>Screenshots</h2>
        <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;'>
          <div style='width:100px;height:100px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;'>🖥️ Screenshot1</div>
        </div>
      \`)">📁 Screenshots</div>
    </div>
  `);
}
