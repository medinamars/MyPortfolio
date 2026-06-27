const projects = [
  {
    title: 'TradeSmart Connect',
    description: 'Full-stack cloud solution at Russell A. Farrow — enhanced security, stability, and testability with optimized system performance and improved code coverage.',
    tech: ['.NET 8', 'ASP.NET Boilerplate', 'Entity Framework', 'LINQ', 'Azure', 'Bootstrap', 'C#', 'SQL Server', 'Oracle'],
    category: 'backend',
    image: '/MyPortfolio/tradesmart-connect.jpg',
    link: 'https://tradesmartconnect.com',
  },
  {
    title: 'CBSS (Class Booking & Scheduling System)',
    description: 'Handling tens of thousands of True Group customers while supporting the company\'s front desk operations. Successfully fulfilling fitness class bookings since 2013 with high availability, security, and responsiveness.',
    tech: ['ASP.NET', 'C#', 'Web Forms', 'SQL Server', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/cbss.jpg',
    link: 'https://trueclassbooking.com.sg',
  },
  {
    title: 'TRUE FITNESS Singapore',
    description: 'With a 4.6-star rating on both the App Store and Google Play, this mobile app was developed as part of the fitness class booking system for True Group. It supports single sign-on (SSO), API request signature validation for enhanced security, and delivers a responsive, best-in-class user experience.',
    tech: ['Flutter/Dart', 'RPC', 'Firebase', 'Flutter Flavors', 'App Store Connect', 'Google Play Console'],
    category: 'frontend',
    image: '/MyPortfolio/true-fitness-sg.jpg',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/sg/app/true-fitness-singapore/id1631513854' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.truegroup.cbss_flutter&hl=en_CA&gl=SG' },
    ],
  },
  {
    title: 'TFX Singapore',
    description: 'The TFX-branded counterpart to True Group\'s member app, this mobile application has a 4.7-star rating on the App Store and a 4.4-star rating on Google Play. Its key features include a dedicated catalog of fitness clubs, classes, and instructors, while maintaining the same top-notch user experience and security standards.',
    tech: ['Flutter/Dart', 'RPC', 'Firebase', 'Flutter Flavors', 'App Store Connect', 'Google Play Console'],
    category: 'frontend',
    image: '/MyPortfolio/tfx-sg.jpg',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/sg/app/tfx-singapore/id6467820958' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=sg.tfx.cbss_flutter&hl=en_CA&gl=SG' },
    ],
  },
  {
    title: 'ESP (Electronic Sales Process)',
    description: 'Designed as an internal companion system for True Group\'s sales consultants, this application helps manage leads, calls, appointments, sales, targets, and more. It also provides a step-by-step membership sales workflow to guide consultants and members through the membership purchase process.',
    tech: ['ASP.NET', 'C#', 'MVC', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/esp.jpg',
  },
  {
    title: 'GM Module',
    description: 'A supplementary ESP analytics system delivering real-time operational insights for club General Managers, with centralized tracking of sales, leads, appointments, calls, and key KPIs, using caching and AJAX for fast, responsive performance, and Material Design for a clean, modern UI.',
    tech: ['ASP.NET', 'C#', 'MVC', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/gm-module.jpg',
  },
  {
    title: 'True Group IAM',
    description: 'This system serves as the centralized identity and access management (IAM) platform for True Group employees, providing unified authentication and authorization across enterprise applications. It supports single sign-on (SSO), digital signature validation, and one-time password (OTP) verification to secure system access, while enabling centralized user provisioning, role-based access control, and audit logging.',
    tech: ['.NET Core', 'C#', 'Blazor', 'Bootstrap', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/true-group-iam.jpg',
    link: 'https://iam.truegroup.com.sg',
  },
  {
    title: 'True Group Events',
    description: 'A free and paid events booking platform for True Group, supporting operations in Singapore and overseas. Integrated with TruePay, it supports multiple ticket types, promotional campaigns, and barcode-based check-ins, delivering a seamless booking and attendance experience for members and guests.',
    tech: ['.NET Core', 'C#', 'Blazor', 'Bootstrap', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/true-group-events.jpg',
    link: 'https://event.truegroup.com.sg',
  },
  {
    title: 'True Group Sentinel',
    description: 'A system rapidly deployed during the COVID-19 pandemic to track all individuals entering facilities. It enables seamless check-in via QR code scanning and provides a real-time dashboard to monitor occupancy within buildings. The system also supports data export for regulatory compliance with Singapore government requirements.',
    tech: ['ASP.NET', 'C#', 'MVC', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design'],
    category: 'backend',
    image: '/MyPortfolio/true-group-sentinel.jpg',
  },
  {
    title: 'TruePay',
    description: 'The core online payment platform for True Group, integrated with RedDot, Braintree, and Stripe to support secure and seamless transactions. Featuring signature validation, request time expiration, and industry-standard encryption, it ensures robust protection against fraud while maintaining the confidentiality and integrity of payment data.',
    tech: ['ASP.NET', 'C#', 'RPC', 'SQL Server', 'Entity Framework', 'LINQ', 'IIS', 'Model Oriented Design', 'Payment Integration'],
    category: 'backend',
    image: '/MyPortfolio/truepay.jpg',
    link: 'https://truepay.com.sg',
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
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
              ${p.links ? `<div class="project-links">${p.links.map(l => `<a href="${l.url}" class="project-link">${l.label} →</a>`).join('')}</div>` : p.link ? `<div class="project-links"><a href="${p.link}" class="project-link">View Project →</a></div>` : ''}
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
    .project-links {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
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
