import './css/variables.css';
import './css/layout.css';
import './css/animations.css';
import './css/nav.css';

import { createNav } from './components/Nav.js';
import { createHomeSection } from './components/HomeSection.js';
import { createAboutSection } from './components/AboutSection.js';
import { createProjectsSection } from './components/ProjectsSection.js';
import { createExperienceSection } from './components/ExperienceSection.js';
import { createResumeSection } from './components/ResumeSection.js';
import { createContactSection } from './components/ContactSection.js';
import { MarsScene } from './three/Scene.js';
import { ScrollObserver } from './utils/ScrollObserver.js';

document.addEventListener('DOMContentLoaded', () => {
  createNav();
  createHomeSection();
  createAboutSection();
  createProjectsSection();
  createExperienceSection();
  createResumeSection();
  createContactSection();

  const marsScene = new MarsScene('mars-canvas');
  new ScrollObserver(marsScene);
});
