import { OrbitControls } from 'https://unpkg.com/three@0.117.0/examples/jsm/controls/OrbitControls.js';

let distance = 5;

function setCameraDistance(distanceVal) {
    distance = distanceVal;
}

function createControls(camera, canvas) {
    camera.position.set(0, 0, distance);
    camera.rotation.set(0, 0, 0);
    
    const controls = new OrbitControls(camera, canvas);

    controls.enableDampening = true;
    controls.tick = () => controls.update();

    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;

    
    
    // controls.enabled = false;
    // controls.saveState();
    // controls.reset();
    // controls.dispose();

    return controls;
}

export { createControls, setCameraDistance }