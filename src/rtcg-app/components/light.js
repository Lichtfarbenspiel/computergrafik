import { DirectionalLight, AmbientLight, HemisphereLight } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function createDirectionalLight(colour, intensity) {
    return new DirectionalLight(colour, intensity);
}

function createHemisphereLight(skyColour, groundColour, intensity) {
    return new HemisphereLight(skyColour, groundColour, intensity);
}

function createAmbientLight(colour) {
    return new AmbientLight(colour);
}


export { createDirectionalLight, createHemisphereLight, createAmbientLight }