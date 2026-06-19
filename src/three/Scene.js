import * as THREE from 'three';
import { MarsPlanet } from './MarsPlanet.js';
import { StarField } from './StarField.js';
import { Atmosphere } from './Atmosphere.js';
import { PassingCelestials } from './PassingCelestials.js';

export class MarsScene {
  constructor(canvasId) {
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();
    this.init(canvasId);
  }

  init(canvasId) {
    const canvas = document.getElementById(canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 8;

    this.mars = new MarsPlanet();
    this.scene.add(this.mars.mesh);

    this.atmosphere = new Atmosphere();
    this.atmosphere.add(this.scene);

    this.stars = new StarField(2000);
    this.stars.add(this.scene);

    this.celestials = new PassingCelestials();
    this.celestials.add(this.scene);

    this.setupLighting();
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  setupLighting() {
    const sunLight = new THREE.DirectionalLight(0xFFF5E1, 2.5);
    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x1a1520, 0.4);
    this.scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xF48A36, 0.3);
    rimLight.position.set(-5, 0, -5);
    this.scene.add(rimLight);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const deltaTime = this.clock.getDelta();

    this.mars.update(this.scrollProgress);
    this.camera.position.y = -this.scrollProgress * 2;
    this.camera.lookAt(0, 0, 0);

    this.celestials.update(deltaTime);

    this.renderer.render(this.scene, this.camera);
  }
}
