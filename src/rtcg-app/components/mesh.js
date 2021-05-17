import { BoxBufferGeometry, Mesh, MeshPhysicalMaterial, MeshBasicMaterial, TextureLoader, FrontSide, PlaneBufferGeometry, SphereBufferGeometry, MathUtils } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

let loader = new TextureLoader();

function createCube() {
    const geometry = new BoxBufferGeometry(2, 2, 2);
    const material = new MeshBasicMaterial({color: 0x0000FF});
    material.roughness = 0.5;

    const cube_materials = [
        new MeshBasicMaterial({map: loader.load('./../../img/concrete.jpg'), side: FrontSide}),
        new MeshBasicMaterial({map: loader.load('./../../../img/concrete.jpg'), side: FrontSide}),
        new MeshBasicMaterial({map: loader.load('./../../../img/concrete.jpg'), side: FrontSide}),
        new MeshBasicMaterial({map: loader.load('./../../../img/concrete.jpg'), side: FrontSide}),
        new MeshBasicMaterial({map: loader.load('./../../../img/concrete.jpg'), side: FrontSide}),
        new MeshBasicMaterial({map: loader.load('./../../../img/concrete.jpg'), side: FrontSide})
    ];
    cube_materials.metalness = 1;

    const cube = new Mesh(geometry, cube_materials);

    const rad_perSecond = MathUtils.degToRad(25);

    cube.tick = (delta) => {
        // Erhöhung der Werte pro Frame
        cube.rotation.z += rad_perSecond * delta;
        cube.rotation.x += rad_perSecond * delta;
        cube.rotation.y += rad_perSecond * delta;
    };

    return cube;
}

function createPlane() {
    const geometry = new PlaneBufferGeometry(6, 6, 1);
    const material = new MeshPhysicalMaterial( {map: loader.load('./../../img/floor_tiles/floor_tiles_06_diff_4k.jpg')} );

    material.roughnessMap = loader.load('./../../img/floor_tiles/floor_tiles_06_rough_4k.jpg');
    material.normalMap = loader.load('./../../img/floor_tiles/floor_tiles_06_nor_4k.jpg');
    material.metalnessMap = loader.load('./../../img/floor_tiles/floor_tiles_06_spec_4k.jpg');
    material.roughness = 1;
    material.metalness = 0.1;

    const plane = new Mesh(geometry, material);
    plane.position.set(0, -1.75, 0);
    plane.rotateX(-1.5);

    return plane;
}

function createSphere(radius, widthSegments, heightSegments, colour, metalness) {
    const geometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
    const material = new MeshPhysicalMaterial( {map: loader.load('./../../img/green_metal_rust/green_metal_rust_diff_1k.jpg')} );

    material.roughnessMap = loader.load('./../../img/green_metal_rust/green_metal_rust_rough_1k.jpg');
    material.normalMap = loader.load('./../../img/green_metal_rust/green_metal_rust_Nor_1k.jpg');
    material.metalnessMap = loader.load('./../../img/green_metal_rust/green_metal_rust_spec_1k.jpg');
    material.metalness = 0.6;
    material.roughness = 0.6;

    const sphere = new Mesh(geometry, material);
    
    const rad_perSecond = MathUtils.degToRad(25);

    sphere.tick = (delta) => {
        // Erhöhung der Werte pro Frame
        sphere.rotation.z += rad_perSecond * delta;
        sphere.rotation.x += rad_perSecond * delta;
        sphere.rotation.y += rad_perSecond * delta;
    };

    return sphere;
}

export { createPlane, createCube, createSphere }