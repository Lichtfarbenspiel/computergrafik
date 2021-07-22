import { PerspectiveCamera } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        35, 1, 0.1, 3000
    );

    // camera.position.set(0, 0, 5);
    // camera.rotation.set(0, 0, 0);
    // camera.up.set(0, 0, 1);

    return camera;
}

export { createCamera }