const techStack = [
  { category: 'Languages & Frameworks', skills: ['.NET', 'C#', 'ASP.NET Core', 'ASP.NET Boilerplate', 'Blazor', 'Flutter/Dart', 'PHP', 'JavaScript', 'TypeScript', 'VB', 'VB6'] },
  { category: 'Databases & ORM', skills: ['SQL Server', 'PostgreSQL', 'MySQL', 'Oracle', 'T-SQL', 'Entity Framework', 'Dapper'] },
  { category: 'Cloud & DevOps', skills: ['Azure Functions', 'Azure Blob Storage', 'Azure Application Insights', 'Azure DevOps', 'Azure Key Vault', 'IIS', 'Apache', 'Git', 'Hangfire', 'Docker'] },
  { category: 'Web & Mobile', skills: ['HTML5', 'CSS3', 'Bootstrap', 'SPA', 'RESTful APIs', 'RPC', 'SignalR', 'Firebase', 'iOS and Android App Development', 'App Store Connect', 'Google Play Console', 'Payment Integrations (Braintree, Stripe, PayPal, RedDot ...)'] },
  { category: 'Architecture & QA', skills: ['SOLID', 'OOP', 'TDD', 'SaaS', 'xUnit', 'NUnit', 'Agile', 'Scrum'] },
  { category: 'AI & ML', skills: ['Claude', 'LM Studio', 'Llama.cpp', 'Opus', 'Qwen', 'Gemma', 'Gemini', 'Copilot', 'OpenClaw', 'Hermes', 'Microsoft ML'] },
  { category: 'Dev & Design Tools', skills: ['Visual Studio', 'VS Code', 'Android Studio', 'Xcode', 'Postman', 'Swagger', 'JIRA', 'GitHub', 'Photoshop'] },
];

export function createAboutSection() {
  const section = document.getElementById('about');
  section.innerHTML = `
    <div class="container">
      <div class="about-content">
          <h2 class="section-title">About Me</h2>
          <p class="about-bio">
            Full-stack developer with 17 years of experience building mission-critical
            online and mobile systems. My analytical thinking and solutions have led to
            significant time and financial savings for the companies I've worked with.
          </p>
          <p class="about-bio">
            Proven track record handling projects solo, as a team lead, or as a collaborative
            team member. The systems I've created continue to be used today — from complex
            enterprise platforms processing hundreds of millions in annual transactions
            to cloud-native solutions designed for scalability and performance.
          </p>
          <h2 class="section-title">Experience</h2>
          <div class="experience-item">
            <div class="experience-header">
              <h3 class="experience-role">Freelance System Developer</h3>
              <span class="experience-date">Sep 2009 - May 2011</span>
            </div>
            <p class="experience-company">Self Employed, Philippines</p>
            <p class="experience-desc">I independently handled the full lifecycle of complex technical client projects, including pre-sales, planning, execution, and delivery. I was also hands-on in both back-end and front-end development, as well as ongoing support and maintenance of deployed products and solutions, ensuring stability and long-term success.</p>
          </div>
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
  `;

  const style = document.createElement('style');
  style.textContent = `
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
    .section-title {
      font-family: var(--font-heading);
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-atmosphere);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .experience-item {
      margin-bottom: 2rem;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .experience-role {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-atmosphere);
      margin: 0;
    }
    .experience-date {
      font-size: 0.9rem;
      color: var(--color-terracotta);
      font-family: var(--font-mono);
      white-space: nowrap;
    }
    .experience-company {
      font-size: 1rem;
      color: var(--color-sandy);
      margin: 0 0 0.5rem;
      font-style: italic;
    }
    .experience-desc {
      color: var(--color-star-dim);
      line-height: 1.8;
      margin: 0;
    }
  `;
  section.appendChild(style);
}
