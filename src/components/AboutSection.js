const dummyPhotoUrl = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect fill="%233D2B1F" width="300" height="300"/><circle cx="150" cy="120" r="50" fill="%23725130"/><rect x="80" y="190" width="140" height="80" rx="10" fill="%23725130"/></svg>';

const techStack = [
  { category: 'Languages', skills: ['C#', 'JavaScript', 'TypeScript', 'Python', 'SQL'] },
  { category: 'Backend', skills: ['.NET', 'ASP.NET Core', 'REST APIs', 'Microservices'] },
  { category: 'Cloud', skills: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  { category: 'Frontend', skills: ['React', 'Vue.js', 'HTML5', 'CSS3', 'Three.js'] },
  { category: 'Databases', skills: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Redis'] },
];

export function createAboutSection() {
  const section = document.getElementById('about');
  section.innerHTML = `
    <div class="container">
      <div class="content-grid">
        <div class="about-photo-wrapper">
          <img src="${dummyPhotoUrl}" alt="Profile photo placeholder" class="about-photo" />
          <div class="photo-badge">📍 Mississauga, ON</div>
        </div>
        <div class="about-content">
          <h2 class="section-title">About Me</h2>
          <p class="about-bio">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod
            nunc non nisi efficitur, a tincidunt arcu sollicitudin. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p class="about-bio">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
          </p>
          <div class="tech-stack">
            ${techStack.map(cat => `
              <div class="tech-group">
                <h3 class="tech-category">${cat.category}</h3>
                <div class="tech-tags">
                  ${cat.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .about-photo-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
    }
    .about-photo {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      border: 3px solid var(--color-terracotta);
      object-fit: cover;
      filter: grayscale(30%);
      transition: filter 0.3s;
    }
    .about-photo:hover { filter: grayscale(0%); }
    .photo-badge {
      position: absolute;
      bottom: 20px;
      background: var(--color-dark);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid var(--color-crater);
      font-size: 0.85rem;
    }
    .about-bio {
      color: var(--color-star-dim);
      line-height: 1.8;
      margin-bottom: 1rem;
    }
    .tech-stack { margin-top: 2rem; }
    .tech-category {
      font-family: var(--font-heading);
      font-size: 0.85rem;
      text-transform: uppercase;
      color: var(--color-terracotta);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .tech-tag {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: var(--color-sandy);
      font-family: var(--font-mono);
      transition: border-color 0.3s;
    }
    .tech-tag:hover { border-color: var(--color-terracotta); }
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
  `;
  section.appendChild(style);
}
