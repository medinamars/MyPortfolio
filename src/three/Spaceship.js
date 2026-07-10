import * as THREE from 'three';

/**
 * Falcon Heavy — tiny three-core rocket drifting across the scene.        │
 * Spawns from a random screen edge and flies in a random direction.       │
 * When it exits the viewport it respawns from a new edge.                 │
 */

const SCALE = 0.08; // tiny

export class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.group.scale.setScalar(SCALE);

    this._engineGlows = [];
    this._engineLights = [];
    this._worldUp = new THREE.Vector3(0, 1, 0);

    this._buildRocket();
    this._randomSpawn();
  }

  /* ── Falcon Heavy geometry ── */

  _buildRocket() {
    const white = new THREE.MeshStandardMaterial({ color: 0xF4F4F4, roughness: 0.35, metalness: 0.25 });
    const dark  = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.5, metalness: 0.45 });
    const orange= new THREE.MeshStandardMaterial({ color: 0xE05020, roughness: 0.35, metalness: 0.3 });

    const cr = 0.14; // core radius
    const ch = 2.0;  // core height
    const bh = 1.4;  // booster height
    const ox = 0.22; // booster offset

    // Center core
    this.group.add(new THREE.Mesh(new THREE.CylinderGeometry(cr, cr, ch, 20), white));

    // Center octaweb
    const octa = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.25, 20), dark);
    octa.position.y = -(ch / 2) - 0.05;
    this.group.add(octa);

    // Center engine nozzles
    this._addNozzles(0, -(ch / 2) - 0.22, 0.06, 5, 0.025);
    const cn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.08, 8), dark);
    cn.position.set(0, -(ch / 2) - 0.22, 0);
    this.group.add(cn);

    // Side boosters
    for (const bx of [-ox, ox]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(cr, cr, bh, 20), white);
      b.position.set(bx, -0.3, 0);
      this.group.add(b);

      const bo = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.2, 20), dark);
      bo.position.set(bx, -(bh / 2) - 0.35, 0);
      this.group.add(bo);

      this._addNozzles(bx, -1.12, 0.05, 4, 0.022);
    }

    // Connecting struts
    for (const y of [0.35, -0.15, -0.65]) {
      const sg = new THREE.CylinderGeometry(0.015, 0.015, ox * 2 - 0.05, 4);
      sg.rotateZ(Math.PI / 2);
      const s = new THREE.Mesh(sg, dark);
      s.position.set(0, y, 0);
      this.group.add(s);
    }

    // Interstage
    const inter = new THREE.Mesh(new THREE.CylinderGeometry(cr + 0.01, cr + 0.01, 0.2, 20), dark);
    inter.position.y = ch / 2 - 0.3;
    this.group.add(inter);

    // Fairing
    const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.35, 20), white);
    fl.position.y = ch / 2 + 0.1;
    this.group.add(fl);

    const fu = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.15, 0.55, 20), white);
    fu.position.y = ch / 2 + 0.55;
    this.group.add(fu);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 12), orange);
    tip.position.y = ch / 2 + 0.87;
    this.group.add(tip);

    // Engine glows
    this._addGlow(0, -(ch / 2) - 0.3, 0.06);
    this._addGlow(-ox, -1.2, 0.04);
    this._addGlow(ox, -1.2, 0.04);
  }

  _addNozzles(cx, cy, radius, count, nozzleRadius) {
    const dark = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.5, metalness: 0.45 });
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const n = new THREE.Mesh(new THREE.CylinderGeometry(nozzleRadius, nozzleRadius * 1.25, 0.06, 8), dark);
      n.position.set(cx + Math.cos(angle) * radius, cy, Math.sin(angle) * radius);
      this.group.add(n);
    }
  }

  _addGlow(x, y, radius) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xFF7700, roughness: 0.15,
      emissive: 0xFF4400, emissiveIntensity: 0.9,
    });
    const g = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius, 0.1, 8), mat);
    g.position.set(x, y, 0);
    this.group.add(g);
    this._engineGlows.push(g);

    const l = new THREE.PointLight(0xFF5500, 1.0, 1.2);
    l.position.set(x, y - 0.08, 0);
    this.group.add(l);
    this._engineLights.push(l);
  }

  /* ── Spawning ── */

  _randomSpawn() {
    // Pick a random edge: 0=top, 1=bottom, 2=right, 3=left
    const edge = Math.floor(Math.random() * 4);
    const margin = 8;
    let sx, sy, vx, vy;

    switch (edge) {
      case 0: // top → going down
        sx = (Math.random() - 0.5) * 10;
        sy = margin;
        vx = (Math.random() - 0.5) * 0.4;
        vy = -(0.3 + Math.random() * 0.5);
        break;
      case 1: // bottom → going up
        sx = (Math.random() - 0.5) * 10;
        sy = -margin;
        vx = (Math.random() - 0.5) * 0.4;
        vy = 0.3 + Math.random() * 0.5;
        break;
      case 2: // right → going left
        sx = margin;
        sy = (Math.random() - 0.5) * 8;
        vx = -(0.3 + Math.random() * 0.5);
        vy = (Math.random() - 0.5) * 0.4;
        break;
      case 3: // left → going right
        sx = -margin;
        sy = (Math.random() - 0.5) * 8;
        vx = 0.3 + Math.random() * 0.5;
        vy = (Math.random() - 0.5) * 0.4;
        break;
    }

    this.position = new THREE.Vector3(sx, sy, -1.5 + Math.random() * 0.5);
    this.velocity = new THREE.Vector3(vx || 0, vy || 0, 0);

    // Orient ship along velocity direction
    const dir = this.velocity.clone().normalize();
    const quat = new THREE.Quaternion();
    // Guard against direction being parallel to worldUp
    if (Math.abs(dir.y) > 0.999) {
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    } else {
      quat.setFromUnitVectors(this._worldUp, dir);
    }
    this.group.quaternion.copy(quat);
  }

  /* ── Lifecycle ── */

  add(scene) { scene.add(this.group); }

  update(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.group.position.copy(this.position);

    // Pulsing engine glow
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
    for (const g of this._engineGlows) {
      g.material.emissiveIntensity = 0.6 + pulse * 0.4;
    }
    for (const l of this._engineLights) {
      l.intensity = 1.0 * pulse;
    }

    // Respawn when off-screen
    const bound = 9;
    if (
      this.position.x > bound || this.position.x < -bound ||
      this.position.y > bound || this.position.y < -bound
    ) {
      this._randomSpawn();
    }
  }
}
