import { ShaderMaterial, BackSide, AdditiveBlending, Color, Vector3, DoubleSide } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

// Stars Shader source: https://discourse.threejs.org/t/starry-shader-for-sky-sphere/7578/16
function vertexShaderStars() {
  return `
    varying vec3 vPos;

    void main() {
      vPos = position;
      vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }
  `
}

function fragmentShaderStars() {
  return `
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }

    varying vec3 vPos;
    uniform float skyRadius;
    uniform vec3 noiseOffset;

    uniform vec3 env_c1;
    uniform vec3 env_c2;

    uniform float clusterSize;
    uniform float clusterStrength;

    uniform float starSize;
    uniform float starDensity;

    void main() {
      float freq = 1.1/skyRadius;
      float noise = cnoise(vPos * freq);
      vec4 backgroundColor = vec4(mix(env_c1, env_c2, noise), 1.0);

      float scaledClusterSize = (1.0/clusterSize)/skyRadius;
      float scaledStarSize = (1.0/starSize)/skyRadius;

      float cs = pow(abs(cnoise(scaledClusterSize*vPos+noiseOffset)),1.0/clusterStrength) + cnoise(scaledStarSize*vPos);

      float c =clamp(pow(abs(cs), 1.0/starDensity),0.0,1.0);
      vec4 starColor = 0.5*vec4(c, c, c, 1.0);

      gl_FragColor = backgroundColor;
      gl_FragColor += starColor;
    }
`
}

function createStarShader(skyDomeRadius) {
  return new ShaderMaterial ( 
      {
        uniforms: { 
          skyRadius: { value: skyDomeRadius },
          env_c1: { value: new Color(0x050a12) },
          env_c2: { value: new Color(0x021413) },
          noiseOffset: { value: new Vector3(100.01, 100.01, 100.01) },
          starSize: { value: 0.003 },
          starDensity: { value: 0.12 },
          clusterStrength: { value: 0.2 },
          clusterSize: { value: 0.2 },
        },
        vertexShader: vertexShaderStars(),
        fragmentShader: fragmentShaderStars(),
        side: DoubleSide,
      }   
  );
}

function vertexShaderHalo() {
  return `
    // uniform vec3 viewVector;
    // varying float intensity;
    // void main() {
    //   gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    //   vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
    //   intensity = pow( dot(normalize(viewVector), actual_normal), 6.0 );
    // }
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShaderHalo() {
    return `
      // varying float intensity;
      // void main() {
      //   vec3 glow = vec3(0, 1, 0) * intensity;
      //   gl_FragColor = vec4( glow, 1.0 );
      // }
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
          vertexShader: vertexShaderHalo(),
          fragmentShader: fragmentShaderHalo(),
          side: BackSide,
          blending: AdditiveBlending,
          transparent: true
        }   
    );
}


function vertexShaderFresnel() {
  return `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
      vec3 I = worldPosition.xyz - cameraPosition;
    
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
      gl_Position = projectionMatrix * mvPosition;
    }
  `
}

function fragmentShaderFresnel() {
  return `
    
  uniform vec3 color1;
  uniform vec3 color2;

  varying float vReflectionFactor;

  void main() {
    gl_FragColor = vec4(mix(color2, color1, vec3(clamp( vReflectionFactor, 0.0, 1.0 ))), 0.25);
  }
  `
}

function createFresnelShader() {
  return new ShaderMaterial (
    {
      uniforms: {
        color1: {
          type: "c",
          value: new Color(0xffffff),
        },
        color2: {
          type: "c",
          value: new Color(0x000000),
        },
        fresnelBias: {
          type: "f",
          value: 0.1,
        },
        fresnelScale: {
          type: "f",
          value: 1.5,
        },
        fresnelPower: {
          type: 'f',
          value: 2.5,
        }
      },
      vertexShader: vertexShaderFresnel(),
      fragmentShader: fragmentShaderFresnel(),
    }   
  );
}


export { createHaloShader, createFresnelShader, fragmentShaderFresnel, vertexShaderFresnel, createStarShader }

// {
//   uniforms: {

//     "mRefractionRatio": { type: "f", value: 1.02 },
//     "mFresnelBias": { type: "f", value: 0.1 },
//     "mFresnelPower": { type: "f", value: 2.0 },
//     "mFresnelScale": { type: "f", value: 1.0 },
//     "tCube": { type: "t", value: null }
//   },

//   vertexShader: [

//     "uniform float mRefractionRatio;",
//     "uniform float mFresnelBias;",
//     "uniform float mFresnelScale;",
//     "uniform float mFresnelPower;",

//     "varying vec3 vReflect;",
//     "varying vec3 vRefract[3];",
//     "varying float vReflectionFactor;",

//     "void main() {",

//         "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
//         "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

//         "vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, ",
//         "    modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

//         "vec3 I = worldPosition.xyz - cameraPosition;",

//         "vReflect = reflect( I, worldNormal );",
//         "vRefract[0] = refract( normalize( I ), worldNormal, ",
//         "    mRefractionRatio );",
//         "vRefract[1] = refract( normalize( I ), worldNormal, ",
//         "    mRefractionRatio * 0.99 );",
//         "vRefract[2] = refract( normalize( I ), worldNormal, ",
//         "    mRefractionRatio * 0.98 );",
//         "vReflectionFactor = mFresnelBias + mFresnelScale * ",
//         "    pow( 1.0 + dot( normalize( I ), worldNormal ), ",
//         "    mFresnelPower );",

//         "gl_Position = projectionMatrix * mvPosition;",

//     "}"
//   ],
//     fragmentShader: [

//       "uniform samplerCube tCube;",

//       "varying vec3 vReflect;",
//       "varying vec3 vRefract[3];",
//       "varying float vReflectionFactor;",

//       "void main() {",

//           "vec4 reflectedColor = textureCube( tCube, ",
//           "    vec3( -vReflect.x, vReflect.yz ) );",
//           "vec4 refractedColor = vec4( 1.0 );",

//           "refractedColor.r = textureCube( tCube, ",
//           "    vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
//           "refractedColor.g = textureCube( tCube, ",
//           "    vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
//           "refractedColor.b = textureCube( tCube, ",
//           "    vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",

//           "gl_FragColor = mix( refractedColor, ",
//           "    reflectedColor, clamp( vReflectionFactor, ",
//           "    0.0, 1.0 ) );",
//       "}"
//   ]
// }
// );

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

// function vertexShaderFresnel() {
//   return `
//     uniform float fresnelBias;
//     uniform float fresnelScale;
//     uniform float fresnelPower;
    
//     varying float vReflectionFactor;
    
//     void main() {
//       vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//       vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
//       vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
//       vec3 I = worldPosition.xyz - cameraPosition;
    
//       vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
//       gl_Position = projectionMatrix * mvPosition;
//     }
//   `
// }

// function fragmentShaderFresnel() {
//   return `
//     uniform vec3 color1;
//     uniform vec3 color2;
    
//     varying float vReflectionFactor;
    
//     void main() {
//       gl_FragColor = vec4(mix(color2, color1, vec3(clamp( vReflectionFactor, 0.0, 1.0 ))), 1.0);
//     }
//   `
// }