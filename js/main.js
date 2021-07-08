import { RTCG } from './../src/rtcg-app/RTCG.js';

// create main method
function main() {
    // setup RTCG App

    const container = document.querySelector('#scene-container');

    // RTGC instance
    const rtcg = new RTCG(container);
    // render scene
    rtcg.start();
    // rtcg.render();
    // document.getElementById("earth").addEventListener("click", rtcg.updateControls()); 
}

main();