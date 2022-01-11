import { createCamera } from './components/camera.js';
import { createSkyBox, createSolarSystem } from './components/mesh.js';
import { createScene } from './components/scene.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { createHemisphereLight, createPointLight } from './components/light.js';
import { Anim_loop } from './systems/anim_loop.js';
import { createControls } from './systems/control.js';


let camera;
let renderer;
let scene;
let anim_loop;
let solarSystemObj
let controls;
let gui;


class RTCG {
    // create instance of RTCG App

    constructor(container) {
       // SOLAR SYSTEM
        const solarSystemParams = {
            sun: {
                diameter: 2 // factor diameter is divided by
            },
            planets: {
                speed: 0,
                distance: 30, // factor distance is devided by 
                diameter: 5 // factor diameter is multiplied by
            },
            moon: {
                distance: 10, // factor distance is devided by 
                diameter: 5 // factor diameter is multiplied by
            },
            orbitspeed: 100 // factor each planet's orbit speed is devided by 
        }

       const solarSystem = {
            sun: {
                type: "sun",
                diameter: 1,
                width: 32,
                height: 32,
                texture: './computergrafik/img/sun.jpg',
                material: null,
                speed:  0.2160000, // 25 Days rotation
                metalness: 1,
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
                diameter: 1.6,
                width: 32,
                height: 32,
                texture: null,
                material: null,
                speed: 0, // 25 Days
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: true,
                opacity: 0,
                orbitspeed: 0
            },
            mercury: {
                type: "planet",
                diameter: 0.0035,
                width: 28,
                height: 28,
                texture: './../../img/mercurymap.jpg',
                material: null,
                speed: 0.0030083333333333, // 1000 m/s                src="https://ourplnt.com/relative-rotation-speeds-of-the-planets/#axzz70UXVk7Qe"
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 41,
                orbitspeed: 47.36 // 1000 m/s      src="https://rechneronline.de/planeten/geschwindigkeit.php"         
            },
            venus: {
                type: "planet",
                diameter: 0.0068,
                width: 28,
                height: 28,
                texture: './../../img/venus.jpg',
                material: null,
                speed: -0.0018111111111111, // 1000 m/s 
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 77,
                orbitspeed: 35.02  // 1000 m/s   
            },
            earth: {
                type: "earth",
                diameter: 0.0091,
                width: 28,
                height: 28,
                texture: './../../img/earth_map.jpg',
                material: null,
                speed: 0.000465, // 1000 m/s
                metalness: 1,
                roughness: 0,
                specularmap: './../../img/earth_specular_map.png',
                normalmap: './../../img/earth_normal_map.tif',
                bumpmap: './../../img/earth_bump_map.jpg',
                transparent: false,
                opacity: null,
                distance: 107,
                orbitspeed: 29.78, // 1000 m/s  
                clouds: {
                    diameter: 0.0091,
                    width: 28,
                    height: 28,
                    texture: './../../img/earth_clouds.jpg',
                    material: null,
                    speed: 0.5,
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
                    speed: 0.0362222222222222,
                    metalness: 0,
                    roughness: 0.6,
                    specularmap: './../../img/moon_specular_map.jpg',
                    normalmap: null,
                    bumpmap: null,
                    transparent: false,
                    opacity: null,
                    distance: 0.8, //0.275,
                    orbitspeed: 0.978 // 1000 m/s  
                }
            },
            mars: {
                type: "planet",
                diameter: 0.0049,
                width: 28,
                height: 28,
                texture: './../../img/mars.jpg',
                material: null,
                speed: 0.2405555555555, // 1000 m/s  
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 163,
                orbitspeed: 24 // 1000 m/s  
            },
            jupiter: {
                type: "planet",
                diameter: 0.102,
                width: 28,
                height: 28,
                texture: './../../img/jupiter.jpg',
                material: null,
                speed: 0.012661944444444, // 1000 m/s
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 556,
                orbitspeed: 13.07 // 1000 m/s 
            },
            saturn: {
                type: "planet",
                diameter: 0.086,
                width: 28,
                height: 28,
                texture: './../../img/saturn.jpg',
                material: null,
                speed: 0.010233333333333, // 1000 m/s 
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 1019,
                orbitspeed: 9.68 // 1000 m/s 
            },
            uranus: {
                type: "planet",
                diameter: 0.037,
                width: 28,
                height: 28,
                texture: './../../img/uranusmap.jpg',
                material: null,
                speed: 0.0041094444444444, // 1000 m/s 
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 2051,
                orbitspeed: 6.8 // 1000 m/s
            },
            neptune: {
                type: "planet",
                diameter: 0.035,
                width: 28,
                height: 28,
                texture: './../../img/neptune.jpg',
                material: null,
                speed: 0.0026997222222222, // 1000 m/s
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 3213,
                orbitspeed: 5.43 // 1000 m/s
            },
            pluto: {
                type: "planet",
                diameter: 0.0016,
                width: 28,
                height: 28,
                texture: './../../img/pluto.jpg',
                material: null,
                speed: 0.034225, // 1000 m/s
                metalness: 1,
                roughness: 0,
                specularmap: null,
                normalmap: null,
                bumpmap: null,
                transparent: false,
                opacity: null,
                distance: 4219,
                orbitspeed: 4.743 // 1000 m/s
            }
        };

        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        anim_loop = new Anim_loop(camera, scene, renderer);
        gui = new dat.GUI({autoPlace: true});

        container.append(renderer.domElement);

        // LIGHTS
        const hemisphereLight = createHemisphereLight(0xffffff, 0xffffff, 2);
        hemisphereLight.decay = 2;
        scene.add(hemisphereLight);

        const pointLight = createPointLight(0xFBD3A8, 1.7, 2000); // Light that is being emmited by sun
        pointLight.decay = 2;


        // SKYBOX
        const skyDomeRadius = 1500;
        const skybox = createSkyBox(skyDomeRadius, 30, 30);

        solarSystemObj = createSolarSystem(solarSystem, solarSystemParams);
        solarSystemObj.children[0].children[0].add(pointLight);

        skybox.add(solarSystemObj);
        scene.add(skybox);

        // CONTROLS
        controls = createControls(camera, renderer.domElement);
        controls.enablePan = false;  


        // ADD SOLAR OBJECTS TO ANIMATION LOOP
        anim_loop.animated_objects.push(solarSystemObj.children[0].children[0]); // add sun rotation Object to animation loop
        console.log(solarSystemObj.children.length);


        for (let i = 2; i < solarSystemObj.children.length; i++) {
            solarSystemObj.children[i].children.forEach(element => {
                anim_loop.animated_objects.push(element.children[0]); // add each planets's sattelite object to animation Loop (planet rotation)
                if ( i == 4 ) {
                    anim_loop.animated_objects.push(element.children[0].children[1], element.children[0].children[1].children[0]); // add Moon's earthObj3D and moon object to animation Loop
                }
           });
            anim_loop.animated_objects.push(solarSystemObj.children[i]); // add each planets's rotation Object to animation Loop (planet orbit)
        }
        

        // CREATE GUI
        var params  = {
            planets:'Vertical'
        };

        
        const planets = gui.add(params, 'planets', 
            ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])
            .name('planets')
            .listen();

        // Jump to selected planet    
        planets.onChange(
            function(planet) {
                console.log(planet);
                controls.object.rotation.set(0, 0, 0);
                switch (planet) {
                    case 'Sun':
                        solarSystemObj.children[0].add(camera);
                        controls.object.position.set(0, 0, 5);
                        controls.enableRotate = true;
                        controls.enableZoom = true;
                        break;
                    case 'Mercury':
                        solarSystemObj.children[2].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.5);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Venus':
                        solarSystemObj.children[3].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.5);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Earth':
                        console.log( solarSystemObj.children[4].children[0].uuid);
                        solarSystemObj.children[4].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.7);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Moon':
                        solarSystemObj.children[4].children[0].children[0].children[1].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.15);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Mars':
                        solarSystemObj.children[5].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.4);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Jupiter':
                        solarSystemObj.children[6].children[0].add(camera);
                        controls.object.position.set(0, 0, 5);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Saturn':
                        solarSystemObj.children[7].children[0].add(camera);
                        controls.object.position.set(0, 0, 4);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Uranus':
                        solarSystemObj.children[8].children[0].add(camera);
                        controls.object.position.set(0, 0, 1);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Neptune':
                        solarSystemObj.children[9].children[0].add(camera);
                        controls.object.position.set(0, 0, 1);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                    case 'Pluto':
                        solarSystemObj.children[10].children[0].add(camera);
                        controls.object.position.set(0, 0, 0.15);
                        controls.enableRotate = false;
                        controls.enableZoom = false;
                        break;
                }
            }
        );
        new Resizer(container, camera, renderer);
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
