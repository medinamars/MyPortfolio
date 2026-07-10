import * as THREE from 'three';

/**
 * Space Shuttle — flat top-down sprite matching the Space Agency game style.
 * Always faces the camera so the iconic delta-wing silhouette is visible.
 * Spawns from random edges, changes direction ±30° mid-flight.
 */

const SCALE = 0.03;

export class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.group.scale.setScalar(SCALE);

    this._engineGlows = [];
    this._engineLights = [];

    this._buildShuttle();
    this._randomSpawn();
    this._nextTurn = 3 + Math.random() * 5;
  }

  /* ── Shuttle silhouette (top-down view, always faces camera) ── */

  _buildShuttle() {
    // Materials
    const bodyColor  = new THREE.MeshStandardMaterial({ color: 0xDDDDDD, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide });
    const darkColor  = new THREE.MeshStandardMaterial({ color: 0x2A2A2E, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide });
    const windowColor= new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.1, metalness: 0.5, emissive: 0x112233, emissiveIntensity: 0.3, side: THREE.DoubleSide });
    const grayColor  = new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide });
    const orangeColor= new THREE.MeshStandardMaterial({ color: 0xE05020, roughness: 0.3, metalness: 0.3, side: THREE.DoubleSide });

    // ── Main body shape (XY plane, symmetric around Y axis) ──
    // Nose at +Y, tail at -Y. X is wingspan direction.
    const shape = new THREE.Shape();

    // Start at nose tip (top center)
    shape.moveTo(0, 2.2);

    // Right side of nose (curves out gently)
    shape.bezierCurveTo(0.15, 2.0, 0.35, 1.65, 0.42, 1.2);
    // Right side of mid-body (straight-ish)
    shape.lineTo(0.44, 0.0);

    // Right wing sweeps out and back
    shape.bezierCurveTo(0.5, -0.2, 1.0, -0.7, 1.45, -1.25);
    // Wing trailing edge
    shape.bezierCurveTo(1.3, -1.5, 0.8, -1.6, 0.35, -1.55);

    // Right aft body
    shape.lineTo(0.35, -1.65);
    shape.lineTo(0.22, -1.85);

    // Right OMS pod bump
    shape.bezierCurveTo(0.28, -1.9, 0.35, -2.0, 0.3, -2.05);
    shape.lineTo(0.18, -2.05);

    // Right engine area
    shape.lineTo(0.18, -2.15);
    shape.lineTo(0.1, -2.25); // engine bell

    // Bottom center
    shape.lineTo(-0.1, -2.25);
    shape.lineTo(-0.18, -2.15);

    // Left side (mirror)
    shape.lineTo(-0.18, -2.05);
    shape.lineTo(-0.3, -2.05);
    shape.bezierCurveTo(-0.35, -2.0, -0.28, -1.9, -0.22, -1.85);
    shape.lineTo(-0.35, -1.65);
    shape.lineTo(-0.35, -1.55);

    // Left wing trailing edge
    shape.bezierCurveTo(-0.8, -1.6, -1.3, -1.5, -1.45, -1.25);
    // Left wing sweeps back in
    shape.bezierCurveTo(-1.0, -0.7, -0.5, -0.2, -0.44, 0.0);

    // Left mid-body
    shape.lineTo(-0.42, 1.2);
    shape.bezierCurveTo(-0.35, 1.65, -0.15, 2.0, 0, 2.2);

    // ── Create meshes from the shape ──

    // White body (the main shape)
    const bodyGeo = new THREE.ShapeGeometry(shape, 32);
    const body = new THREE.Mesh(bodyGeo, bodyColor);
    this.group.add(body);

    // ── Black nose cap ──
    const noseShape = new THREE.Shape();
    noseShape.moveTo(0, 2.2);
    noseShape.bezierCurveTo(0.1, 2.05, 0.25, 1.75, 0.33, 1.4);
    noseShape.lineTo(0.30, 1.2);
    noseShape.lineTo(-0.30, 1.2);
    noseShape.lineTo(-0.33, 1.4);
    noseShape.bezierCurveTo(-0.25, 1.75, -0.1, 2.05, 0, 2.2);
    const noseGeo = new THREE.ShapeGeometry(noseShape, 16);
    const nose = new THREE.Mesh(noseGeo, darkColor);
    nose.position.z = 0.001;
    this.group.add(nose);

    // ── Wing leading edge tiles (dark strips) ──
    const leRightShape = new THREE.Shape();
    leRightShape.moveTo(0.42, 0.1);
    leRightShape.bezierCurveTo(0.48, -0.1, 0.95, -0.6, 1.4, -1.2);
    leRightShape.lineTo(1.3, -1.2);
    leRightShape.bezierCurveTo(0.9, -0.55, 0.45, -0.05, 0.40, 0.1);
    leRightShape.closePath();
    const leRightGeo = new THREE.ShapeGeometry(leRightShape, 16);
    const leRight = new THREE.Mesh(leRightGeo, darkColor);
    leRight.position.z = 0.002;
    this.group.add(leRight);

    const leLeftShape = new THREE.Shape();
    leLeftShape.moveTo(-0.42, 0.1);
    leLeftShape.bezierCurveTo(-0.48, -0.1, -0.95, -0.6, -1.4, -1.2);
    leLeftShape.lineTo(-1.3, -1.2);
    leLeftShape.bezierCurveTo(-0.9, -0.55, -0.45, -0.05, -0.40, 0.1);
    leLeftShape.closePath();
    const leLeftGeo = new THREE.ShapeGeometry(leLeftShape, 16);
    const leLeft = new THREE.Mesh(leLeftGeo, darkColor);
    leLeft.position.z = 0.002;
    this.group.add(leLeft);

    // ── Cockpit windows ──
    const cockpitShape = new THREE.Shape();
    cockpitShape.moveTo(0, 1.65);
    cockpitShape.bezierCurveTo(0.18, 1.6, 0.28, 1.45, 0.28, 1.3);
    cockpitShape.lineTo(0.25, 1.15);
    cockpitShape.lineTo(-0.25, 1.15);
    cockpitShape.lineTo(-0.28, 1.3);
    cockpitShape.bezierCurveTo(-0.28, 1.45, -0.18, 1.6, 0, 1.65);
    const cockpitGeo = new THREE.ShapeGeometry(cockpitShape, 12);
    const cockpit = new THREE.Mesh(cockpitGeo, windowColor);
    cockpit.position.z = 0.003;
    this.group.add(cockpit);

    // ── Payload bay doors (lines along body center) ──
    const bayShape = new THREE.Shape();
    bayShape.moveTo(-0.04, 1.1);
    bayShape.lineTo(0.04, 1.1);
    bayShape.lineTo(0.04, -1.4);
    bayShape.lineTo(-0.04, -1.4);
    bayShape.closePath();
    const bayGeo = new THREE.ShapeGeometry(bayShape, 2);
    const bay = new THREE.Mesh(bayGeo, darkColor);
    bay.position.z = 0.002;
    this.group.add(bay);

    // ── OMS pods ──
    for (const side of [-1, 1]) {
      const omsShape = new THREE.Shape();
      omsShape.moveTo(side * 0.2, -1.82);
      omsShape.bezierCurveTo(side * 0.28, -1.85, side * 0.33, -1.95, side * 0.28, -2.02);
      omsShape.lineTo(side * 0.15, -2.02);
      omsShape.lineTo(side * 0.15, -1.82);
      omsShape.closePath();
      const omsGeo = new THREE.ShapeGeometry(omsShape, 8);
      const oms = new THREE.Mesh(omsGeo, grayColor);
      oms.position.z = 0.004;
      this.group.add(oms);
    }

    // ── Three engine bells at rear ──
    for (const cx of [-0.08, 0, 0.08]) {
      // Engine bell shape (trapezoid)
      const engShape = new THREE.Shape();
      engShape.moveTo(cx - 0.04, -2.2);
      engShape.lineTo(cx + 0.04, -2.2);
      engShape.lineTo(cx + 0.06, -2.4);
      engShape.lineTo(cx - 0.06, -2.4);
      engShape.closePath();
      const engGeo = new THREE.ShapeGeometry(engShape, 4);
      const eng = new THREE.Mesh(engGeo, grayColor);
      eng.position.z = 0.005;
      this.group.add(eng);

      // Engine glow
      const glowShape = new THREE.Shape();
      glowShape.moveTo(cx - 0.025, -2.3);
      glowShape.lineTo(cx + 0.025, -2.3);
      glowShape.lineTo(cx + 0.04, -2.42);
      glowShape.lineTo(cx - 0.04, -2.42);
      glowShape.closePath();
      const glowMat = new THREE.MeshStandardMaterial({
        color: 0xFF7700, roughness: 0.15,
        emissive: 0xFF4400, emissiveIntensity: 0.8,
        side: THREE.DoubleSide,
      });
      const glowGeo = new THREE.ShapeGeometry(glowShape, 4);
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.z = 0.006;
      this.group.add(glow);
      this._engineGlows.push(glow);
    }

    // ── Center engine detail line ──
    const centerLine = new THREE.Shape();
    centerLine.moveTo(-0.02, -1.55);
    centerLine.lineTo(0.02, -1.55);
    centerLine.lineTo(0.02, -2.0);
    centerLine.lineTo(-0.02, -2.0);
    centerLine.closePath();
    const clGeo = new THREE.ShapeGeometry(centerLine, 2);
    const cl = new THREE.Mesh(clGeo, grayColor);
    cl.position.z = 0.002;
    this.group.add(cl);

    // ── Rotate so the flat shape faces +Z (camera direction) ──
    // ShapeGeometry creates in XY plane by default, which is correct
    // since camera is at z=8 looking at origin (XY plane)
  }

  /* ── Orientation (always face camera, nose points along velocity) ── */

  _orientToVelocity() {
    const dir = this.velocity.clone();
    if (dir.length() < 0.001) return;

    // The shuttle shape is in XY plane, nose at +Y.
    // We want: shape stays flat (in XY plane), nose (+Y) points along velocity.
    const angle = Math.atan2(dir.y, dir.x) - Math.PI / 2;
    this.group.rotation.z = angle;
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

    this.position = new THREE.Vector3(sx, sy, 0);
    // Z-position: slightly behind the Mars planet so it appears in front
    this.group.position.z = 3;

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
    this.group.position.x = this.position.x;
    this.group.position.y = this.position.y;

    // Pulse engine glows
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.015);
    for (const g of this._engineGlows) {
      g.material.emissiveIntensity = 0.5 + pulse * 0.4;
    }

    if (this._spawnCooldown <= 0) {
      this._nextTurn -= deltaTime;
      if (this._nextTurn <= 0) {
        const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
        const deviation = (Math.random() - 0.5) * (Math.PI / 3);
        const newAngle = currentAngle + deviation;
        const speed = 0.08 + Math.random() * 0.15;
        this.velocity.set(Math.cos(newAngle) * speed, Math.sin(newAngle) * speed, 0);
        this._orientToVelocity();
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
