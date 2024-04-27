import * as THREE from 'three';

let scene = null;
let animationRequest = null;

const getRandomParticlePos = (particleCount) => {
    return new Float32Array(particleCount * 0.5).map(() => (Math.random() - 0.5) * 10);
};

const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const needResize =
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight;
    if (needResize) renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    return needResize;
};

let mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const animate = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.5, 5);
    camera.position.z = 2;

    const geometry1 = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(getRandomParticlePos(350), 3));
    const geometry2 = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(getRandomParticlePos(1500), 3));

    const loader = new THREE.TextureLoader();
    const material1 = new THREE.PointsMaterial({ size: 0.05, map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp1.png"), transparent: true });
    const material2 = new THREE.PointsMaterial({ size: 0.075, map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"), transparent: true });

    const starsT1 = new THREE.Points(geometry1, material1);
    const starsT2 = new THREE.Points(geometry2, material2);
    scene.add(starsT1);
    scene.add(starsT2);

    const updateCameraAspect = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    const updateStarPositions = () => {
        starsT1.position.x = mouseX * 0.0001;
        starsT1.position.y = mouseY * -0.0001;
        starsT2.position.x = mouseX * 0.0001;
        starsT2.position.y = mouseY * -0.0001;
    }

    const updateStarBrightness = () => {
        const distanceThreshold = 3.5;
        const cameraPosition = camera.position;

        starsT1.material.opacity = Math.max(0, 1 - Math.abs(starsT1.position.distanceTo(cameraPosition)) / distanceThreshold);
        starsT2.material.opacity = Math.max(0, 1 - Math.abs(starsT2.position.distanceTo(cameraPosition)) / distanceThreshold);
    }

    const render = (time) => {
        if (resizeRendererToDisplaySize(renderer)) updateCameraAspect();
        updateStarPositions();
        updateStarBrightness();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    animationRequest = requestAnimationFrame(render);
};

const deleteScene = () => {
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            object.material.dispose();
        }
    });

    scene.background = null;
    scene = null;

    clearInterval(displayCheckInterval);
    cancelAnimationFrame(animationRequest);
};

const checkIntroDisplay = () => {
    const introDisplay = $('#intro').css('display');
    if (introDisplay === 'none') deleteScene();
};

animate();
const displayCheckInterval = setInterval(checkIntroDisplay, 500);