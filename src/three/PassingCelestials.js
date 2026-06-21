import * as THREE from 'three';

const PLANET_TYPES = {
  jupiter: {
    radius: [0.6, 1.0],
    color: '#C88B3A',
    bands: ['#D4A55A', '#8B6914', '#C88B3A', '#E8C07A', '#A0722A'],
    speed: [0.003, 0.006],
  },
  saturn: {
    radius: [0.5, 0.8],
    color: '#D4B896',
    bands: ['#E8D5B7', '#C4A882', '#D4B896', '#B89B72'],
    speed: [0.002, 0.005],
    hasRings: true,
  },
  earth: {
    radius: [0.3, 0.5],
    color: '#4A90D9',
    bands: ['#4A90D9', '#2E7D32', '#81C784', '#64B5F6'],
    speed: [0.004, 0.007],
  },
  neptune: {
    radius: [0.4, 0.7],
    color: '#5B7FD9',
    bands: ['#5B7FD9', '#3F51B5', '#7986CB', '#42A5F5'],
    speed: [0.003, 0.006],
  },
};

const ASTEROID_COLORS = ['#8B7355', '#6B5B45', '#9E8E7E', '#7A6A5A'];

// Spaceship types
const SPACESHIP_TYPES = {
  starship: {
    bodyColor: '#E8E8E8',
    accentColor: '#C0C0C0',
    length: 0.7,
    radius: 0.12,
  },
  rocket: {
    bodyColor: '#F5F5F5',
    accentColor: '#D0D0D0',
    length: 0.55,
    radius: 0.09,
  },
};

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function createPlanetTexture(type, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base fill
  ctx.fillStyle = type.color;
  ctx.fillRect(0, 0, size, size);

  // Horizontal bands
  const bandCount = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < bandCount; i++) {
    const y = (size / bandCount) * i;
    const h = size / bandCount;
    ctx.fillStyle = type.bands[i % type.bands.length];
    ctx.globalAlpha = 0.3 + Math.random() * 0.3;
    ctx.fillRect(0, y, size, h);
  }

  // Surface detail spots
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 15 + 3;
    ctx.fillStyle = type.bands[Math.floor(Math.random() * type.bands.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
  return new THREE.CanvasTexture(canvas);
}

function createAsteroidTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)];
  ctx.fillRect(0, 0, size, size);

  // Craters and roughness
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 12 + 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function createAsteroidGeometry(radius) {
  // Irregular shape using icosahedron with low detail + noise
  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const positions = geo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const noise = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 variation
    positions.setXYZ(i, x * noise, y * noise, z * noise);
  }
  geo.computeVertexNormals();
  return geo;
}

class PassingObject {
  constructor(type, config) {
    this.type = type; // 'planet', 'asteroid', or 'spaceship'
    this.mesh = null;
    this.alive = true;
    this.rotationSpeed = randomRange(0.3, 1.2);
    // Spaceship-specific
    this.steerTimer = 0;
    this.steerInterval = randomRange(2, 5);
    this.accelTimer = 0;
    this.accelInterval = randomRange(1, 3);
    this.targetSpeed = randomRange(0.3, 0.6);
    this.currentSpeed = this.targetSpeed;
    this.heading = 0;
    this.create(config);
  }

  create(config) {
    if (this.type === 'planet') {
      this.createPlanet(config.planetType);
    } else if (this.type === 'spaceship') {
      this.createSpaceship(config.shipType);
    } else {
      this.createAsteroid();
    }

    // Set starting position based on trajectory
    this.position = new THREE.Vector3(
      config.startX,
      config.startY,
      config.startZ
    );
    this.velocity = new THREE.Vector3(
      config.velX,
      config.velY,
      0
    );
    this.mesh.position.copy(this.position);
  }

  createPlanet(planetType) {
    const typeConfig = PLANET_TYPES[planetType];
    const radius = randomRange(typeConfig.radius[0], typeConfig.radius[1]);

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const texture = createPlanetTexture(typeConfig);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.1,
    });

    this.mesh = new THREE.Group();
    const sphere = new THREE.Mesh(geometry, material);
    this.mesh.add(sphere);

    // Saturn rings
    if (typeConfig.hasRings) {
      const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 64);
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = 256;
      ringCanvas.height = 64;
      const rctx = ringCanvas.getContext('2d');
      // Gradient ring
      const grad = rctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0, 'rgba(180,160,130,0.1)');
      grad.addColorStop(0.3, 'rgba(200,180,150,0.7)');
      grad.addColorStop(0.5, 'rgba(180,160,130,0.3)');
      grad.addColorStop(0.7, 'rgba(200,180,150,0.6)');
      grad.addColorStop(1, 'rgba(180,160,130,0.1)');
      rctx.fillStyle = grad;
      rctx.fillRect(0, 0, 256, 64);

      const ringTexture = new THREE.CanvasTexture(ringCanvas);
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.4;
      this.mesh.add(ring);
    }

    this.radius = radius;
  }

  createAsteroid() {
    const radius = randomRange(0.1, 0.3);
    const geometry = createAsteroidGeometry(radius);
    const texture = createAsteroidTexture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.05,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.radius = radius;
  }

  createSpaceship(shipType) {
    const typeConfig = SPACESHIP_TYPES[shipType] || SPACESHIP_TYPES.starship;
    this.mesh = new THREE.Group();

    // Main cylindrical body
    const bodyGeo = new THREE.CylinderGeometry(typeConfig.radius, typeConfig.radius * 1.05, typeConfig.length, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: typeConfig.bodyColor,
      roughness: 0.3,
      metalness: 0.7,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.mesh.add(body);

    // Nose cone
    const noseGeo = new THREE.ConeGeometry(typeConfig.radius, typeConfig.length * 0.25, 16);
    const noseMat = new THREE.MeshStandardMaterial({
      color: typeConfig.accentColor,
      roughness: 0.3,
      metalness: 0.7,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.y = typeConfig.length * 0.5 + typeConfig.length * 0.125;
    this.mesh.add(nose);

    // Grid fins at base (4 fins)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(typeConfig.radius * 0.8, -typeConfig.length * 0.15);
    finShape.lineTo(typeConfig.radius * 1.2, -typeConfig.length * 0.15);
    finShape.lineTo(typeConfig.radius * 1.2, 0);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.02, bevelEnabled: false });
    const finMat = new THREE.MeshStandardMaterial({
      color: typeConfig.accentColor,
      roughness: 0.4,
      metalness: 0.8,
    });

    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.y = -typeConfig.length * 0.5;
      fin.rotation.y = (Math.PI / 2) * i;
      fin.rotation.x = Math.PI;
      this.mesh.add(fin);
    }

    // Side fins/wings
    const sideFinShape = new THREE.Shape();
    sideFinShape.moveTo(0, 0);
    sideFinShape.lineTo(typeConfig.radius * 0.6, -typeConfig.length * 0.2);
    sideFinShape.lineTo(typeConfig.radius * 1.5, -typeConfig.length * 0.15);
    sideFinShape.lineTo(typeConfig.radius * 1.5, typeConfig.length * 0.05);
    sideFinShape.closePath();

    const sideFinGeo = new THREE.ExtrudeGeometry(sideFinShape, { depth: 0.015, bevelEnabled: false });
    for (let i = 0; i < 3; i++) {
      const sideFin = new THREE.Mesh(sideFinGeo, finMat);
      sideFin.position.y = -typeConfig.length * 0.2;
      sideFin.rotation.y = (Math.PI * 2 / 3) * i;
      this.mesh.add(sideFin);
    }

    // Window/portal
    const windowGeo = new THREE.CircleGeometry(typeConfig.radius * 0.25, 16);
    const windowMat = new THREE.MeshStandardMaterial({
      color: '#1a1a2e',
      roughness: 0.1,
      metalness: 0.9,
      emissive: '#334466',
      emissiveIntensity: 0.3,
    });
    const window_ = new THREE.Mesh(windowGeo, windowMat);
    window_.position.y = typeConfig.length * 0.2;
    window_.position.z = typeConfig.radius + 0.01;
    this.mesh.add(window_);

    this.radius = typeConfig.radius;
  }

  update(deltaTime) {
    // Spaceship-specific: steering, speed changes, and facing direction
    if (this.type === 'spaceship') {
      this.steerTimer += deltaTime;
      this.accelTimer += deltaTime;

      // Change direction periodically
      if (this.steerTimer >= this.steerInterval) {
        this.steerTimer = 0;
        this.steerInterval = randomRange(2, 5);
        this.heading += randomRange(-0.8, 0.8);
        this.velocity.x = Math.cos(this.heading);
        this.velocity.y = -Math.sin(this.heading);
      }

      // Change speed periodically
      if (this.accelTimer >= this.accelInterval) {
        this.accelTimer = 0;
        this.accelInterval = randomRange(1, 3);
        this.targetSpeed = randomRange(0.3, 0.6);
      }

      // Smoothly approach target speed
      this.currentSpeed += (this.targetSpeed - this.currentSpeed) * deltaTime * 2;

      // Update velocity from heading and current speed
      this.velocity.x = Math.cos(this.heading) * this.currentSpeed;
      this.velocity.y = -Math.sin(this.heading) * this.currentSpeed;

      // Update mesh to face movement direction (offset by PI/2 since geometry points +Y)
      this.mesh.rotation.z = -this.heading + Math.PI / 2;
    }

    // Move along trajectory
    this.position.add(
      new THREE.Vector3(
        this.velocity.x * deltaTime,
        this.velocity.y * deltaTime,
        0
      )
    );
    this.mesh.position.copy(this.position);

    // Self rotation (frame-rate independent) - planets and asteroids only
    if (this.mesh && this.type !== 'spaceship') {
      this.mesh.rotation.y += this.rotationSpeed * deltaTime;
    }

    // Check if well past viewport bounds (3x viewport size)
    const boundX = (this._boundX || 15) * 3;
    const boundY = (this._boundY || 10) * 3;
    if (
      this.position.x < -boundX ||
      this.position.x > boundX ||
      this.position.y < -boundY ||
      this.position.y > boundY
    ) {
      this.alive = false;
    }
  }
}

export class PassingCelestials {
  constructor() {
    this.objects = [];
    this.spawnTimer = 0;
    this.spawnInterval = randomRange(4, 8); // seconds between spawn checks
    this.maxObjects = 8; // max total objects (planets + asteroids + spaceships)
    this.maxPlanets = 1; // only one planet visible at a time
    this.group = new THREE.Group();
    this.camera = null;
    this.viewportHalfH = 5;
    this.viewportHalfW = 10;
  }

  add(scene, camera) {
    // Position behind Mars (which is at z=0)
    this.group.position.z = -5;
    scene.add(this.group);
    if (camera) {
      this.camera = camera;
      this.updateViewportBounds();
    }
  }

  // Compute visible half-width and half-height at the spawn plane (z=-5)
  updateViewportBounds() {
    if (!this.camera) return;
    const distToSpawnPlane = 13; // camera at z=8, spawn plane at z=-5 => 13 units
    const fovRad = this.camera.fov * (Math.PI / 180);
    this.viewportHalfH = distToSpawnPlane * Math.tan(fovRad / 2);
    this.viewportHalfW = this.viewportHalfH * this.camera.aspect;
  }

  spawn() {
    if (this.objects.length >= this.maxObjects) return;

    // Only one planet allowed on screen at a time
    const planetCount = this.objects.filter(obj => obj.type === 'planet').length;

    // Always spawn spaceship for testing
    let type = 'spaceship';
    let config = this.generateSpaceshipConfig();

    const obj = new PassingObject(type, config);
    // Remember which planet type was spawned
    if (type === 'planet') {
      obj._planetType = config.planetType;
    }
    // Pass viewport bounds for out-of-bounds checking
    obj._boundX = this.viewportHalfW;
    obj._boundY = this.viewportHalfH;
    this.group.add(obj.mesh);
    this.objects.push(obj);
  }

  generatePlanetConfig(planetType) {
    // Planets enter from upper-right corner, same angle/direction as sun, trajectory aimed through center
    const margin = 1.5;
    const startX = this.viewportHalfW * margin;
    const startY = this.viewportHalfH * randomRange(0.8, 1.2);
    const speed = randomRange(0.1, 0.25);
    const dir = this.aimTowardCenter(startX, startY);
    return {
      startX,
      startY,
      startZ: -randomRange(2, 6),
      velX: dir.x * speed,
      velY: dir.y * speed,
      planetType,
    };
  }

  generateAsteroidConfig() {
    // Asteroids: random entry point just off-screen and trajectory
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let startX, startY;
    const margin = 1.5;

    switch (side) {
      case 0: // top
        startX = this.viewportHalfW * randomRange(-1, 1);
        startY = this.viewportHalfH * margin;
        break;
      case 1: // right
        startX = this.viewportHalfW * margin;
        startY = this.viewportHalfH * randomRange(-1, 1);
        break;
      case 2: // bottom
        startX = this.viewportHalfW * randomRange(-1, 1);
        startY = -(this.viewportHalfH * margin);
        break;
      case 3: // left
        startX = -(this.viewportHalfW * margin);
        startY = this.viewportHalfH * randomRange(-1, 1);
        break;
    }

    // Random angle toward center-ish area
    const targetX = randomRange(-3, 3);
    const targetY = randomRange(-3, 3);
    const dir = new THREE.Vector2(targetX - startX, targetY - startY).normalize();
    const speed = randomRange(0.3, 0.8); // Asteroids are faster

    // Some asteroids fly in front of Mars (positive z), some behind (negative z)
    const inFront = Math.random() > 0.5;
    const startZ = inFront ? randomRange(1, 4) : -randomRange(1, 4);

    return {
      startX,
      startY,
      startZ,
      velX: dir.x * speed,
      velY: dir.y * speed,
    };
  }

  generateSpaceshipConfig() {
    // Spaceships enter from edges with more purposeful trajectories
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    const margin = 1.8;

    switch (side) {
      case 0: // top
        startX = this.viewportHalfW * randomRange(-0.5, 0.5);
        startY = this.viewportHalfH * margin;
        break;
      case 1: // right
        startX = this.viewportHalfW * margin;
        startY = this.viewportHalfH * randomRange(-0.5, 0.5);
        break;
      case 2: // bottom
        startX = this.viewportHalfW * randomRange(-0.5, 0.5);
        startY = -(this.viewportHalfH * margin);
        break;
      case 3: // left
        startX = -(this.viewportHalfW * margin);
        startY = this.viewportHalfH * randomRange(-0.5, 0.5);
        break;
    }

    // Aim toward center with some variation
    const targetX = randomRange(-2, 2);
    const targetY = randomRange(-2, 2);
    const dir = new THREE.Vector2(targetX - startX, targetY - startY).normalize();
    const speed = randomRange(0.15, 0.35);

    // Spaceships can appear in front or behind Mars
    const inFront = Math.random() > 0.4; // Slightly more likely in front for visibility
    const startZ = inFront ? randomRange(1, 4) : -randomRange(1, 4);

    return {
      startX,
      startY,
      startZ,
      velX: dir.x * speed,
      velY: dir.y * speed,
      shipType: Math.random() > 0.6 ? 'starship' : 'rocket',
    };
  }

  // Calculate direction from spawn point toward a random target near center (0,0)
  aimTowardCenter(startX, startY) {
    const targetX = randomRange(-1, 1);
    const targetY = randomRange(-1, 1);
    return new THREE.Vector2(targetX - startX, targetY - startY).normalize();
  }

  update(deltaTime) {
    // Spawn check
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnInterval = randomRange(4, 8);
      this.spawn();
    }

    // Update all objects
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      obj.update(deltaTime);
      if (!obj.alive) {
        this.group.remove(obj.mesh);
        // Clean up geometry/materials to prevent memory leaks
        obj.mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        this.objects.splice(i, 1);
      }
    }
  }
}
