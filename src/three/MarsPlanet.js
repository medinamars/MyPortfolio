import * as THREE from 'three';

export class MarsPlanet {
  constructor() {
    this.mesh = null;
    this.rotationSpeed = 0.001;
    this.create();
  }

  create() {
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.05,
      bumpScale: 0.03,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.loadTextures();
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();
    const base = import.meta.env.BASE_URL || '/';

    const diffuseMap = loader.load(`${base}textures/mars_diffuse_4k.jpg`);
    const bumpMap = loader.load(`${base}textures/mars_bump_4k.jpg`);

    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    diffuseMap.anisotropy = 16;
    bumpMap.anisotropy = 16;

    this.mesh.material.map = diffuseMap;
    this.mesh.material.bumpMap = bumpMap;
    this.mesh.material.needsUpdate = true;
  }

  update(scrollProgress) {
    if (this.mesh) {
      this.mesh.rotation.y += this.rotationSpeed + scrollProgress * 0.005;
    }
  }
}
