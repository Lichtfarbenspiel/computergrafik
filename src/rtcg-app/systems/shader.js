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

// function VolumetericLightShader() {
//   return new ShaderMaterial (
//     {
//       uniforms: {
//         tDiffuse: {value:null},
//         lightPosition: {value: new Vector2(0.5, 0.5)},
//         exposure: {value: 0.18},
//         decay: {value: 0.95},
//         density: {value: 0.8},
//         weight: {value: 0.4},
//         samples: {value: 50}
//       },
    
//       vertexShader: [
//         "varying vec2 vUv;",
//         "void main() {",
//           "vUv = uv;",
//           "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
//         "}"
//       ].join("\n"),
    
//       fragmentShader: [
//         "varying vec2 vUv;",
//         "uniform sampler2D tDiffuse;",
//         "uniform vec2 lightPosition;",
//         "uniform float exposure;",
//         "uniform float decay;",
//         "uniform float density;",
//         "uniform float weight;",
//         "uniform int samples;",
//         "const int MAX_SAMPLES = 100;",
//         "void main()",
//         "{",
//           "vec2 texCoord = vUv;",
//           "vec2 deltaTextCoord = texCoord - lightPosition;",
//           "deltaTextCoord *= 1.0 / float(samples) * density;",
//           "vec4 color = texture2D(tDiffuse, texCoord);",
//           "float illuminationDecay = 1.0;",
//           "for(int i=0; i < MAX_SAMPLES; i++)",
//           "{",
//             "if(i == samples){",
//               "break;",
//             "}",
//             "texCoord -= deltaTextCoord;",
//             "vec4 sample = texture2D(tDiffuse, texCoord);",
//             "sample *= illuminationDecay * weight;",
//             "color += sample;",
//             "illuminationDecay *= decay;",
//           "}",
//           "gl_FragColor = color * exposure;",
//         "}"
//       ].join("\n") 
//     }
//   );
// }

// function AdditiveBlendingShader() {
//   return new ShaderMaterial (
//     {

//       uniforms: {
//         tDiffuse: { value:null },
//         tAdd: { value:null }
//       },
    
//       vertexShader: [
//         "varying vec2 vUv;",
//         "void main() {",
//           "vUv = uv;",
//           "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
//         "}"
//       ].join("\n"),
    
//       fragmentShader: [
//         "uniform sampler2D tDiffuse;",
//         "uniform sampler2D tAdd;",
//         "varying vec2 vUv;",
//         "void main() {",
//           "vec4 color = texture2D( tDiffuse, vUv );",
//           "vec4 add = texture2D( tAdd, vUv );",
//           "gl_FragColor = color + add;",
//         "}"
//       ].join("\n")
//     }
//   );
// }

export { createHaloShader }