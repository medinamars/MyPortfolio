export function createResumeSection() {
  const section = document.getElementById('resume');
  section.innerHTML = `
    <div class="container">
      <div class="content-grid">
        <div class="resume-content">
          <h2 class="section-title">Resume</h2>
          <p class="section-subtitle">A summary of my qualifications</p>
          <div class="resume-section">
            <h3 class="resume-heading">Education</h3>
            <div class="resume-item">
              <strong>Bachelor of Science in Computer Engineering</strong>
              <p>Bulacan State University, Philippines — 2002–2007</p>
            </div>
            <div class="resume-item">
              <strong>Bachelor in Industrial Technology (Computer)</strong>
              <p>Bulacan State University, Philippines — 1999–2002</p>
            </div>
          </div>
          <div class="resume-section">
            <h3 class="resume-heading">Languages</h3>
            <div class="resume-item">
              <p>English (Fluent), Filipino (Native)</p>
            </div>
          </div>
          <a href="/Marcelo-Medina-Resume.pdf" class="btn-primary" download>Download Full Resume</a>
        </div>
        <div class="resume-visual">
          <svg viewBox="0 0 300 300" class="radar-chart">
            <polygon points="150,30 250,100 250,220 150,270 50,220 50,100" fill="none" stroke="#725130" stroke-width="1"/>
            <polygon points="150,60 220,110 220,200 150,240 80,200 80,110" fill="none" stroke="#725130" stroke-width="1"/>
            <polygon points="150,90 190,120 190,180 150,210 110,180 110,120" fill="none" stroke="#725130" stroke-width="1"/>
            <polygon points="150,40 240,105 230,215 150,260 70,215 60,105" fill="rgba(226,114,91,0.15)" stroke="#E2725B" stroke-width="2"/>
            <text x="150" y="25" text-anchor="middle" fill="#B49B63" font-size="10">Backend</text>
            <text x="255" y="95" text-anchor="start" fill="#B49B63" font-size="10">Cloud</text>
            <text x="255" y="225" text-anchor="start" fill="#B49B63" font-size="10">DevOps</text>
            <text x="150" y="285" text-anchor="middle" fill="#B49B63" font-size="10">Frontend</text>
            <text x="45" y="225" text-anchor="end" fill="#B49B63" font-size="10">Database</text>
            <text x="45" y="95" text-anchor="end" fill="#B49B63" font-size="10">Architecture</text>
          </svg>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
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
    .resume-heading {
      font-family: var(--font-heading);
      color: var(--color-atmosphere);
      font-size: 1.1rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .resume-section { margin-bottom: 2rem; }
    .resume-item { margin-bottom: 0.75rem; }
    .resume-item strong { color: var(--color-star); }
    .resume-item p { color: var(--color-star-dim); font-size: 0.9rem; }
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
    .resume-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .radar-chart { width: 100%; max-width: 350px; }
  `;
  section.appendChild(style);
}
