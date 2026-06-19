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
    this.type = type; // 'planet', 'sun', or 'asteroid'
    this.mesh = null;
    this.alive = true;
    this.rotationSpeed = randomRange(0.005, 0.02);
    this.create(config);
  }

  create(config) {
    if (this.type === 'planet') {
      this.createPlanet(config.planetType);
    } else if (this.type === 'sun') {
      this.createSun();
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

  createSun() {
    const radius = randomRange(0.8, 1.2);
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      emissive: 0xFFA500,
      emissiveIntensity: 2.0,
      roughness: 0.3,
      metalness: 0.0,
    });

    this.mesh = new THREE.Group();
    const sphere = new THREE.Mesh(geometry, material);
    this.mesh.add(sphere);

    // Glow halo
    const haloGeo = new THREE.SphereGeometry(radius * 1.5, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xFFA500,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    this.mesh.add(new THREE.Mesh(haloGeo, haloMat));

    // Outer glow
    const outerGlowGeo = new THREE.SphereGeometry(radius * 2.0, 32, 32);
    const outerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xFF8C00,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });
    this.mesh.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));

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

  update(deltaTime) {
    // Move along trajectory
    this.position.add(
      new THREE.Vector3(
        this.velocity.x * deltaTime,
        this.velocity.y * deltaTime,
        0
      )
    );
    this.mesh.position.copy(this.position);

    // Self rotation
    if (this.mesh) {
      this.mesh.rotation.y += this.rotationSpeed;
      this.mesh.rotation.x += this.rotationSpeed * 0.3;
    }

    // Check if out of bounds (well past camera view)
    if (
      this.position.x < -15 ||
      this.position.x > 15 ||
      this.position.y < -15 ||
      this.position.y > 15
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
    this.maxObjects = 2;
    this.group = new THREE.Group();
  }

  add(scene) {
    // Position behind Mars (which is at z=0)
    this.group.position.z = -5;
    scene.add(this.group);
  }

  spawn() {
    if (this.objects.length >= this.maxObjects) return;

    // Check what's currently on screen
    const hasSun = this.objects.some(o => o.type === 'sun');
    
    // For planets, track which specific types are visible
    const visiblePlanetTypes = new Set();
    for (const obj of this.objects) {
      if (obj.type === 'planet' && obj._planetType) {
        visiblePlanetTypes.add(obj._planetType);
      }
    }

    // Decide what to spawn — weighted: more asteroids, fewer suns
    const roll = Math.random();
    let type, config;

    if (roll < 0.15 && !hasSun) {
      // Sun — rare, only one at a time
      type = 'sun';
      config = this.generateSunConfig();
    } else if (roll < 0.6) {
      // Planet — only spawn types not already visible
      const availableTypes = Object.keys(PLANET_TYPES).filter(t => !visiblePlanetTypes.has(t));
      if (availableTypes.length === 0) return; // all planet types on screen, skip
      type = 'planet';
      config = this.generatePlanetConfig(availableTypes[Math.floor(Math.random() * availableTypes.length)]);
    } else {
      // Asteroid — always allowed
      type = 'asteroid';
      config = this.generateAsteroidConfig();
    }

    const obj = new PassingObject(type, config);
    // Remember which planet type was spawned
    if (type === 'planet') {
      obj._planetType = config.planetType;
    }
    this.group.add(obj.mesh);
    this.objects.push(obj);
  }

  generateSunConfig() {
    // Sun enters from upper-right edge, trajectory aimed through center
    const startX = randomRange(8, 12);
    const startY = randomRange(4, 8);
    const speed = randomRange(0.15, 0.3);
    const dir = this.aimTowardCenter(startX, startY);
    return {
      startX,
      startY,
      startZ: -randomRange(2, 6),
      velX: dir.x * speed,
      velY: dir.y * speed,
    };
  }

  generatePlanetConfig(planetType) {
    // Planets enter from right side, trajectory aimed through center
    const startX = randomRange(8, 12);
    const startY = randomRange(-5, 5);
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
    // Asteroids: random entry point and trajectory
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let startX, startY;
    const entryDist = 12;

    switch (side) {
      case 0: // top
        startX = randomRange(-entryDist, entryDist);
        startY = entryDist;
        break;
      case 1: // right
        startX = entryDist;
        startY = randomRange(-entryDist, entryDist);
        break;
      case 2: // bottom
        startX = randomRange(-entryDist, entryDist);
        startY = -entryDist;
        break;
      case 3: // left
        startX = -entryDist;
        startY = randomRange(-entryDist, entryDist);
        break;
    }

    // Random angle toward center-ish area
    const targetX = randomRange(-3, 3);
    const targetY = randomRange(-3, 3);
    const dir = new THREE.Vector2(targetX - startX, targetY - startY).normalize();
    const speed = randomRange(0.3, 0.8); // Asteroids are faster

    return {
      startX,
      startY,
      startZ: -randomRange(1, 4),
      velX: dir.x * speed,
      velY: dir.y * speed,
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
