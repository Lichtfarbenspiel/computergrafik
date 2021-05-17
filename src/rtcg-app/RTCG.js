import { createCamera } from './components/camera.js';
import { createCube, createSphere } from './components/mesh.js';
import { createPlane } from './components/mesh.js';
import { createScene } from './components/scene.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { createAmbientLight, createDirectionalLight, createHemisphereLight } from './components/light.js';
import { Animator } from './systems/Animator.js';
import { Anim_loop } from './systems/anim_loop.js';


let camera;
let renderer;
let scene;
let anim_loop;


class RTCG {
    // create instance of RTCG App

    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        anim_loop = new Anim_loop(camera, scene, renderer);

        container.append(renderer.domElement);

        const hemisphereLight = createHemisphereLight(0xffffbb, 0x080820, 1);
        // hemisphereLight.position.set(0, 1, 0);
        const directLight = createDirectionalLight(0xFFFFF0, 0.8);
        directLight.position.set(0, 10, 0);

        const directLight2 = createDirectionalLight(0xFF0000, 1);
        directLight2.position.set(6, -1, 6);

        scene.add(hemisphereLight, directLight, directLight2);

        // const ambientLight = createAmbientLight(0x404040);
        // scene.add(ambientLight);

        // const materialSrc = './../../../img/concrete.jpg';
        // cube = createCube();
        // scene.add(cube);

        const sphere = createSphere(1, 32, 32, 0xE0E0E0, 1);
        const plane = createPlane();

        anim_loop.animated_objects.push(sphere);
        scene.add(sphere, plane);

        const resizer = new Resizer(container, camera, renderer);
        // const animator = new Animator(this.render, sphere);
        // animator.start();

        // resizer.now_resize = () => {
        //     this.render();
        // }
    }

    render() {
        renderer.render(scene, camera);
    }

    start() {
        anim_loop.start();
    }

    stop() {
        anim_loop.stop();
    }
}

export { RTCG };