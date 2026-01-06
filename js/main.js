console.log("Portfolio Loaded");

document.addEventListener('DOMContentLoaded', () => {

    // Project Image Gallery logic
    document.querySelectorAll('.project-card').forEach(card => {
        const mainImg = card.querySelector('.main-image img');
        const thumbs = card.querySelectorAll('.thumbnails img');

        if (mainImg && thumbs.length > 0) {
            thumbs.forEach(thumb => {
                thumb.addEventListener('mouseenter', () => {
                    const newSrc = thumb.src;
                    // Simple fade effect could be added here, but direct swap for now
                    mainImg.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImg.src = newSrc;
                        mainImg.style.opacity = '1';
                    }, 200);
                });
            });
        }
    });

    // 1. Initialize Particles.js
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": {
                    "type": "triangle", // Changed to triangles for a "shard" look
                    "stroke": { "width": 0, "color": "#000000" },
                    "polygon": { "nb_sides": 3 }
                },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 4, "random": true }, // Slightly larger for triangles
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2.5, "out_mode": "bounce" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" }
                },
                "modes": {
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.8 } }
                }
            },
            "retina_detect": true
        });
    }

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Detect mobile to reduce animation costs
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    // Make animations fast across all devices (short durations)
    const heroDuration = isMobile ? 0.45 : 0.45;
    const heroStagger = isMobile ? 0.06 : 0.06;
    const sectionDuration = isMobile ? 0.35 : 0.35;
    const paraDuration = isMobile ? 0.35 : 0.35;

    // Hero Text Animation (faster on mobile)
    gsap.from(".animate-text", {
        y: 30,
        opacity: 0,
        duration: heroDuration,
        stagger: heroStagger,
        ease: "power3.out",
        delay: 0.25
    });

    // Section Reveals (excluding skills which load immediately)
    // Section Reveals (excluding skills which load immediately)
    if (!isMobile) {
        gsap.utils.toArray('section').forEach(section => {
            // Skip animations for skills section - skills load immediately on page load
            if (section.id === 'skills') {
                return;
            }
            
            const elems = section.querySelectorAll('h2, .project-card, .article-card');
            if (elems.length > 0) {
                gsap.fromTo(elems,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: sectionDuration,
                        stagger: isMobile ? 0.06 : 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                        }
                    }
                );
            }
        });
    }

    // Paragraph Reveal (Entrance Animation)
    // Paragraph Reveal (Entrance Animation)
    if (!isMobile) {
        gsap.utils.toArray('.reveal-text').forEach(text => {
            gsap.fromTo(text,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: paraDuration,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: text,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // 3. Three.js Background Element (Simple Rotating 3D Object)
    // Disable heavy 3D on mobile to improve performance and visibility
    if (!isMobile) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('webgl-container').appendChild(renderer.domElement);

        // Create a geometric shape (Particle Torus Knot)
        const geometry = new THREE.TorusKnotGeometry(10, 3, 150, 20);
        const material = new THREE.PointsMaterial({
            color: 0xcccccc,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Points(geometry, material);
        scene.add(sphere);

        camera.position.z = 35;

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.008;
            sphere.position.y = Math.sin(Date.now() * 0.0008) * 2;
            renderer.render(scene, camera);
        }
        animate();
    } else {
        const web = document.getElementById('webgl-container');
        if (web) web.style.display = 'none';
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Project Card Hover Effect (Radial Gradient Follow)
    // REMOVED old logic to replace with 3D TILT

    // 4. 3D Tilt Effect for Cards
    // Disable tilt effects on touch devices / mobile
    if (!isMobile) {
        document.querySelectorAll('.project-card, .skill-item, .info-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            // Update gradient position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // 5. Custom Cursor Trail (Simple visual "heaviness") - disable on mobile
    if (!isMobile) {
        const cursorDot = document.createElement('div');
        cursorDot.style.width = '20px';
        cursorDot.style.height = '20px';
        cursorDot.style.border = '2px solid white';
        cursorDot.style.borderRadius = '50%';
        cursorDot.style.position = 'fixed';
        cursorDot.style.pointerEvents = 'none';
        cursorDot.style.zIndex = '9999';
        cursorDot.style.transform = 'translate(-50%, -50%)';
        cursorDot.style.transition = 'transform 0.1s ease, width 0.3s, height 0.3s';
        cursorDot.style.mixBlendMode = 'difference';
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // Hover expand effect
        document.querySelectorAll('a, button, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.width = '50px';
                cursorDot.style.height = '50px';
                cursorDot.style.backgroundColor = 'rgba(255,255,255,0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.width = '20px';
                cursorDot.style.height = '20px';
                cursorDot.style.backgroundColor = 'transparent';
            });
        });
    }

    // Skills section now works on all devices - removed "Coming Soon" message

});
