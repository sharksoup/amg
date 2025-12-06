window.addEventListener('DOMContentLoaded', () => {
    // Плавное появление блоков с задержкой (если отключен prefers-reduced-motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.promo, .about, footer').forEach(el => {
            el.style.opacity = '1';
        });
    }
    // 3D Viewer Modal Logic
    const openBtn = document.getElementById('open-3d-viewer');
    const modal = document.getElementById('modal-3d');
    const closeBtn = document.getElementById('close-3d-viewer');
    let viewerInitialized = false;

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('open');
            if (!viewerInitialized) {
                initFBXViewer();
                viewerInitialized = true;
            }
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('open') && e.key === 'Escape') {
                modal.classList.remove('open');
            }
        });
    }

    // THREE.js FBX Viewer (минимальный пример)
    function initFBXViewer() {
        const container = document.getElementById('fbx-viewer-container');
        const canvas = document.getElementById('fbx-canvas');
        // Подключите three.js и FBXLoader через CDN
        if (!window.THREE) {
            const script1 = document.createElement('script');
            script1.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
            script1.onload = () => loadFBXLoader();
            document.body.appendChild(script1);
        } else {
            loadFBXLoader();
        }

        function loadFBXLoader() {
            if (!window.THREE.FBXLoader) {
                const script2 = document.createElement('script');
                script2.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/loaders/FBXLoader.js';
                script2.onload = () => startViewer();
                document.body.appendChild(script2);
            } else {
                startViewer();
            }
        }

        function startViewer() {
            // Инициализация сцены
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f5);

            const camera = new THREE.PerspectiveCamera(45, 400/320, 0.1, 1000);
            camera.position.set(0, 60, 180);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(400, 320);

            // Свет
            const light = new THREE.DirectionalLight(0xffffff, 1.1);
            light.position.set(1, 2, 2);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0xffffff, 0.7));

            // Загрузка FBX
            const loader = new THREE.FBXLoader();
            loader.load(
                'models/Snezhinka_converted.glb',
                function(object) {
                    object.scale.set(0.7, 0.7, 0.7);
                    object.position.y = -40;
                    scene.add(object);
                },
                undefined,
                function(error) {
                    console.error('Ошибка загрузки FBX:', error);
                }
            );

            // Управление мышью (простое вращение)
            let isDragging = false, prevX = 0, prevY = 0, rotationY = 0, rotationX = 0;
            canvas.addEventListener('mousedown', e => {
                isDragging = true;
                prevX = e.clientX;
                prevY = e.clientY;
            });
            window.addEventListener('mousemove', e => {
                if (!isDragging) return;
                const dx = e.clientX - prevX;
                const dy = e.clientY - prevY;
                rotationY += dx * 0.01;
                rotationX += dy * 0.01;
                prevX = e.clientX;
                prevY = e.clientY;
            });
            window.addEventListener('mouseup', () => isDragging = false);

            // Масштабирование колесом мыши
            canvas.addEventListener('wheel', e => {
                camera.position.z += e.deltaY * 0.1;
                if (camera.position.z < 60) camera.position.z = 60;
                if (camera.position.z > 400) camera.position.z = 400;
            });

            // Анимация
            function animate() {
                requestAnimationFrame(animate);
                scene.traverse(obj => {
                    if (obj.isMesh) {
                        obj.rotation.y = rotationY;
                        obj.rotation.x = rotationX;
                    }
                });
                renderer.render(scene, camera);
            }
            animate();
        }
    }
});
