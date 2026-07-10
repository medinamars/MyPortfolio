import * as THREE from 'three';

/**
 * NASA Space Shuttle orbiter — tiny model drifting across the scene.
 * Built from Three.js primitives: delta wings, vertical stabilizer,
 * OMS pods, cockpit, and three main engines.
 * Spawns from a random screen edge, changes direction ±30° mid-flight.
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
    // Materials
    const bodyWhite = new THREE.MeshStandardMaterial({ color: 0xF0F0F0, roughness: 0.4, metalness: 0.2 });
    const tiles    = new THREE.MeshStandardMaterial({ color: 0x1A1A1E, roughness: 0.7, metalness: 0.1 });
    const darkGray = new THREE.MeshStandardMaterial({ color: 0x3A3A40, roughness: 0.5, metalness: 0.4 });
    const windowM  = new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.1, metalness: 0.6, emissive: 0x112233, emissiveIntensity: 0.3 });

    // ── Fuselage (main body) ──
    const fuselageLen = 3.0;
    const fuselageRad = 0.35;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(fuselageRad, fuselageRad * 0.85, fuselageLen, 16),
      bodyWhite
    );
    this.group.add(body);

    // Nose cone — black thermal tiles
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(fuselageRad * 0.85, 0.8, 16),
      tiles
    );
    nose.position.y = fuselageLen / 2 + 0.4;
    this.group.add(nose);

    // Black belly tiles (wider flat section under fuselage)
    const belly = new THREE.Mesh(
      new THREE.BoxGeometry(fuselageRad * 2.4, fuselageLen * 0.55, fuselageRad * 0.35),
      tiles
    );
    belly.position.y = fuselageLen * 0.05;
    belly.position.z = -(fuselageRad * 0.65);
    this.group.add(belly);

    // ── Cockpit windows ──
    const cockpit = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.35, 0.35),
      windowM
    );
    cockpit.position.y = fuselageLen / 2 - 0.1;
    cockpit.position.z = fuselageRad * 0.7;
    // Tilt cockpit forward slightly to follow nose contour
    cockpit.rotation.x = -0.2;
    this.group.add(cockpit);

    // ── Delta wings ──
    const wingShape = new THREE.Shape();
    // Rough delta-wing outline (2D, then extruded)
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.4, -0.5);
    wingShape.lineTo(2.4, -1.5);
    wingShape.lineTo(1.0, 0.5);
    wingShape.closePath();

    const wingExtrudeSettings = { steps: 1, depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 5 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(wingGeo, bodyWhite);
      // Position wing centered under fuselage
      wing.position.set(0, -0.6, side * 0.02);
      wing.rotation.x = Math.PI / 2;            // lay flat
      wing.rotation.z = side * Math.PI / 2;     // flip for left/right
      wing.scale.set(1, 1, 0.12);               // thin
      this.group.add(wing);
    }

    // Wing leading-edge black tiles (thin strips)
    for (const side of [-1, 1]) {
      const le = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.04, 0.1),
        tiles
      );
      le.position.set(side * 0.8, -0.3, side * 0.5);
      le.rotation.z = side * 0.5;
      this.group.add(le);
    }

    // ── Vertical stabilizer (tail fin) ──
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.6, 0.8);
    finShape.lineTo(-0.3, 1.2);
    finShape.lineTo(-0.3, 0.6);
    finShape.closePath();

    const finExtrudeSettings = { steps: 1, depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    const fin = new THREE.Mesh(finGeo, bodyWhite);
    fin.position.set(0, -1.0, 0);
    fin.rotation.set(0, 0, 0);
    fin.scale.set(1, 0.8, 1);
    this.group.add(fin);

    // ── OMS pods (rear sides) ──
    for (const side of [-1, 1]) {
      const oms = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 0.5, 8),
        darkGray
      );
      oms.rotation.x = Math.PI / 2;
      oms.position.set(side * 0.28, -(fuselageLen / 2) + 0.3, -0.1);
      this.group.add(oms);

      // OMS nozzle
      const omsNozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 0.12, 8),
        darkGray
      );
      omsNozzle.position.set(side * 0.28, -(fuselageLen / 2) + 0.05, -0.1);
      this.group.add(omsNozzle);
    }

    // ── Main engines (3 at rear) ──
    const engineCenters = [-0.2, 0, 0.2];
    for (const cx of engineCenters) {
      // Engine bell
      const bell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 0.3, 8),
        darkGray
      );
      bell.position.set(cx, -(fuselageLen / 2) - 0.15, 0);
      this.group.add(bell);

      // Glowing exhaust cone
      const mat = new THREE.MeshStandardMaterial({
        color: 0xFF7700, roughness: 0.15,
        emissive: 0xFF4400, emissiveIntensity: 0.7,
      });
      const glow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.06, 0.08, 8),
        mat
      );
      glow.position.set(cx, -(fuselageLen / 2) - 0.32, 0);
      this.group.add(glow);
      this._engineGlows.push(glow);

      // Engine light
      const l = new THREE.PointLight(0xFF5500, 0.8, 1.5);
      l.position.set(cx, -(fuselageLen / 2) - 0.4, 0);
      this.group.add(l);
      this._engineLights.push(l);
    }

    // ── Payload bay doors (subtle line along top) ──
    const bayLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.0, 0.04),
      tiles
    );
    bayLine.position.y = 0;
    bayLine.position.z = fuselageRad + 0.02;
    this.group.add(bayLine);
  }

  /* ── Velocity & orientation ── */

  _setRandomVelocity(speed) {
    const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
    const deviation = (Math.random() - 0.5) * (Math.PI / 3); // ±30°
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
