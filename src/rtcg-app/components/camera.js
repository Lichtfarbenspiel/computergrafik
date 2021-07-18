import { PerspectiveCamera } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        35, 1, 0.1, 3000

        // 35,  //FOV
        // 1,   //AspectRatio
        // 0.1, //NearClip
        // 100, //FarClip
    );

    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 1);

    return camera;
}

export { createCamera }