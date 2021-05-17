utilities()

function utilities() {

    /* ---------- generate fps counter ---------- */
    const fps_element = document.querySelector("#fps_counter");

    let passed = 0;

    function render(current) {
        current *= 0.001;

        const deltaTime = current - passed;
        passed = current;

        const fps = 1 / deltaTime;
        fps_element.textContent = fps.toFixed(1);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}