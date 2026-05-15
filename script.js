// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.radius = Math.random() * 2 + 1;
        this.colors = ['#00ff88', '#ff00de', '#00ffff'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

// Orbital objects
class OrbitingCircle {
    constructor(centerX, centerY, radius, speed, color, size) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += this.speed;
    }

    draw(ctx) {
        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY + Math.sin(this.angle) * this.radius;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const orbitals = [
    new OrbitingCircle(centerX, centerY, 150, 0.005, '#00ff88', 5),
    new OrbitingCircle(centerX, centerY, 150, -0.005, '#ff00de', 5),
    new OrbitingCircle(centerX, centerY, 250, 0.003, '#00ffff', 4),
    new OrbitingCircle(centerX, centerY, 250, -0.003, '#ff00de', 4),
];

// Draw grid background
function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
    ctx.lineWidth = 1;

    const gridSize = 40;
    const offsetY = (Date.now() * 0.02) % gridSize;

    // Vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.restore();
}

// Draw scanlines
function drawScanlines() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;

    const scanlineSpacing = 2;
    const offset = (Date.now() * 0.5) % scanlineSpacing;

    for (let y = offset; y < canvas.height; y += scanlineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.restore();
}

// Draw orbit paths (faint circles)
function drawOrbitPaths() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    orbitals.forEach(orbital => {
        ctx.beginPath();
        ctx.arc(orbital.centerX, orbital.centerY, orbital.radius, 0, Math.PI * 2);
        ctx.stroke();
    });

    ctx.restore();
}

// Main animation loop
function animate() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background effects
    drawGrid();
    drawScanlines();
    drawOrbitPaths();

    // Update and draw orbiting circles
    orbitals.forEach(orbital => {
        orbital.update();
        orbital.draw(ctx);
    });

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();
