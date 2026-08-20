
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');

        // Ajustar el canvas al tamaño de la pantalla
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let particles = [];
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#e91e63'];

        // Función para crear confeti en una posición específica
        function addConfetti(x, y) {
            for (let i = 0; i < 45; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 7 + 2;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 3, // Impulso inicial hacia arriba
                    size: Math.random() * 9 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.01,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 12
                });
            }
        }

        // Eventos de clic y táctil (soporta múltiples toques en distintas zonas)
        window.addEventListener('click', (e) => {
            addConfetti(e.clientX, e.clientY);
        });

        window.addEventListener('touchstart', (e) => {
            for (let i = 0; i < e.touches.length; i++) {
                addConfetti(e.touches[i].clientX, e.touches[i].clientY);
            }
        });

        // Bucle de animación del confeti
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.25; // Efecto de gravedad
                p.vx *= 0.98; // Fricción del aire
                p.alpha -= p.decay;
                p.rotation += p.rotationSpeed;

                if (p.alpha <= 0 || p.y > canvas.height + 50) {
                    particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); // Forma rectangular de confeti
                    ctx.restore();
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
