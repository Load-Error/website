const canvas = document.getElementById('cracktro');
const ctx = canvas.getContext('2d');

// Canvas resize handling
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration
const config = {
  scrollText: "WELCOME TO THE LOAD ERROR INTRO! GREETINGS TO ALL THE MEMBERS!",
  scrollSpeed: 2,
  waveAmplitude: 30,
  waveFrequency: 0.05,
  numStars: 200,
  plasmaSize: 32
};

// Starfield setup
let stars = [];
function initializeStars() {
  stars = Array(config.numStars).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width,
    color: `hsl(${Math.random() * 60 + 200}, 100%, 90%)`  // Blue-white stars
  }));
}

// Plasma effect setup
const plasmaData = new Uint8Array(config.plasmaSize * config.plasmaSize * 4);
function generatePlasma(time) {
  for (let y = 0; y < config.plasmaSize; y++) {
    for (let x = 0; x < config.plasmaSize; x++) {
      const value = Math.sin(x / 8.0 + time) +
                   Math.sin(y / 6.0 + time) +
                   Math.sin((x + y) / 8.0 + time) +
                   Math.sin(Math.sqrt(x * x + y * y) / 4.0);
      const color = Math.floor((value + 4) * 32);
      const i = (y * config.plasmaSize + x) * 4;
      plasmaData[i] = color;
      plasmaData[i + 1] = color / 2;
      plasmaData[i + 2] = color * 2;
      plasmaData[i + 3] = 255;
    }
  }
}

// Raster bars with different colors
function drawRasterBars(time) {
  const barCount = 5;
  const barHeight = 15;
  const colors = [
    ['rgba(255, 0, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
    ['rgba(0, 255, 0, 0.5)', 'rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 0, 0.5)'],
    ['rgba(0, 0, 255, 0.5)', 'rgba(255, 0, 255, 0.5)', 'rgba(0, 0, 255, 0.5)'],
    ['rgba(255, 165, 0, 0.5)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 165, 0, 0.5)'],
    ['rgba(75, 0, 130, 0.5)', 'rgba(238, 130, 238, 0.5)', 'rgba(75, 0, 130, 0.5)']
  ];
  
  for (let i = 0; i < barCount; i++) {
    const y = (canvas.height / 2) + Math.sin(time / 1000 + i * 0.5) * 100;
    const gradient = ctx.createLinearGradient(0, y, canvas.width, y);
    
    gradient.addColorStop(0, colors[i][0]);
    gradient.addColorStop(0.5, colors[i][1]);
    gradient.addColorStop(1, colors[i][2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, canvas.width, barHeight);
  }
}

// Enhanced starfield
function drawStarfield(time) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  stars.forEach(star => {
    const perspective = canvas.width / star.z;
    const starX = (star.x - canvas.width / 2) * perspective + canvas.width / 2;
    const starY = (star.y - canvas.height / 2) * perspective + canvas.height / 2;
    const starSize = Math.max(0.5, perspective * 0.5);
    
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Update star position
    star.z -= 3;
    if (star.z <= 0) {
      star.x = Math.random() * canvas.width;
      star.y = Math.random() * canvas.height;
      star.z = canvas.width;
    }
  });
}

// Scrolling text with enhanced wave effect
let scrollPos = canvas.width;
function drawTextWithWave(time) {
  let x = scrollPos;
  ctx.font = '36px "Press Start 2P", Arial';
  
  for (let i = 0; i < config.scrollText.length; i++) {
    const char = config.scrollText[i];
    const charWidth = ctx.measureText(char).width;
    const baseY = canvas.height * 0.1; // Move to the top of the screen
    const waveY = Math.sin(x * config.waveFrequency + time / 500) * config.waveAmplitude;
    const y = baseY + waveY;
    
    // Rainbow color effect
    const hue = (time / 20 + i * 10) % 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillText(char, x, y);
    
    x += charWidth;
  }
  
  scrollPos -= config.scrollSpeed;
  if (scrollPos < -ctx.measureText(config.scrollText).width) {
    scrollPos = canvas.width;
  }
}

// Enhanced title with 3D effect, glowing effect, and retrowave style
function drawTitle(time) {
  const title = 'LOAD ERROR';
  const maxFontSize = canvas.height / 3; // Maximum font size to cover 1/3 of the screen height
  let fontSize = maxFontSize;
  ctx.font = `${fontSize}px "Press Start 2P", Arial`;
  let textWidth = ctx.measureText(title).width;

  // Adjust font size to fit the screen width
  while (textWidth > canvas.width && fontSize > 10) {
    fontSize -= 1;
    ctx.font = `${fontSize}px "Press Start 2P", Arial`;
    textWidth = ctx.measureText(title).width;
  }

  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + fontSize) / 2; // Center vertically
  
  // Calculate movement
  const movement = Math.sin(time / 1000) * 20;
  
  // Glow effect
  const glowSize = Math.sin(time / 500) * 2 + 4;
  ctx.shadowColor = 'magenta';
  ctx.shadowBlur = glowSize;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Save the current context state
  ctx.save();
  
  // Translate to the center of the text
  ctx.translate(x + textWidth / 2, y);
  
  // Draw the 3D effect
  const depth = 10;
  for (let i = 0; i < depth; i++) {
    ctx.fillStyle = `rgba(255, 0, 255, ${1 - i / depth})`;
    ctx.fillText(title, -textWidth / 2 + i, i);
  }
  
  // Draw the main text
  ctx.fillStyle = 'cyan';
  ctx.fillText(title, -textWidth / 2, 0);
  
  // Restore the context state
  ctx.restore();
  
  // Reset shadow
  ctx.shadowBlur = 0;
}



// FPS counter
let lastTime = 0;
let fps = 0;
function updateFPS(time) {
  if (lastTime) {
    fps = Math.round(1000 / (time - lastTime));
  }
  lastTime = time;
  
  // ctx.font = '12px Arial';
  // ctx.fillStyle = 'white';
  // ctx.fillText(`FPS: ${fps}`, 10, 20);
}

// Main animation loop
function draw(timestamp) {
  const time = timestamp || 0;
  
  drawStarfield(time);
  drawRasterBars(time);
  generatePlasma(time / 1000);
  drawTitle(time);
  drawTextWithWave(time);
  updateFPS(time);
  
  requestAnimationFrame(draw);
}

document.addEventListener('click', () => {
  const audioElement = document.getElementById('background-music');
  if (audioElement.paused) {
    audioElement.play();
  }
});


// Initialize and start
initializeStars();
draw();