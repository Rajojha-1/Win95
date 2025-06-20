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
  const win = document.createElement('div');
  win.className = 'window';
  win.style.cssText = `
    display: block;
    position: absolute;
    top: 100px;
    left: 100px;
    width: 300px;
    height: 200px;
    border: 2px solid #000;
    background: #c0c0c0;
    box-shadow: 3px 3px #808080;
    resize: both;
    overflow: auto;
    z-index: 1000;
    transition: all 0.3s ease;
  `;

  win.innerHTML = `
    <div class="window-titlebar" style="background: #00008B; color: #fff; padding: 4px 5px; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
      <span class="title">${name}</span>
      <div class="window-controls">
        <button class="minimize">_</button>
        <button class="resize">[]</button>
        <button class="close">X</button>
      </div>
    </div>
    <div class="window-content" style="padding: 10px;">
      ${contentHTML}
    </div>
  `;

  document.body.appendChild(win);

  // Close
  win.querySelector('.close').addEventListener('click', () => {
    const taskBtn = document.getElementById(`task-${name}`);
    if (taskBtn) taskBtn.remove();
    win.remove();
  });

  // Minimize
  win.querySelector('.minimize').addEventListener('click', () => {
    win.style.display = 'none';
    if (!document.getElementById(`task-${name}`)) {
      const taskBtn = document.createElement('button');
      taskBtn.id = `task-${name}`;
      taskBtn.textContent = name;
      taskBtn.style.margin = '0 2px';
      taskBtn.addEventListener('click', () => {
        win.style.display = 'block';
        taskBtn.remove();
      });
      taskbar.appendChild(taskBtn);
    }
  });

  // Resize / maximize with animation
  win.querySelector('.resize').addEventListener('click', () => {
    if (!win.dataset.maximized || win.dataset.maximized === 'false') {
      win.dataset.prevTop = win.style.top;
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;

      win.style.top = '0';
      win.style.left = '0';
      win.style.width = '100%';
      win.style.height = '100%';
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
}
