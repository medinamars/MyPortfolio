const experience = [
  {
    year: '2023 — Present',
    role: 'Senior Full-Stack Developer',
    company: 'Lorem Ipsum Corp.',
    description: 'Lead architect for cloud-native solutions. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
    skills: ['Azure', '.NET 8', 'React', 'Kubernetes'],
  },
  {
    year: '2020 — 2023',
    role: 'Full-Stack Developer',
    company: 'Dolor Sit Amet Technologies',
    description: 'Designed and implemented microservices architecture. Consectetur adipiscing elit, sed do eiusmod tempor.',
    skills: ['C#', 'Docker', 'SQL Server', 'AWS'],
  },
  {
    year: '2017 — 2020',
    role: 'Backend Developer',
    company: 'Ullamco Laboris Inc.',
    description: 'Built RESTful APIs and data pipelines. Duis aute irure dolor in reprehenderit in voluptate velit.',
    skills: ['.NET Core', 'PostgreSQL', 'Redis', 'CI/CD'],
  },
  {
    year: '2014 — 2017',
    role: 'Software Developer',
    company: 'Excepteur Sint Solutions',
    description: 'Full-stack development for enterprise applications. Nemo enim ipsam voluptatem quia voluptas sit.',
    skills: ['ASP.NET', 'JavaScript', 'SQL Server'],
  },
  {
    year: '2009 — 2014',
    role: 'Junior Developer',
    company: 'Voluptatem Systems Ltd.',
    description: 'Started my journey in software development. At vero eos et accusamus et iusto odio dignissimos.',
    skills: ['C#', 'ASP.NET', 'HTML/CSS', 'SQL'],
  },
];

export function createExperienceSection() {
  const section = document.getElementById('experience');
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title" style="text-align:center">Experience</h2>
      <p class="section-subtitle" style="text-align:center">17+ years of building software — from landing on Mars to the present</p>
      <div class="timeline">
        ${experience.map((exp, i) => `
          <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
              <span class="timeline-year">${exp.year}</span>
              <h3 class="timeline-role">${exp.role}</h3>
              <span class="timeline-company">${exp.company}</span>
              <p class="timeline-desc">${exp.description}</p>
              <div class="timeline-skills">
                ${exp.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
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
    .tech-tag {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: var(--color-sandy);
      font-family: var(--font-mono);
    }
    .timeline {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, var(--color-rust), var(--color-terracotta), var(--color-crater));
    }
    .timeline-item {
      position: relative;
      width: 50%;
      padding: 0 2rem;
      margin-bottom: 2rem;
    }
    .timeline-item.left { left: 0; text-align: right; }
    .timeline-item.right { left: 50%; text-align: left; }
    .timeline-dot {
      position: absolute;
      top: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--color-terracotta);
      border: 2px solid var(--color-atmosphere);
    }
    .timeline-item.left .timeline-dot { right: -8px; }
    .timeline-item.right .timeline-dot { left: -8px; }
    .timeline-card {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      padding: 1.5rem;
      border-radius: 8px;
      transition: border-color 0.3s;
    }
    .timeline-card:hover { border-color: var(--color-terracotta); }
    .timeline-year {
      font-family: var(--font-mono);
      color: var(--color-atmosphere);
      font-size: 0.85rem;
    }
    .timeline-role {
      font-family: var(--font-heading);
      color: var(--color-star);
      font-size: 1.1rem;
      margin: 0.25rem 0;
    }
    .timeline-company {
      color: var(--color-terracotta);
      font-size: 0.9rem;
    }
    .timeline-desc {
      color: var(--color-star-dim);
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0.75rem 0;
    }
    .timeline-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .timeline-item.right .timeline-skills { justify-content: flex-start; }
    @media (max-width: 768px) {
      .timeline::before { left: 20px; }
      .timeline-item { width: 100%; left: 0 !important; padding-left: 50px; text-align: left !important; }
      .timeline-dot { left: 12px !important; right: auto !important; }
    }
  `;
  section.appendChild(style);
}
