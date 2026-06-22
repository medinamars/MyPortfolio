const VERSION = '11';

export function createContactSection() {
  const section = document.getElementById('contact');
  section.innerHTML = `
    <div class="container" style="text-align:center">
      <h2 class="section-title">Get In Touch</h2>
      <p class="section-subtitle">Let's connect and build something great together</p>
      <div class="contact-links">
        <a href="https://github.com/medinamars" class="contact-card" target="_blank" rel="noopener">
          <span class="contact-icon">🐙</span>
          <span class="contact-label">GitHub</span>
          <span class="contact-value">@medinamars</span>
        </a>
        <a href="https://www.linkedin.com/in/marcelo-medina-52239668" class="contact-card" target="_blank" rel="noopener">
          <span class="contact-icon">💼</span>
          <span class="contact-label">LinkedIn</span>
          <span class="contact-value">Connect</span>
        </a>
        <a href="https://www.facebook.com/medinamars" class="contact-card" target="_blank" rel="noopener">
          <span class="contact-icon">👤</span>
          <span class="contact-label">Facebook</span>
          <span class="contact-value">@medinamars</span>
        </a>
        <a href="https://x.com/medinamars918" class="contact-card" target="_blank" rel="noopener">
          <span class="contact-icon">✖️</span>
          <span class="contact-label">X</span>
          <span class="contact-value">@medinamars918</span>
        </a>
        <a href="https://www.instagram.com/medina_mars" class="contact-card" target="_blank" rel="noopener">
          <span class="contact-icon">📸</span>
          <span class="contact-label">Instagram</span>
          <span class="contact-value">@medina_mars</span>
        </a>
        <a href="mailto:medinamars@gmail.com" class="contact-card">
          <span class="contact-icon">📧</span>
          <span class="contact-label">Email</span>
          <span class="contact-value">medinamars@gmail.com</span>
        </a>
        <a href="tel:+16474730918" class="contact-card">
          <span class="contact-icon">📱</span>
          <span class="contact-label">Phone</span>
          <span class="contact-value">647 473 0918</span>
        </a>
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
    .contact-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .contact-card {
      background: var(--color-dark);
      border: 1px solid var(--color-crater);
      padding: 2rem;
      border-radius: 8px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    .contact-card:hover {
      border-color: var(--color-terracotta);
      transform: translateY(-4px);
    }
    .contact-icon { font-size: 2rem; }
    .contact-label {
      font-family: var(--font-heading);
      color: var(--color-atmosphere);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
    }
    .contact-value { color: var(--color-star-dim); font-size: 0.9rem; }
  `;
  section.appendChild(style);

  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <p>© ${new Date().getFullYear()} Mars Medina. Built with 🪐 on Mars. Version ${VERSION}</p>
      <p class="footer-tech">Three.js • Vite • Vanilla JS</p>
    </div>
  `;
  const footerStyle = document.createElement('style');
  footerStyle.textContent = `
    footer {
      position: relative;
      z-index: var(--z-content);
      text-align: center;
      padding: 2rem;
      border-top: 1px solid var(--color-crater);
      background: rgba(11, 13, 23, 0.9);
    }
    footer p { color: var(--color-dust); font-size: 0.85rem; }
    .footer-tech { font-family: var(--font-mono); font-size: 0.75rem; }
  `;
  footer.appendChild(footerStyle);
}
