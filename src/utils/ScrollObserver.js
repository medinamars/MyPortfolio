export class ScrollObserver {
  constructor(marsScene) {
    this.marsScene = marsScene;
    this.sectionPositions = {
      home: { x: 3, y: 0, z: 8 },
      about: { x: -3, y: 0, z: 8 },
      projects: { x: -3, y: 1, z: 9 },
      experience: { x: 3, y: -1, z: 9 },
      resume: { x: -2, y: 0, z: 7 },
      contact: { x: 0, y: 0, z: 8 },
    };
    this.currentSection = 'home';
    this.init();
  }

  init() {
    const sections = document.querySelectorAll('section[id]');
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.15 });
    sections.forEach(s => fadeObserver.observe(s));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id !== this.currentSection) {
          this.currentSection = entry.target.id;
          this.animateCamera(entry.target.id);
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => sectionObserver.observe(s));
  }

  animateCamera(sectionId) {
    const target = this.sectionPositions[sectionId];
    if (!target || !this.marsScene?.camera) return;
    const camera = this.marsScene.camera;
    const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const endPos = target;
    const duration = 800;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.x = startPos.x + (endPos.x - startPos.x) * eased;
      camera.position.y = startPos.y + (endPos.y - startPos.y) * eased;
      camera.position.z = startPos.z + (endPos.z - startPos.z) * eased;
      camera.lookAt(0, 0, 0);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
