const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

let fireworks = [];
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Firework {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
    this.coordinates = [];
    for (let i = 0; i < 3; i++) this.coordinates.push([this.x, this.y]);
    this.angle = Math.atan2(targetY - startY, targetX - startX);
    this.speed = 3;
    this.acceleration = 1.02;
    this.brightness = Math.random() * 50 + 50;
    this.targetRadius = 1;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) this.targetRadius += 0.3;
    else this.targetRadius = 1;

    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;

    const dx = this.x - this.targetX;
    const dy = this.y - this.targetY;
    if (Math.hypot(dx, dy) < 8) {
      createParticles(this.targetX, this.targetY);
      fireworks.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    const last = this.coordinates[this.coordinates.length - 1];
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    for (let i = 0; i < 5; i++) this.coordinates.push([this.x, this.y]);
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 8 + 2;
    this.friction = 0.95;
    this.gravity = 0.6;
    this.brightness = Math.random() * 50 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    const last = this.coordinates[this.coordinates.length - 1];
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

function createParticles(x, y) {
  let count = 40;
  while (count--) {
    particles.push(new Particle(x, y));
  }
}

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if (Math.random() < 0.06) {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * (canvas.height / 2);
    fireworks.push(new Firework(startX, startY, targetX, targetY));
  }
}
loop();
