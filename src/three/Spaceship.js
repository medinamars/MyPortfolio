import * as THREE from 'three';

/**
 * Falcon Heavy — a simplified geometric approximation of SpaceX's rocket.
 * Drifts slowly across the scene in a flyby, then respawns on the opposite side.
 * Built from basic Three.js primitives — no external models needed.
 */

const ROCKET_SCALE = 0.5; // overall size multiplier — smaller than the old ship

export class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.group.scale.setScalar(ROCKET_SCALE);

    // Flyby trajectory — starts off-screen right, drifts left
    this.position = new THREE.Vector3(10, 1.5, -2);
    this.velocity = new THREE.Vector3(-0.25, 0.02, 0); // slow drift leftward
    this.respawnX = 10;
    this.despawnX = -10;

    this._engineLights = [];
    this._engineGlows = [];

    this._buildRocket();
  }

  /* ── Falcon Heavy silhouette ── */

  _buildRocket() {
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xF0F0F0,
      roughness: 0.4,
      metalness: 0.3,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x2A2A2E,
      roughness: 0.5,
      metalness: 0.5,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xE05020,
      roughness: 0.4,
      metalness: 0.3,
    });

    // ── Center core (tall cylinder) ──
    const coreGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16);
    const core = new THREE.Mesh(coreGeo, whiteMat);
    core.position.y = 0;
    this.group.add(core);

    // Core engine section (slightly wider at base)
    const coreEngineGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.2, 16);
    const coreEngine = new THREE.Mesh(coreEngineGeo, darkMat);
    coreEngine.position.y = -1.2;
    this.group.add(coreEngine);

    // ── Left booster ──
    const boosterGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 16);
    const leftBooster = new THREE.Mesh(boosterGeo, whiteMat);
    leftBooster.position.set(-0.22, -0.3, 0);
    this.group.add(leftBooster);

    // Left booster engine
    const boosterEngineGeo = new THREE.CylinderGeometry(0.13, 0.12, 0.15, 16);
    const leftBoosterEngine = new THREE.Mesh(boosterEngineGeo, darkMat);
    leftBoosterEngine.position.set(-0.22, -1.15, 0);
    this.group.add(leftBoosterEngine);

    // ── Right booster ──
    const rightBooster = new THREE.Mesh(boosterGeo, whiteMat);
    rightBooster.position.set(0.22, -0.3, 0);
    this.group.add(rightBooster);

    // Right booster engine
    const rightBoosterEngine = new THREE.Mesh(boosterEngineGeo, darkMat);
    rightBoosterEngine.position.set(0.22, -1.15, 0);
    this.group.add(rightBoosterEngine);

    // ── Side booster connecting struts ──
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
    strutGeo.rotateZ(Math.PI / 2);
    const topStrutL = new THREE.Mesh(strutGeo, darkMat);
    topStrutL.position.set(-0.11, 0.5, 0);
    this.group.add(topStrutL);
    const topStrutR = new THREE.Mesh(strutGeo, darkMat);
    topStrutR.position.set(0.11, 0.5, 0);
    this.group.add(topStrutR);

    const botStrutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
    botStrutGeo.rotateZ(Math.PI / 2);
    const botStrutL = new THREE.Mesh(botStrutGeo, darkMat);
    botStrutL.position.set(-0.11, -0.9, 0);
    this.group.add(botStrutL);
    const botStrutR = new THREE.Mesh(botStrutGeo, darkMat);
    botStrutR.position.set(0.11, -0.9, 0);
    this.group.add(botStrutR);

    // ── Payload fairing (cone on top) ──
    const fairingGeo = new THREE.ConeGeometry(0.15, 0.5, 16, 4);
    const fairing = new THREE.Mesh(fairingGeo, whiteMat);
    fairing.position.y = 1.35;
    this.group.add(fairing);

    // Fairing accent stripe
    const stripeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.y = 1.2;
    this.group.add(stripe);

    // ── Nose cone tip ──
    const tipGeo = new THREE.ConeGeometry(0.04, 0.15, 8);
    const tip = new THREE.Mesh(tipGeo, accentMat);
    tip.position.y = 1.65;
    this.group.add(tip);

    // ── Grid fins at top of core ──
    const finGeo = new THREE.BoxGeometry(0.06, 0.01, 0.12);
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, darkMat);
      const angle = (i * Math.PI) / 2;
      fin.position.set(
        Math.cos(angle) * 0.17,
        0.95,
        Math.sin(angle) * 0.17,
      );
      fin.rotation.y = angle;
      this.group.add(fin);
    }

    // ── Engine nozzles with glow ──
    this._addEngineGlow(0, -1.32, 0.08);
    this._addEngineGlow(-0.22, -1.24, 0.06);
    this._addEngineGlow(0.22, -1.24, 0.06);

    // Point the whole rocket upward by default, then orientation will be set per-frame
    this.group.rotation.set(0, 0, 0);
  }

  _addEngineGlow(x, y, radius) {
    const glowGeo = new THREE.CylinderGeometry(radius * 0.7, radius, 0.12, 8);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xFF6600,
      roughness: 0.2,
      emissive: 0xFF4400,
      emissiveIntensity: 0.9,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(x, y, 0);
    this.group.add(glow);
    this._engineGlows.push(glow);

    // Small point light
    const light = new THREE.PointLight(0xFF5500, 1.2, 1.0);
    light.position.set(x, y - 0.1, 0);
    this.group.add(light);
    this._engineLights.push(light);
  }

  /* ── Attach to scene ── */

  add(scene) {
    scene.add(this.group);
  }

  /* ── Flyby animation ── */

  update(deltaTime) {
    // Drift across the screen
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    this.group.position.copy(this.position);

    // Slight tilt — rocket points slightly upward as if coasting
    this.group.rotation.set(0.1, 0, 0.25);

    // Pulsing engine glow
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
    for (const glow of this._engineGlows) {
      glow.material.emissiveIntensity = 0.6 + pulse * 0.4;
    }
    for (const light of this._engineLights) {
      light.intensity = 1.2 * pulse;
    }

    // Respawn on the right when it drifts off the left
    if (this.position.x < this.despawnX) {
      this.position.x = this.respawnX;
      this.position.y = -1 + Math.random() * 3;
    }
  }
}
