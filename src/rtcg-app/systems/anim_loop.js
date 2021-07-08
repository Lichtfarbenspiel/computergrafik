import { Clock } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

const clock = new Clock();

class Anim_loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.animated_objects = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            //Teile jedem animierten Objekt mit, dass es einen Framevorwärts "ticken" soll
            this.tick();
            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        //Aktualisierung der Animationen(Code)
        const delta = clock.getDelta()
        for (const object of this.animated_objects) {
            object.tick(delta);
        }
    }
}

export { Anim_loop }