import * as THREE from 'three';

/**
 * Falcon Heavy — three-core rocket silhouette drifting upward past Mars.
 * Smaller, more accurate proportions, moving vertically.
 */

const SCALE = 0.25; // overall size multiplier

export class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.group.scale.setScalar(SCALE);

    // Vertical trajectory — drifts upward, respawns at bottom
    this.position = new THREE.Vector3(3, -6, -1.5);
    this.velocity = new THREE.Vector3(0, 0.35, 0);
    this.respawnY = -6;
    this.despawnY = 8;

    this._engineGlows = [];
    this._engineLights = [];

    this._buildRocket();
  }

  _buildRocket() {
    const white = new THREE.MeshStandardMaterial({ color: 0xF4F4F4, roughness: 0.35, metalness: 0.25 });
    const dark  = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.5, metalness: 0.45 });
    const orange= new THREE.MeshStandardMaterial({ color: 0xE05020, roughness: 0.35, metalness: 0.3 });

    const coreRadius = 0.14;
    const coreHeight = 2.0;

    // ──────────────── Center Core (tall) ────────────────
    const coreGeo = new THREE.CylinderGeometry(coreRadius, coreRadius, coreHeight, 20);
    const core = new THREE.Mesh(coreGeo, white);
    core.position.y = 0;
    this.group.add(core);

    // Center engine section (octaweb — flared base)
    const octaGeo = new THREE.CylinderGeometry(0.17, 0.14, 0.25, 20);
    const octa = new THREE.Mesh(octaGeo, dark);
    octa.position.y = -(coreHeight / 2) - 0.05;
    this.group.add(octa);

    // Engine nozzles for center core (small cylinders)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 0.06;
      const nozzleGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.08, 8);
      const nozzle = new THREE.Mesh(nozzleGeo, dark);
      nozzle.position.set(
        Math.cos(angle) * r,
        -(coreHeight / 2) - 0.2,
        Math.sin(angle) * r,
      );
      this.group.add(nozzle);
    }
    // Center nozzle
    const centerNozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, 0.08, 8), dark);
    centerNozzle.position.set(0, -(coreHeight / 2) - 0.2, 0);
    this.group.add(centerNozzle);

    // ──────────────── Side Boosters (shorter) ────────────────
    const boosterHeight = 1.4;
    const boosterGeo = new THREE.CylinderGeometry(coreRadius, coreRadius, boosterHeight, 20);
    const offsetX = 0.22;

    // Left booster
    const leftBooster = new THREE.Mesh(boosterGeo, white);
    leftBooster.position.set(-offsetX, -0.3, 0);
    this.group.add(leftBooster);

    const leftOcta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.14, 0.2, 20), dark);
    leftOcta.position.set(-offsetX, -(boosterHeight / 2) - 0.35, 0);
    this.group.add(leftOcta);

    // Right booster
    const rightBooster = new THREE.Mesh(boosterGeo, white);
    rightBooster.position.set(offsetX, -0.3, 0);
    this.group.add(rightBooster);

    const rightOcta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.14, 0.2, 20), dark);
    rightOcta.position.set(offsetX, -(boosterHeight / 2) - 0.35, 0);
    this.group.add(rightOcta);

    // Booster engine nozzles
    for (const bx of [-offsetX, offsetX]) {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const nozzle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.022, 0.06, 8), dark);
        nozzle.position.set(
          bx + Math.cos(angle) * 0.05,
          -1.1,
          Math.sin(angle) * 0.05,
        );
        this.group.add(nozzle);
      }
    }

    // ──────────────── Connecting struts between cores ────────────────
    for (const y of [0.35, -0.15, -0.65]) {
      const strutGeo = new THREE.CylinderGeometry(0.015, 0.015, offsetX * 2 - 0.05, 4);
      strutGeo.rotateZ(Math.PI / 2);
      const strut = new THREE.Mesh(strutGeo, dark);
      strut.position.set(0, y, 0);
      this.group.add(strut);
    }

    // ──────────────── Interstage (black band) ────────────────
    const interGeo = new THREE.CylinderGeometry(coreRadius + 0.01, coreRadius + 0.01, 0.2, 20);
    const inter = new THREE.Mesh(interGeo, dark);
    inter.position.y = coreHeight / 2 - 0.3;
    this.group.add(inter);

    // ──────────────── Payload Fairing ────────────────
    // Lower fairing (cylinder)
    const fairingLowerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.35, 20);
    const fairingLower = new THREE.Mesh(fairingLowerGeo, white);
    fairingLower.position.y = coreHeight / 2 + 0.1;
    this.group.add(fairingLower);

    // Upper fairing (cone tapering to tip)
    const fairingUpperGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.55, 20);
    const fairingUpper = new THREE.Mesh(fairingUpperGeo, white);
    fairingUpper.position.y = coreHeight / 2 + 0.55;
    this.group.add(fairingUpper);

    // Fairing tip
    const tipGeo = new THREE.ConeGeometry(0.05, 0.1, 12);
    const tip = new THREE.Mesh(tipGeo, orange);
    tip.position.y = coreHeight / 2 + 0.87;
    this.group.add(tip);

    // ──────────────── Engine glows ────────────────
    this._addGlow(0, -(coreHeight / 2) - 0.28, 0.06);
    this._addGlow(-offsetX, -1.2, 0.04);
    this._addGlow(offsetX, -1.2, 0.04);

    // Rocket points upward (it flies vertically)
    this.group.rotation.set(0, 0, 0);
  }

  _addGlow(x, y, radius) {
    const geo = new THREE.CylinderGeometry(radius * 0.6, radius, 0.1, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xFF7700, roughness: 0.15,
      emissive: 0xFF4400, emissiveIntensity: 0.9,
    });
    const glow = new THREE.Mesh(geo, mat);
    glow.position.set(x, y, 0);
    this.group.add(glow);
    this._engineGlows.push(glow);

    const light = new THREE.PointLight(0xFF5500, 1.0, 1.2);
    light.position.set(x, y - 0.08, 0);
    this.group.add(light);
    this._engineLights.push(light);
  }

  add(scene) { scene.add(this.group); }

  update(deltaTime) {
    // Drift upward
    this.position.y += this.velocity.y * deltaTime;
    this.group.position.copy(this.position);

    // Gentle rotation so it's not perfectly static
    this.group.rotation.y += 0.003 * deltaTime;

    // Pulsing engine glow
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
    for (const g of this._engineGlows) {
      g.material.emissiveIntensity = 0.6 + pulse * 0.4;
    }
    for (const l of this._engineLights) {
      l.intensity = 1.0 * pulse;
    }

    // Respawn at bottom
    if (this.position.y > this.despawnY) {
      this.position.y = this.respawnY;
      this.position.x = 2 + Math.random() * 3;
    }
  }
}
