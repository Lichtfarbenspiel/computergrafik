import { OrbitControls } from 'https://unpkg.com/three@0.117.0/examples/jsm/controls/OrbitControls.js';


function createControls(camera, canvas) {
    camera.position.set(0, 0, 5);
    camera.rotation.set(0, 0, 0);
    
    const controls = new OrbitControls(camera, canvas);

    controls.enableDampening = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.maxDistance = 1500;

    controls.tick = () => controls.update();

    return controls;
}



export { createControls }