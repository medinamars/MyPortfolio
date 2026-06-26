const projects = [
  {
    title: 'TradeSmart Connect',
    description: 'Full-stack cloud solution at Russell A. Farrow — enhanced security, stability, and testability with optimized system performance and improved code coverage.',
    tech: ['.NET 8', 'ASP.NET Boilerplate', 'Entity Framework', 'Azure', 'C#', 'SQL Server', 'Oracle'],
    category: 'backend',
    image: '/MyPortfolio/tradesmart-connect.jpg',
    link: 'https://tradesmartconnect.com',
  },
  {
    title: 'CBSS (Class Booking & Scheduling System)',
    description: 'Handling tens of thousands of True Group customers while supporting the company\'s front desk operations. Successfully fulfilling fitness class bookings since 2013 with high availability, security, and responsiveness.',
    tech: ['ASP.NET', 'C#', 'Web Forms', 'SQL Server', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/cbss.jpg',
    link: 'https://trueclassbooking.com.sg',
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
];

export function createProjectsSection() {
  const section = document.getElementById('projects');
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title" style="text-align:center">Projects</h2>
      <p class="section-subtitle" style="text-align:center">Key projects spanning 17 years of enterprise development</p>
      <div class="project-filters">
        ${filters.map(f => `<button class="filter-btn ${f.id === 'all' ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>`).join('')}
      </div>
      <div class="projects-grid" id="projects-grid">
        ${projects.map(p => `
          <div class="project-card" data-category="${p.category}">
            <div class="project-image">
              <img src="${p.image}" alt="${p.title}" />
            </div>
            <div class="project-info">
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.description}</p>
              <div class="project-tech">
                ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
              <a href="${p.link}" class="project-link">View Project →</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const filterBtns = section.querySelectorAll('.filter-btn');
  const cards = section.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

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
    .project-filters {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .filter-btn {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      color: var(--color-sandy);
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: var(--color-rust);
      color: var(--color-space);
      border-color: var(--color-rust);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .project-card {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s, border-color 0.3s;
    }
    .project-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-terracotta);
    }
    .project-image img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }
    .project-info { padding: 1.5rem; }
    .project-title {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      color: var(--color-star);
      margin-bottom: 0.5rem;
    }
    .project-desc {
      color: var(--color-star-dim);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
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
    }
    .project-link {
      color: var(--color-terracotta);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
  `;
  section.appendChild(style);
}
