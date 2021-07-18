import { Object3D, UniformsUtils, Mesh, MeshPhysicalMaterial, MeshBasicMaterial, TextureLoader, BackSide, ShaderMaterial, ShaderLib, SphereBufferGeometry, MathUtils, Euler, MeshPhongMaterial, BufferGeometry, BufferAttribute, PointsMaterial, Points, BoxGeometry } from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { createHaloShader, createFresnelShader, vertexShaderFresnel, fragmentShaderFresnel, createPerlinNoiseShader } from '../systems/shader.js';

let loader = new TextureLoader();
let rad_perSecond = MathUtils.degToRad(25);

function createBox(width, height, depth) {

    const geometry = new BoxGeometry(width, height, depth);
    // const geometry = new BufferGeometry;
    // const mat = createPerlinNoiseShader();

    const particlesCount = 10000000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 10);
    }

    geometry.setAttribute('position', new BufferAttribute(posArray, 3));

    const mat = new PointsMaterial({size: 0.005});
    // mat.side = BackSide;

    const box = new Points(geometry, mat);

    return box;
}

function createObject3D(speed = 0) {
    const obj3D = new Object3D();
    obj3D.tick = (delta) => {
        // Erhöhung der Werte pro Frame
        // sphere.rotation.z += rad_perSecond * delta;
        // sphere.rotation.x += rad_perSecond * delta;
        // sphere.rotation.y += rad_perSecond * delta;
        obj3D.rotateY(rad_perSecond * delta * speed);
    };

    return obj3D;
}

function createSphere(radius, widthSegments, heightSegments, texture = null, material = null, speed = 0, metalness = 0.5, roughness = 0.5, specularmap = null, normalmap = null, bumpmap = null, transparent = false, opacity = 1) {
    const geometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
    var mat;

    var shader = createFresnelShader();
    // var uniforms = UniformsUtils.clone(shader.uniforms);
    // // uniforms[ "tCube" ].value = textureCube;

    // var parameters = {
    //     fragmentShader: shader.fragmentShader,
    //     vertexShader: shader.vertexShader,
    //     uniforms: uniforms
    // };


    if (texture) {
        mat = new MeshPhongMaterial({ map: loader.load(texture) });

        mat.uniforms = shader.uniforms;
        mat.vertexShader = shader.vertexShader;
        mat.fragmentShader = shader.fragmentShader;
        mat.normalMap = loader.load(normalmap);
        mat.metalnessMap = loader.load(specularmap);
        mat.bumpMap = loader.load(bumpmap);
        mat.specularMap = loader.load(specularmap);
    }

    if (material) {
        mat = material;
    }
    
    mat.metalness = metalness;
    mat.roughness = roughness;
    mat.transparent = transparent;
    mat.opacity = opacity;

    const sphere = new Mesh(geometry, mat);

    sphere.tick = (delta) => {
        // Erhöhung der Werte pro Frame
        // sphere.rotation.z += rad_perSecond * delta;
        // sphere.rotation.x += rad_perSecond * delta;
        // sphere.rotation.y += rad_perSecond * delta;
        sphere.rotateY(rad_perSecond * delta * speed);
    };

    return sphere;
}


function createSolarSystem(solarSystem) {
    const solarSystemObj3D = createObject3D(0);

    Object.values(solarSystem).forEach(element => {
        var rotatingObj = createObject3D(element.orbitspeed /100);
        if (element.type != "halo") {
            var satellite;
            var camObj = new createObject3D();
            // const satellite =  createSphere(element.diameter/2, element.width, element.height, element.texture, element.material, element.speed, element.metalness, element.roughness, element.specularmap, element.normalmap, element.bumpmap, element.transparent, element.opacity);
            switch (element.type) {
                case "sun":
                    satellite =  createSphere(element.diameter/2 , element.width, element.height, element.texture, element.material, element.speed, element.metalness, element.roughness, element.specularmap, element.normalmap, element.bumpmap, element.transparent, element.opacity);
                    rotatingObj.add(satellite);
                    break;
                case "earth":
                    camObj.position.set(element.distance/30, 0, 0);
                    satellite =  createSphere(element.diameter * 5, element.width, element.height, element.texture, element.material, element.speed, element.metalness, element.roughness, element.specularmap, element.normalmap, element.bumpmap, element.transparent, element.opacity);
                    

                    const clouds =  createSphere(element.clouds.diameter * 5, element.clouds.width, element.clouds.height, element.clouds.texture, element.clouds.material, element.clouds.speed, element.clouds.metalness, element.clouds.roughness, element.clouds.specularmap, element.clouds.normalmap, element.clouds.bumpmap, element.clouds.transparent, element.clouds.opacity);
                    const earthObj3D = new createObject3D(element.moon.orbitspeed);
                    const moon =  createSphere(element.moon.diameter * 5, element.moon.width, element.moon.height, element.moon.texture, element.moon.material, element.moon.speed, element.moon.metalness, element.moon.roughness, element.moon.specularmap, element.moon.normalmap, element.moon.bumpmap, element.moon.transparent, element.moon.opacity);
                    moon.position.set(element.moon.distance/10, 0, 0);
                    
                    earthObj3D.add(moon);
                    satellite.add(clouds, earthObj3D);
                    camObj.add(satellite);
                    rotatingObj.add(camObj);
                    solarSystemObj3D.add(rotatingObj);
                    break;
                case "planet":
                    camObj.position.set(element.distance/30, 0, 0);
                    satellite =  createSphere(element.diameter * 5, element.width, element.height, element.texture, element.material, element.speed, element.metalness, element.roughness, element.specularmap, element.normalmap, element.bumpmap, element.transparent, element.opacity);
                    camObj.add(satellite);
                    rotatingObj.add(camObj);
                    solarSystemObj3D.add(rotatingObj);
                    break;
            }
            solarSystemObj3D.add(rotatingObj);
        } else {
            const satellite =  createSphere(element.diameter/2 , element.width, element.height, element.texture, createHaloShader(), element.speed, element.metalness, element.roughness, element.specularmap, element.normalmap, element.bumpmap, element.transparent, element.opacity);
            solarSystemObj3D.add(satellite);
        }
    });
    
    console.log(solarSystemObj3D);
    return solarSystemObj3D;
}

export { createObject3D, createSphere, createSolarSystem, createBox }