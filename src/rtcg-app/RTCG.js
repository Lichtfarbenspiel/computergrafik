import { createCamera } from './components/camera.js';
import { createObject3D, createSolarSystem, createSphere } from './components/mesh.js';
import { createScene } from './components/scene.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { createAmbientLight, createDirectionalLight, createHemisphereLight, createPointLight } from './components/light.js';
import { Anim_loop } from './systems/anim_loop.js';
import { createControls } from './systems/control.js';



let camera;
let renderer;
let scene;
let anim_loop;
let solarSystemObj
let controls;


class RTCG {
    // create instance of RTCG App

    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        anim_loop = new Anim_loop(camera, scene, renderer);

        container.append(renderer.domElement);

        const hemisphereLight = createHemisphereLight(0xffffbb, 0x080820, 1);

        const directLight = createDirectionalLight(0xfffff, 1);
        directLight.position.set(0, -100, -100);

        const directLight2 = createDirectionalLight(0xFFff80, 1);
        directLight2.position.set(100, -100, 100);

        scene.add(hemisphereLight, directLight);

        const ambientLight = createAmbientLight(0xffffbb);
        scene.add(ambientLight);

        
       // SOLAR SYSTEM

       const solarSystem = {
            sun: {
                type: "sun",
                diameter: 1,
                width: 32,
                height: 32,
                texture: './../../img/sun.jpg',
                material: null,
                speed:  0.2160000, // 25 Days rotation
                metalness: 0.2,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                orbitspeed: 0, // 25 Days rotation
            },
            halo: {
                type: "halo",
                diameter: 1 * 1.5,
                width: 32,
                height: 32,
                texture: null,
                material: null,
                speed: 0, // 25 Days
                metalness: 0.2,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                orbitspeed: 0
            },
            mercury: {
                type: "planet",
                diameter: 0.0035,
                width: 28,
                height: 28,
                texture: './../../img/mercurymap.jpg',
                material: null,
                speed: 0.5097600, // 59 days
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 41,
                orbitspeed: 0.7603200 // 88 Days                
            },
            venus: {
                type: "planet",
                diameter: 0.0068,
                width: 28,
                height: 28,
                texture: './../../img/venus.jpg',
                material: null,
                speed: 0.20995200, // 243 Days
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 77,
                orbitspeed: 0.19440000 // 225 Days 
            },
            earth: {
                type: "earth",
                diameter: 0.0091,
                width: 28,
                height: 28,
                texture: './../../img/earth_map.jpg',
                material: null,
                speed: 0.86400, // 1 Day
                metalness: 1,
                roughness: 0,
                specularmap: './../../img/earth_specular_map.png',
                normalmap: './../../img/earth_normal_map.tif',
                bumpmap: './../../img/earth_bump_map.jpg',
                transparent: false,
                opacity: null,
                distance: 107,
                orbitspeed: 0.31536000, // 365 Days
                clouds: {
                    diameter: 0.0091,
                    width: 28,
                    height: 28,
                    texture: './../../img/earth_clouds.jpg',
                    material: null,
                    speed: 0.2,
                    metalness: 0,
                    roughness: 0,
                    specularmap: null,
                    normalmap: null,
                    bumpmap: null,
                    transparent: true,
                    opacity: 0.5,
                    distance: null,
                    orbitspeed: null
                },
                moon: {
                    diameter: 0.0025,
                    width: 24,
                    height: 24,
                    texture: './../../img/moon2.jpg',
                    material: null,
                    speed: 0,
                    metalness: 0,
                    roughness: 0.6,
                    specularmap: './../../img/moon_specular_map.jpg',
                    normalmap: null,
                    bumpmap: null,
                    transparent: false,
                    opacity: null,
                    distance: 0.8, //0.275,
                    orbitspeed: 0.5
                }
            },
            mars: {
                type: "planet",
                diameter: 0.0049,
                width: 28,
                height: 28,
                texture: './../../img/mars.jpg',
                material: null,
                speed: 0.86400, // 1 Day
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 163,
                orbitspeed: 0.59356800 // 687 Days 
            },
            jupiter: {
                type: "planet",
                diameter: 0.102,
                width: 28,
                height: 28,
                texture: './../../img/jupiter.jpg',
                material: null,
                speed: 0.32400, // 9 Hours
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 556,
                orbitspeed: 0.5
            },
            saturn: {
                type: "planet",
                diameter: 0.086,
                width: 28,
                height: 28,
                texture: './../../img/saturn.jpg',
                material: null,
                speed: 0,
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 1019,
                orbitspeed: 0.5
            },
            uranus: {
                type: "planet",
                diameter: 0.037,
                width: 28,
                height: 28,
                texture: './../../img/uranusmap.jpg',
                material: null,
                speed: 0,
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 2051,
                orbitspeed: 0.5
            },
            neptune: {
                type: "planet",
                diameter: 0.035,
                width: 28,
                height: 28,
                texture: './../../img/neptune.jpg',
                material: null,
                speed: 0,
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 3213,
                orbitspeed: 0.5
            },
            pluto: {
                type: "planet",
                diameter: 0.0016,
                width: 28,
                height: 28,
                texture: './../../img/pluto.jpg',
                material: null,
                speed: 0,
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 4219,
                orbitspeed: 0.5
            }
        };

        solarSystemObj = createSolarSystem(solarSystem);
        scene.add(solarSystemObj);

        // Controls
        controls = createControls(camera, renderer.domElement);
        controls.enablePan = true;   


        anim_loop.animated_objects.push(solarSystemObj.children[0].children[0]);

        console.log(solarSystemObj.children.length);

        for (let i = 2; i < solarSystemObj.children.length; i++) {
            solarSystemObj.children[i].children.forEach(element => {
                anim_loop.animated_objects.push(element);
           });
            anim_loop.animated_objects.push(solarSystemObj.children[i]);
        }
        

        console.log(anim_loop.animated_objects);
        const resizer = new Resizer(container, camera, renderer);
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

    // updateControls() {
    //     console.log("test");
    // }
}

export { RTCG };