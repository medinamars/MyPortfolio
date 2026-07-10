import * as THREE from 'three';

/**
 * NASA Space Shuttle orbiter — built from boxes for a clean, recognizable
 * silhouette: blunt body, swept delta wings, tall tail, black tiles.
 */

const SCALE = 0.15;

export class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.group.scale.setScalar(SCALE);

    this._engineGlows = [];
    this._engineLights = [];
    this._worldUp = new THREE.Vector3(0, 1, 0);

    this._buildShuttle();
    this._randomSpawn();
    this._nextTurn = 3 + Math.random() * 5;
  }

  /* ── Space Shuttle geometry ── */

  _buildShuttle() {
    const white   = new THREE.MeshStandardMaterial({ color: 0xF0F0F0, roughness: 0.35, metalness: 0.15 });
    const dark    = new THREE.MeshStandardMaterial({ color: 0x1E1E22, roughness: 0.7, metalness: 0.05 });
    const gray    = new THREE.MeshStandardMaterial({ color: 0x4A4A50, roughness: 0.5, metalness: 0.3 });
    const windowM = new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.1, metalness: 0.5, emissive: 0x112233, emissiveIntensity: 0.2 });
    const orange  = new THREE.MeshStandardMaterial({ color: 0xE05020, roughness: 0.3, metalness: 0.3 });

    // ── Fuselage: wide, flat, tapering toward nose ──
    // Main mid/rear body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 1.5, 0.4),
      white
    );
    body.position.y = -0.1;
    this.group.add(body);

    // Forward fuselage (narrows toward nose)
    const fwd = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 1.0, 0.35),
      white
    );
    fwd.position.y = 0.9;
    this.group.add(fwd);

    // Nose (blunt front)
    const nose = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.4, 0.28),
      dark
    );
    nose.position.y = 1.5;
    this.group.add(nose);

    // Nose cap
    const noseCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.15, 8),
      dark
    );
    noseCap.rotation.x = Math.PI / 2;
    noseCap.position.y = 1.72;
    this.group.add(noseCap);

    // Black belly (underside tiles)
    const belly = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.8, 0.06),
      dark
    );
    belly.position.set(0, 0.1, -0.22);
    this.group.add(belly);

    // ── Cockpit windows ──
    const cockpit = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.35, 0.2),
      windowM
    );
    cockpit.position.set(0, 1.0, 0.18);
    cockpit.rotation.x = -0.25;
    this.group.add(cockpit);

    // ── Delta wings (the most important feature) ──
    // Each wing is a thin box, rotated and positioned to sweep back
    for (const side of [-1, 1]) {
      const wingGroup = new THREE.Group();

      // Wing body
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.9, 0.04),
        white
      );
      // Rotate the box so it sweeps back: the long edge points back and out
      wing.rotation.z = side * 0.6;  // sweep angle
      wing.position.x = side * 0.5;
      wing.position.y = -0.5;
      wingGroup.add(wing);

      // Black leading edge
      const le = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.03, 0.05),
        dark
      );
      le.rotation.z = side * 0.6;
      le.position.x = side * 0.5;
      le.position.y = -0.1;
      wingGroup.add(le);

      // Position the wing group at the rear-bottom of fuselage
      wingGroup.position.set(0, -0.4, -0.05);
      this.group.add(wingGroup);
    }

    // ── Vertical tail fin ──
    const finGroup = new THREE.Group();

    const finBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.6, 0.6),
      white
    );
    finGroup.add(finBase);

    const finTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.25, 0.35),
      white
    );
    finTop.position.set(0, -0.4, 0.25);
    finGroup.add(finTop);

    // Fin leading edge tile
    const finLE = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.55, 0.04),
      dark
    );
    finLE.position.set(0, -0.05, 0.3);
    finGroup.add(finLE);

    finGroup.position.set(0, -1.0, 0.22);
    this.group.add(finGroup);

    // ── OMS pods ──
    for (const side of [-1, 1]) {
      const oms = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.06, 0.35, 8),
        gray
      );
      oms.rotation.x = Math.PI / 2;
      oms.position.set(side * 0.22, -1.05, 0.0);
      this.group.add(oms);

      const omsNozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.08, 8),
        gray
      );
      omsNozzle.position.set(side * 0.22, -1.25, 0.0);
      this.group.add(omsNozzle);
    }

    // ── Three SSMEs at rear ──
    for (const cx of [-0.1, 0, 0.1]) {
      const bell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.06, 0.15, 8),
        gray
      );
      bell.position.set(cx, -1.2, 0.0);
      this.group.add(bell);

      // Glow
      const glowMat = new THREE.MeshStandardMaterial({
        color: 0xFF7700, roughness: 0.15,
        emissive: 0xFF4400, emissiveIntensity: 0.7,
      });
      const glow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.03, 0.06, 8),
        glowMat
      );
      glow.position.set(cx, -1.3, 0.0);
      this.group.add(glow);
      this._engineGlows.push(glow);

      const light = new THREE.PointLight(0xFF5500, 0.8, 1.5);
      light.position.set(cx, -1.35, 0.0);
      this.group.add(light);
      this._engineLights.push(light);
    }

    // Payload bay doors line
    const bayLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.2, 0.02),
      dark
    );
    bayLine.position.set(0, -0.2, 0.21);
    this.group.add(bayLine);

    // Body flap at rear bottom
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.15, 0.04),
      gray
    );
    flap.position.set(0, -0.9, -0.18);
    this.group.add(flap);
  }

  /* ── Velocity & orientation ── */

  _setRandomVelocity(speed) {
    const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
    const deviation = (Math.random() - 0.5) * (Math.PI / 3);
    const angle = currentAngle + deviation;
    const s = speed || (0.08 + Math.random() * 0.15);
    this.velocity = new THREE.Vector3(Math.cos(angle) * s, Math.sin(angle) * s, 0);
    this._orientToVelocity();
  }

  _orientToVelocity() {
    const dir = this.velocity.clone().normalize();
    if (dir.length() < 0.001) return;
    const quat = new THREE.Quaternion();
    if (Math.abs(dir.y) > 0.999) {
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    } else {
      quat.setFromUnitVectors(this._worldUp, dir);
    }
    this.group.quaternion.copy(quat);
  }

  /* ── Spawning ── */

  _randomSpawn() {
    const margin = 8;
    const edge = Math.floor(Math.random() * 4);
    let sx, sy;

    switch (edge) {
      case 0: sx = (Math.random() - 0.5) * 8; sy = margin; break;
      case 1: sx = (Math.random() - 0.5) * 8; sy = -margin; break;
      case 2: sx = margin; sy = (Math.random() - 0.5) * 6; break;
      case 3: sx = -margin; sy = (Math.random() - 0.5) * 6; break;
    }

    this.position = new THREE.Vector3(sx, sy, -1.5 + Math.random() * 0.5);

    const towardCenter = new THREE.Vector2(-sx, -sy).normalize();
    const angle = Math.atan2(towardCenter.y, towardCenter.x) + (Math.random() - 0.5) * (Math.PI / 3);
    const speed = 0.08 + Math.random() * 0.15;
    this.velocity = new THREE.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);

    this._spawnCooldown = 5;
    this._nextTurn = 2 + Math.random() * 4;
    this._orientToVelocity();
  }

  /* ── Lifecycle ── */

  add(scene) { scene.add(this.group); }

  update(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.group.position.copy(this.position);

    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
    for (const g of this._engineGlows) {
      g.material.emissiveIntensity = 0.5 + pulse * 0.4;
    }
    for (const l of this._engineLights) {
      l.intensity = 0.8 * pulse;
    }

    if (this._spawnCooldown <= 0) {
      this._nextTurn -= deltaTime;
      if (this._nextTurn <= 0) {
        this._setRandomVelocity(0.08 + Math.random() * 0.15);
        this._nextTurn = 2 + Math.random() * 4;
      }
    } else {
      this._spawnCooldown--;
    }

    const bound = 8;
    if (this._spawnCooldown <= 0 && (
      this.position.x > bound || this.position.x < -bound ||
      this.position.y > bound || this.position.y < -bound
    )) {
      this._randomSpawn();
    }
  }
}
