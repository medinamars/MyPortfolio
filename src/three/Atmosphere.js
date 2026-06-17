import * as THREE from 'three';

export class Atmosphere {
  constructor() {
    this.mesh = null;
    this.create();
  }

  create() {
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.957, 0.541, 0.212, 1.0) * intensity;
      }
    `;
    const geometry = new THREE.SphereGeometry(2.2, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  add(scene) {
    scene.add(this.mesh);
  }
}
