import { DirectionalLight, AmbientLight, HemisphereLight, PointLight } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function createDirectionalLight(colour, intensity) {
    return new DirectionalLight(colour, intensity);
}

function createHemisphereLight(skyColour, groundColour, intensity) {
    return new HemisphereLight(skyColour, groundColour, intensity);
}

function createAmbientLight(colour) {
    return new AmbientLight(colour);
}

function createPointLight(colour, intensity, distance) {
    return new PointLight(colour, intensity, distance);
}



export { createDirectionalLight, createHemisphereLight, createAmbientLight, createPointLight }