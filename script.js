const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

startButton.addEventListener('click', (e) => {
  e.stopPropagation();
  startButton.classList.toggle('active');
  if (startMenu.style.display === 'block') {
    startMenu.style.display = 'none';
  } else {
    startMenu.style.display = 'block';
  }
});

document.addEventListener('click', () => {
  startButton.classList.remove('active');
  startMenu.style.display = 'none';
});
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours %12;
  hours= hours ? hours : 12;
  hours = String(hours).padStart(2, '0');
  document.querySelector('.clock').textContent = `${hours}:${minutes} ${ampm}`;
}

// Update immediately, then every second
updateClock();
setInterval(updateClock, 1000);
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function(event) {
      // Remove selection from other icons
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      // Select this one
      this.classList.add('selected');
    });
  });

  // Handle double-click
  function openFolder(name) {
    alert(`Opening ${name}...`);
    // You can replace alert with your open action
  }
  function openFolder(name) {
  const win = document.getElementById('folderWindow');
  win.style.display = 'block';
  win.querySelector('.title').textContent = name;
}

// Close button
document.querySelector('.window .close').addEventListener('click', () => {
  document.getElementById('folderWindow').style.display = 'none';
});

// Minimize button
document.querySelector('.window .minimize').addEventListener('click', () => {
  const content = document.querySelector('.window .window-content');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
});

// Dragging
const titlebar = document.querySelector('.window-titlebar');
let isDragging = false, offsetX = 0, offsetY = 0;

titlebar.addEventListener('mousedown', (e) => {
  isDragging = true;
  const win = titlebar.parentElement;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const win = titlebar.parentElement;
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top = (e.clientY - offsetY) + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
