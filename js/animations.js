/**
 * NexusOS · animations.js
 * Page load entrance animations using IntersectionObserver
 * and staggered CSS class injection for all major components.
 */

'use strict';

/* ── Page Load Overlay ──────────────────────────────────────── */
(function initPageLoadOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'page-load-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  // Remove from DOM after animation completes
  overlay.addEventListener('animationend', () => {
    overlay.remove();
  }, { once: true });
})();

/* ── Staggered Entrance for Major Sections ──────────────────── */
(function initEntranceAnimations() {
  /**
   * Elements to animate on page load with staggered delays.
   * Each entry: selector, animation class, base delay in ms, stagger per item in ms.
   */
  const staggerConfigs = [
    // Sidebar nav items
    { selector: '.nav__item',    animClass: 'slide-in-left', baseDelay: 80,  stagger: 50  },
    // Subheader elements
    { selector: '.subheader__left',  animClass: 'slide-down', baseDelay: 150, stagger: 0 },
    { selector: '.subheader__right', animClass: 'slide-down', baseDelay: 200, stagger: 0 },
    // Metric cards
    { selector: '.metric-card', animClass: 'scale-in', baseDelay: 300, stagger: 60 },
    // Execution cards
    { selector: '.exec-card',   animClass: 'fade-up',  baseDelay: 540, stagger: 80 },
    // Log section
    { selector: '.logs-section', animClass: 'fade-up', baseDelay: 700, stagger: 0 },
  ];

  staggerConfigs.forEach(({ selector, animClass, baseDelay, stagger }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      const delay = baseDelay + index * stagger;

      setTimeout(() => {
        el.style.opacity = '';
        el.classList.add(animClass);
        el.style.setProperty('--delay', `${delay}ms`);

        // Clean up class after animation
        el.addEventListener('animationend', () => {
          el.classList.remove(animClass);
          el.style.removeProperty('--delay');
        }, { once: true });
      }, 10); // Small buffer to ensure initial opacity:0 applies
    });
  });
})();

/* ── IntersectionObserver for Scroll Reveals ────────────────── */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealTargets = document.querySelectorAll(
    '.channel-item, .workflow-item, .logs-table__row'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('fade-up');
        }, { once: true });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  });

  revealTargets.forEach((el) => observer.observe(el));
})();

/* ── Sidebar Brand Logo Hover Animation ─────────────────────── */
(function initBrandAnimation() {
  const logoMark = document.querySelector('.brand__logo-mark');
  if (!logoMark) return;

  logoMark.addEventListener('mouseenter', () => {
    logoMark.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    logoMark.style.transform = 'rotate(10deg) scale(1.1)';
  });

  logoMark.addEventListener('mouseleave', () => {
    logoMark.style.transform = '';
  });
})();

console.info('[NexusOS] Animations module initialized ✓');
