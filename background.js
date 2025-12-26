/**
 * Modern Gradient Flow Animation
 * Creates a premium, atmospheric background effect using blurred moving orbs.
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let width, height;

// Add canvas to body
canvas.id = 'bg-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
// Dark base background
canvas.style.background = '#050505';
document.body.prepend(canvas);

// Mouse state
const mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Configuration
const ORB_COUNT = 15;
const COLORS = [
    '#ff2a2a', // Brand Red
    '#ff4d4d', // Lighter Red
    '#a80000', // Dark Red
    '#2a2a4a', // Dark Blue/Purple (Contrast)
    '#ffabab'  // Soft Pink/White
];

class Orb {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.radius = Math.random() * 100 + 50; // Large sizes: 50px - 150px

        // Random position
        if (initial) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        } else {
            // Spawn slightly off screen to flow in
            this.x = Math.random() < 0.5 ? -this.radius : width + this.radius;
            this.y = Math.random() * height;
        }

        // Slow, floating movement
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;

        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.3 + 0.1; // Low opacity

        // Pulse animation for size
        this.targetRadius = this.radius;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges (or wrap around, but bounce keeps them on screen better for this effect)
        if (this.x < -200 || this.x > width + 200) this.vx *= -1;
        if (this.y < -200 || this.y > height + 200) this.vy *= -1;

        // Mouse Interaction: Gently push away
        if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) {
                const angle = Math.atan2(dy, dx);
                const force = (300 - distance) / 300;
                const pushStrength = 1.6; // Subtle push

                this.vx -= Math.cos(angle) * force * pushStrength * 0.05;
                this.vy -= Math.sin(angle) * force * pushStrength * 0.05;
            }
        }

        // Limit speed to prevent them from flying off too fast after mouse push
        const maxSpeed = 1.5;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // Pulse size
        this.pulseAngle += this.pulseSpeed;
        this.currentRadius = this.radius + Math.sin(this.pulseAngle) * 20;

        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = this.color;

        // We handle alpha in the global composite or color string directly, 
        // but here we are using simple fills and relying on the blur filter of the context.
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Initialize Orbs
const orbs = [];
for (let i = 0; i < ORB_COUNT; i++) {
    orbs.push(new Orb());
}

function animate() {
    // Clear with a slight trail effect for smoothness? 
    // No, for this specific "clean" look, we want clear frames but heavy blur.

    // IMPORTANT: The high blur is what gives the "aurora" / "gradient" look.
    // Note: ctx.filter is supported in most modern browsers.
    ctx.filter = 'blur(80px)';
    // Optimization: If performance is bad, reduce blur radius or use a pre-blurred image asset.

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Use 'screen' or 'lighter' for glowing blend
    ctx.globalCompositeOperation = 'screen';

    orbs.forEach(orb => orb.update());

    // Reset settings for safety
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(animate);
}

animate();
