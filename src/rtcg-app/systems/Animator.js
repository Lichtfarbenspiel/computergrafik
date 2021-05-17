class Animator {

    constructor (render, object) {
        this.render = render;
        this.object = object;
    }

    start () {
        this.animate();
    }

    animate() {
        this.object.rotation.x += 0.01;
        this.object.rotation.y += 0.01;

        this.render();
        window.requestAnimationFrame(() => {
            this.animate();
        });
    }
}

export {Animator}