import * as THREE from 'three';

/**
 * NASA Space Shuttle orbiter — recognizable silhouette at small scale.
 * Key features: blunt fuselage, short delta wings, tall vertical stabilizer,
 * black thermal tiles on nose and belly, OMS pods, three main engines.
 */

const SCALE = 0.1;

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
    const bodyWhite = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.4, metalness: 0.15 });
    const tiles    = new THREE.MeshStandardMaterial({ color: 0x1C1C20, roughness: 0.75, metalness: 0.05 });
    const darkGray = new THREE.MeshStandardMaterial({ color: 0x44444A, roughness: 0.5, metalness: 0.35 });
    const windowM  = new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.1, metalness: 0.5, emissive: 0x112233, emissiveIntensity: 0.2 });

    // ── Fuselage: flattened capsule (wider than tall, blunt nose) ──
    // Use a scaled sphere for the blunt body, then taper it
    const bodyGeom = new THREE.SphereGeometry(0.45, 20, 12);
    bodyGeom.scale(1, 2.5, 0.65); // stretch: long, flattened top-to-bottom
    const body = new THREE.Mesh(bodyGeom, bodyWhite);
    this.group.add(body);

    // Nose cap — blunt rounded front in black tiles
    const noseGeom = new THREE.SphereGeometry(0.4, 16, 10);
    noseGeom.scale(0.6, 0.5, 0.55);
    const nose = new THREE.Mesh(noseGeom, tiles);
    nose.position.y = 1.2;
    nose.position.z = 0.0;
    this.group.add(nose);

    // Black belly tiles
    const belly = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 2.0, 0.08),
      tiles
    );
    belly.position.y = 0.1;
    belly.position.z = -0.28;
    this.group.add(belly);

    // ── Cockpit windows ──
    const cockpit = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.4, 0.25),
      windowM
    );
    cockpit.position.set(0, 0.85, 0.28);
    cockpit.rotation.x = -0.15;
    this.group.add(cockpit);

    // ── Short delta wings ──
    for (const side of [-1, 1]) {
      const wingGroup = new THREE.Group();

      // Main wing: flat triangle shape
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);           // root leading edge
      wingShape.lineTo(0.9, -0.3);      // sweep back
      wingShape.lineTo(0.9, -1.5);      // trail down to tip
      wingShape.lineTo(0.15, -1.1);     // trailing edge back to root
      wingShape.closePath();

      const wingGeo = new THREE.ExtrudeGeometry(wingShape, { steps: 1, depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
      const wing = new THREE.Mesh(wingGeo, bodyWhite);

      // Wing leading edge tiles
      const leGeo = new THREE.BoxGeometry(0.85, 0.03, 0.06);
      const le = new THREE.Mesh(leGeo, tiles);

      wingGroup.add(le);
      wingGroup.add(wing);

      // Position: mid-fuselage, low, on either side
      wingGroup.position.set(side * 0.2, -0.6, 0);
      wingGroup.rotation.set(0, 0, side * 0.25); // slight dihedral

      // Flip left/right
      wingGroup.scale.set(side, 1, 1);

      this.group.add(wingGroup);
    }

    // ── Vertical stabilizer (tail fin) ──
    const finGroup = new THREE.Group();

    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.5, 0.9);
    finShape.lineTo(-0.15, 1.3);
    finShape.lineTo(-0.05, 0.6);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, { steps: 1, depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    const finMesh = new THREE.Mesh(finGeo, bodyWhite);
    finGroup.add(finMesh);

    // Fin leading edge tile
    const finLE = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.05), tiles);
    finGroup.add(finLE);

    finGroup.position.set(0, -1.0, 0.0);
    this.group.add(finGroup);

    // ── OMS pods (rear bumps) ──
    for (const side of [-1, 1]) {
      const oms = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 6),
        darkGray
      );
      oms.scale.set(1, 1, 0.7);
      oms.position.set(side * 0.3, -1.1, -0.1);
      this.group.add(oms);

      // OMS nozzle
      const omsNz = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.08, 8),
        darkGray
      );
      omsNz.position.set(side * 0.3, -1.2, -0.1);
      this.group.add(omsNz);
    }

    // ── Three main engines (SSMEs) at rear ──
    const engineXs = [-0.15, 0, 0.15];
    for (const cx of engineXs) {
      // Engine bell
      const bell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 0.22, 8),
        darkGray
      );
      bell.position.set(cx, -1.3, 0.0);
      this.group.add(bell);

      // Glowing exhaust
      const glowMat = new THREE.MeshStandardMaterial({
        color: 0xFF7700, roughness: 0.15,
        emissive: 0xFF4400, emissiveIntensity: 0.7,
      });
      const glow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.05, 0.07, 8),
        glowMat
      );
      glow.position.set(cx, -1.45, 0.0);
      this.group.add(glow);
      this._engineGlows.push(glow);

      const l = new THREE.PointLight(0xFF5500, 0.8, 1.5);
      l.position.set(cx, -1.5, 0.0);
      this.group.add(l);
      this._engineLights.push(l);
    }

    // ── Body flap / speed brake (bottom rear) ──
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.04),
      darkGray
    );
    flap.position.set(0, -1.0, -0.25);
    this.group.add(flap);

    // ── Rotate entire group so nose points up (shuttle flies "up" = forward) ──
    // The model is built with nose at +Y, tail at -Y.
    // When oriented to velocity, _orientToVelocity uses worldUp(0,1,0), so
    // the ship's +Y (nose) aligns with velocity. That's correct.

    // Slight default rotation so it looks right at rest
    this.group.rotation.z = 0;
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
