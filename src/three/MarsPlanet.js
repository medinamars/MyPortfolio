import * as THREE from 'three';

const MARS_COLORS = {
  base: new THREE.Color(0xC1440E),
  dark: new THREE.Color(0x725130),
  light: new THREE.Color(0xE2725B),
  highlight: new THREE.Color(0xF48A36),
  polar: new THREE.Color(0xD4C5B2),
  crater: new THREE.Color(0x4A2C17),
};

export class MarsPlanet {
  constructor() {
    this.mesh = null;
    this.rotationSpeed = 0.001;
    this.create();
  }

  create() {
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: MARS_COLORS.base,
      roughness: 0.85,
      metalness: 0.05,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.applyBumpTexture();
    this.applyColorMap();
  }

  applyBumpTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 30 + 5;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const bumpTexture = new THREE.CanvasTexture(canvas);
    this.mesh.material.bumpMap = bumpTexture;
    this.mesh.material.bumpScale = 0.03;
  }

  applyColorMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C1440E';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 40 + 10;
      const colors = ['#E2725B', '#725130', '#B49B63', '#4A2C17', '#F48A36'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.15 + Math.random() * 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#D4C5B2';
    ctx.fillRect(0, 0, size, 40);
    ctx.fillRect(0, size - 35, size, 35);
    const colorMap = new THREE.CanvasTexture(canvas);
    this.mesh.material.map = colorMap;
    this.mesh.material.needsUpdate = true;
  }

  update(scrollProgress) {
    if (this.mesh) {
      this.mesh.rotation.y += this.rotationSpeed + scrollProgress * 0.005;
      this.mesh.rotation.x = Math.sin(scrollProgress * 0.5) * 0.1;
    }
  }
}
