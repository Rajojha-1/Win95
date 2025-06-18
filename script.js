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
