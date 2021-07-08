import { ShaderMaterial, BackSide, AdditiveBlending, Color } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function vertexShader() {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        float intensity = pow( 0.7 - dot( vUv, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z) * intensity, 1.0);
        // gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
      }
  `
}

function createHaloShader() {
    return new ShaderMaterial ( 
        {
          uniforms: { 
            colorA: {type: 'vec3', value: new Color(0xFFA23E)},
            colorB: {type: 'vec3', value: new Color(0xffffff)}
          },
          vertexShader: vertexShader(),
          fragmentShader: fragmentShader(),
          side: BackSide,
          blending: AdditiveBlending,
          transparent: true
        }   
    );
}

export { createHaloShader }