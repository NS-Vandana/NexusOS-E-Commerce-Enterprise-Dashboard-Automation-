/**
 * NexusOS · interactions.js
 * UI interactions: sidebar nav, toggle switches, log controls,
 * keyboard navigation, button feedback, and toast notifications.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

(function initSidebarNav() {
  const navLinks = document.querySelectorAll('.nav__link');
  const navItems = document.querySelectorAll('.nav__item');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active from all
      navItems.forEach((item) => item.classList.remove('nav__item--active'));
      navLinks.forEach((l) => {
        l.removeAttribute('aria-current');
      });

      // Activate clicked
      const parentItem = link.closest('.nav__item');
      if (parentItem) {
        parentItem.classList.add('nav__item--active');
        link.setAttribute('aria-current', 'page');
      }

      // Ripple effect on click
      createRipple(link, e);
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   TOGGLE SWITCHES
   ═══════════════════════════════════════════════════════════════ */

(function initToggleSwitches() {
  const toggleInputs = document.querySelectorAll('.toggle-switch__input');

  toggleInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const engineTitle = input
        .closest('.workflow-item')
        ?.querySelector('.workflow-item__title')?.textContent?.trim();

      const isChecked = input.checked;
      input.setAttribute('aria-checked', String(isChecked));

      // Update status dot
      const statusDot = input
        .closest('.workflow-item')
        ?.querySelector('.workflow-item__status-dot');

      if (statusDot) {
        if (isChecked) {
          statusDot.classList.add('workflow-item__status-dot--active');
          statusDot.classList.remove('workflow-item__status-dot--inactive');
        } else {
          statusDot.classList.remove('workflow-item__status-dot--active');
          statusDot.classList.add('workflow-item__status-dot--inactive');
        }
      }

      // Show toast notification
      const action = isChecked ? 'activated' : 'paused';
      const shortTitle = engineTitle
        ? engineTitle.split(' ').slice(0, 3).join(' ') + '…'
        : 'Engine';

      showToast(
        isChecked
          ? `✓ ${shortTitle} ${action}`
          : `⏸ ${shortTitle} ${action}`,
        isChecked ? 'success' : 'warning'
      );
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   LOG TABLE CONTROLS
   ═══════════════════════════════════════════════════════════════ */

(function initLogControls() {
  /* ── Pause / Resume Stream ──────────────────────────────────── */
  const pauseBtn = document.getElementById('pause-stream-btn');
  let isPaused = false;

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;

      if (isPaused) {
        pauseBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 2L10 6L3 10V2Z" fill="currentColor"/>
          </svg>
          Resume Stream
        `;
        pauseBtn.style.color = 'var(--amber-400)';
        pauseBtn.style.borderColor = 'rgba(251,191,36,0.3)';
        pauseBtn.style.background = 'rgba(251,191,36,0.08)';
        showToast('⏸ Log stream paused', 'warning');
        // Notify telemetry module
        window.NexusOS = window.NexusOS || {};
        window.NexusOS.streamPaused = true;
      } else {
        pauseBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="3" height="8" rx="0.8" fill="currentColor"/>
            <rect x="7" y="2" width="3" height="8" rx="0.8" fill="currentColor"/>
          </svg>
          Pause Stream
        `;
        pauseBtn.style.color = '';
        pauseBtn.style.borderColor = '';
        pauseBtn.style.background = '';
        showToast('▶ Log stream resumed', 'success');
        window.NexusOS = window.NexusOS || {};
        window.NexusOS.streamPaused = false;
      }
    });
  }

  /* ── Export Logs ────────────────────────────────────────────── */
  const exportBtn = document.getElementById('export-logs-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportBtn.disabled = true;
      exportBtn.textContent = 'Exporting…';

      // Simulate export delay
      setTimeout(() => {
        exportLogsAsCSV();
        exportBtn.disabled = false;
        exportBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1V8M6 8L3.5 5.5M6 8L8.5 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 10H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          Export Logs
        `;
        showToast('✓ Log export complete (nexusos-trace.csv)', 'success');
      }, 900);
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════
   CSV EXPORT
   ═══════════════════════════════════════════════════════════════ */

function exportLogsAsCSV() {
  const headers = ['Timestamp', 'Automation Scope', 'Worker Node', 'Log Context', 'Status'];
  const rows = [];

  document.querySelectorAll('.logs-table__row').forEach((row) => {
    const cells = row.querySelectorAll('.logs-table__td');
    if (cells.length < 5) return;

    rows.push([
      cells[0]?.textContent?.trim() || '',
      cells[1]?.textContent?.trim() || '',
      cells[2]?.textContent?.trim() || '',
      cells[3]?.textContent?.trim()?.replace(/\n\s+/g, ' ') || '',
      cells[4]?.textContent?.trim() || '',
    ].map((v) => `"${v.replace(/"/g, '""')}"`).join(','));
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nexusos-trace-${new Date().toISOString().slice(0,10)}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE MENU BUTTON
   ═══════════════════════════════════════════════════════════════ */

(function initProfileMenu() {
  const menuBtn = document.querySelector('.profile__menu-btn');
  if (!menuBtn) return;

  menuBtn.addEventListener('click', () => {
    showToast('Profile menu coming soon', 'info');
  });
})();

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

(function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Arrow key navigation for nav items
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const activeLink = document.querySelector('.nav__link[aria-current="page"]');
      if (!activeLink) return;

      const navLinks = [...document.querySelectorAll('.nav__link')];
      const currentIndex = navLinks.indexOf(activeLink);

      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, navLinks.length - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex !== currentIndex) {
        navLinks[nextIndex].click();
        navLinks[nextIndex].focus();
      }
      e.preventDefault();
    }

    // Escape to close any open UI
    if (e.key === 'Escape') {
      const toasts = document.querySelectorAll('.toast');
      toasts.forEach((t) => {
        t.classList.add('toast--exit');
        t.addEventListener('animationend', () => t.remove(), { once: true });
      });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   RIPPLE EFFECT UTILITY
   ═══════════════════════════════════════════════════════════════ */

function createRipple(element, event) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  Object.assign(ripple.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}px`,
    top: `${y}px`,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '50%',
    transform: 'scale(0)',
    animation: 'ripple-expand 0.5s ease-out forwards',
    pointerEvents: 'none',
    zIndex: '0',
  });

  // Ensure element is positioned for absolute child
  const prevPosition = getComputedStyle(element).position;
  if (prevPosition === 'static') element.style.position = 'relative';
  element.style.overflow = 'hidden';

  element.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
    if (prevPosition === 'static') element.style.position = '';
  }, { once: true });
}

// Inject ripple keyframe if not already in CSS
(function injectRippleKeyframe() {
  if (document.querySelector('#ripple-style')) return;
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes ripple-expand {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
   ═══════════════════════════════════════════════════════════════ */

const TOAST_COLORS = {
  success: { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', color: 'var(--emerald-400)' },
  warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)',  color: 'var(--amber-400)'  },
  error:   { bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.2)',   color: 'var(--rose-400)'    },
  info:    { bg: 'rgba(79,70,229,0.1)',   border: 'rgba(79,70,229,0.2)',   color: 'var(--indigo-400)'  },
};

let toastQueue = [];
let toastY = 0;

function showToast(message, type = 'info', duration = 3000) {
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    background: colors.bg,
    borderColor: colors.border,
    color: colors.color,
    bottom: `${24 + toastQueue.length * 52}px`,
    fontFamily: 'var(--font-sans)',
    fontSize: '12.5px',
    fontWeight: '500',
  });

  document.body.appendChild(toast);
  toastQueue.push(toast);

  setTimeout(() => {
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
      toastQueue = toastQueue.filter((t) => t !== toast);
      // Re-stack remaining toasts
      toastQueue.forEach((t, i) => {
        t.style.bottom = `${24 + i * 52}px`;
      });
    }, { once: true });
  }, duration);
}

// Expose globally for telemetry.js
window.NexusOS = window.NexusOS || {};
window.NexusOS.showToast = showToast;

console.info('[NexusOS] Interactions module initialized ✓');
