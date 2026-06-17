const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

export function createNav() {
  const nav = document.getElementById('main-nav');
  const navEl = document.createElement('nav');
  navEl.className = 'main-nav';
  navEl.innerHTML = `
    <div class="nav-inner">
      <a href="#home" class="nav-logo">MARS</a>
      <ul class="nav-links">
        ${navLinks.map(link => `
          <li><a href="#${link.id}" data-section="${link.id}">${link.label}</a></li>
        `).join('')}
      </ul>
      <button class="nav-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  nav.appendChild(navEl);

  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = document.querySelector(`[data-section="${entry.target.id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.5 });
  sections.forEach(s => observer.observe(s));

  const toggle = navEl.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    navEl.classList.toggle('mobile-open');
  });
}
