   const canvas = document.getElementById('balloonCanvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let balloons = [];
        let particles = [];
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#e91e63'];

        // Crear globos iniciales
        function spawnBalloons() {
            for (let i = 0; i < 15; i++) {
                balloons.push({
                    x: Math.random() * (canvas.width - 100) + 50,
                    y: canvas.height + Math.random() * 400,
                    radius: Math.random() * 20 + 25,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: Math.random() * 1.5 + 1,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: Math.random() * 0.05 + 0.02
                });
            }
        }
        spawnBalloons();

        // Función para crear partículas al reventar el globo
        function popBalloon(b) {
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                particles.push({
                    x: b.x,
                    y: b.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 5 + 3,
                    color: b.color,
                    alpha: 1,
                    decay: Math.random() * 0.03 + 0.02
                });
            }
        }

        // Manejar clics o toques para reventar globos
        function checkPop(clientX, clientY) {
            for (let i = balloons.length - 1; i >= 0; i--) {
                let b = balloons[i];
                const dx = clientX - b.x;
                const dy = clientY - b.y;
                // Detección de clic dentro del círculo del globo
                if (dx * dx + dy * dy < b.radius * b.radius) {
                    popBalloon(b);
                    balloons.splice(i, 1);
                    // Reemplazar inmediatamente con uno nuevo abajo
                    balloons.push({
                        x: Math.random() * (canvas.width - 100) + 50,
                        y: canvas.height + 50,
                        radius: Math.random() * 20 + 25,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        speed: Math.random() * 1.5 + 1,
                        wobble: Math.random() * Math.PI * 2,
                        wobbleSpeed: Math.random() * 0.05 + 0.02
                    });
                    break;
                }
            }
        }

        window.addEventListener('click', (e) => {
            checkPop(e.clientX, e.clientY);
        });

        window.addEventListener('touchstart', (e) => {
            for (let t of e.touches) {
                checkPop(t.clientX, t.clientY);
            }
        }, { passive: true });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar y dibujar globos
            balloons.forEach(b => {
                b.y -= b.speed;
                b.wobble += b.wobbleSpeed;
                let currentX = b.x + Math.sin(b.wobble) * 15;

                // Si el globo sube demasiado, reiniciar abajo
                if (b.y < -50) {
                    b.y = canvas.height + 50;
                    b.x = Math.random() * (canvas.width - 100) + 50;
                }

                ctx.save();
                ctx.translate(currentX, b.y);

                // Cuerpo del globo (forma de óvalo)
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, b.radius, b.radius * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();

                // Brillo del globo
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.ellipse(-b.radius * 0.3, -b.radius * 0.4, b.radius * 0.2, b.radius * 0.35, Math.PI / 6, 0, Math.PI * 2);
                ctx.fill();

                // Nudo del globo
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.moveTo(-4, b.radius * 1.2);
                ctx.lineTo(4, b.radius * 1.2);
                ctx.lineTo(0, b.radius * 1.2 + 8);
                ctx.closePath();
                ctx.fill();

                // Hilo
                ctx.strokeStyle = '#bdc3c7';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, b.radius * 1.2 + 8);
                ctx.quadraticCurveTo(10, b.radius * 1.2 + 30, 0, b.radius * 1.2 + 50);
                ctx.stroke();

                ctx.restore();
            });

            // Actualizar y dibujar partículas de explosión
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // Gravedad
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
