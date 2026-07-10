import * as THREE from 'three';

/**
 * Spaceship — a simple geometric ship that orbits around the Mars planet.
 * Built from basic Three.js primitives — no external models needed.
 * Removes cleanly on scene teardown.
 */

export class Spaceship {
  constructor(orbitRadius = 3.2) {
    this.group = new THREE.Group();
    this.orbitRadius = orbitRadius;
    this.orbitAngle = Math.random() * Math.PI * 2; // random starting position
    this.orbitSpeed = 0.08; // radians per second
    this.orbitTilt = 0.4; // radians — slight tilt off the equatorial plane

    this._engineLight = null;
    this._engineGlow = null;

    this._buildHull();
  }

  /* ── Construct the ship from primitives ── */

  _buildHull() {
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xC0C4C8,
      roughness: 0.35,
      metalness: 0.85,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x3A3D42,
      roughness: 0.5,
      metalness: 0.7,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xE88A36,
      roughness: 0.3,
      metalness: 0.6,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x88CCFF,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x334455,
      emissiveIntensity: 0.4,
    });

    // Main hull — elongated cylinder
    const hullGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 12);
    hullGeo.rotateX(Math.PI / 2); // lay it horizontal (Z-axis is forward)
    const hull = new THREE.Mesh(hullGeo, bodyMat);
    this.group.add(hull);

    // Nose cone
    const noseGeo = new THREE.ConeGeometry(0.08, 0.18, 12);
    noseGeo.rotateX(-Math.PI / 2);
    noseGeo.translate(0, 0, 0.39);
    const nose = new THREE.Mesh(noseGeo, accentMat);
    this.group.add(nose);

    // Cockpit window
    const cockpitGeo = new THREE.SphereGeometry(0.06, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    cockpitGeo.translate(0, 0.06, 0.05);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    this.group.add(cockpit);

    // Left wing
    const wingGeo = new THREE.BoxGeometry(0.04, 0.01, 0.22);
    const leftWing = new THREE.Mesh(wingGeo, darkMat);
    leftWing.position.set(-0.1, 0, -0.05);
    this.group.add(leftWing);

    // Right wing
    const rightWing = new THREE.Mesh(wingGeo, darkMat);
    rightWing.position.set(0.1, 0, -0.05);
    this.group.add(rightWing);

    // Engine housing
    const engineGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12);
    engineGeo.rotateX(Math.PI / 2);
    engineGeo.translate(0, 0, -0.36);
    const engine = new THREE.Mesh(engineGeo, darkMat);
    this.group.add(engine);

    // Engine glow nozzle
    const glowGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.06, 8);
    glowGeo.rotateX(Math.PI / 2);
    glowGeo.translate(0, 0, -0.44);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xFF8833,
      roughness: 0.2,
      emissive: 0xFF5500,
      emissiveIntensity: 0.9,
    });
    this._engineGlow = new THREE.Mesh(glowGeo, glowMat);
    this.group.add(this._engineGlow);

    // Point light for engine illumination
    this._engineLight = new THREE.PointLight(0xFF6622, 2.5, 1.5);
    this._engineLight.position.set(0, 0, -0.5);
    this.group.add(this._engineLight);
  }

  /* ── Attach to scene ── */

  add(scene) {
    scene.add(this.group);
  }

  /* ── Update orbit and animation each frame ── */

  update(deltaTime) {
    this.orbitAngle += this.orbitSpeed * deltaTime;

    // Circular orbit position, tilted off equatorial plane
    const x = Math.cos(this.orbitAngle) * this.orbitRadius;
    const z = Math.sin(this.orbitAngle) * this.orbitRadius;
    const y = Math.sin(this.orbitAngle * 0.7) * this.orbitRadius * Math.sin(this.orbitTilt);

    this.group.position.set(x, y, z);

    // Face direction of travel (tangent to orbit)
    const tangent = new THREE.Vector3(
      -Math.sin(this.orbitAngle),
      Math.cos(this.orbitAngle * 0.7) * 0.7 * Math.sin(this.orbitTilt),
      Math.cos(this.orbitAngle),
    ).normalize();

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.group.quaternion.copy(quaternion);

    // Pulsing engine glow
    if (this._engineGlow) {
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.01);
      this._engineGlow.material.emissiveIntensity = 0.6 + pulse * 0.4;
    }
    if (this._engineLight) {
      const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.012);
      this._engineLight.intensity = 2.5 * pulse;
    }
  }
}
