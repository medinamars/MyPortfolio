export function createHomeSection() {
  const section = document.getElementById('home');
  section.innerHTML = `
    <div class="container">
      <div class="content-grid">
        <div class="home-content fade-in">
          <p class="home-tag">🚀 Welcome to my universe</p>
          <h1 class="section-title">Mars Medina</h1>
          <p class="section-subtitle">Full-Stack Developer • 17+ Years Experience</p>
          <p class="home-bio">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <a href="#projects" class="btn-primary">Explore My Work</a>
        </div>
        <div class="home-planet-spacer"></div>
      </div>
    </div>
    <div class="scroll-indicator">
      <span>Scroll to explore</span>
      <div class="scroll-arrow"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .home-tag {
      font-family: var(--font-mono);
      color: var(--color-terracotta);
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .home-bio {
      color: var(--color-star-dim);
      line-height: 1.8;
      margin-bottom: 2rem;
      max-width: 500px;
    }
    .btn-primary {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, var(--color-rust), var(--color-terracotta));
      color: var(--color-space);
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(193, 68, 14, 0.4);
    }
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      color: var(--color-dust);
      font-size: 0.8rem;
      animation: float 2s ease-in-out infinite;
    }
    .scroll-arrow {
      width: 20px;
      height: 20px;
      border-right: 2px solid var(--color-terracotta);
      border-bottom: 2px solid var(--color-terracotta);
      transform: rotate(45deg);
      margin: 0.5rem auto 0;
    }
    .home-planet-spacer {
      width: 300px;
      height: 300px;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    @media (max-width: 768px) {
      .content-grid { grid-template-columns: 1fr; gap: 2rem; }
    }
    .section-title {
      font-family: var(--font-heading);
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-atmosphere);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .section-subtitle {
      font-size: 1.25rem;
      color: var(--color-sandy);
      margin-bottom: 2rem;
      font-weight: 300;
    }
  `;
  section.appendChild(style);
}
