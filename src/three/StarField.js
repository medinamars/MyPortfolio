import * as THREE from 'three';

export class StarField {
  constructor(count = 2000) {
    this.points = null;
    this.create(count);
  }

  create(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xE8E0D8,
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
    this.points = new THREE.Points(geometry, material);
  }

  add(scene) {
    scene.add(this.points);
  }
}
