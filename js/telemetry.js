/**
 * NexusOS · telemetry.js
 * Live telemetry simulation: sync rate counter, animated metric
 * value ticks, live log stream injection, and clock-driven updates.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════════════════════ */

const STATE = {
  syncRate: 4850,
  streamPaused: false,
  logCount: 6,
  totalEvents: 4850,
};

/* ═══════════════════════════════════════════════════════════════
   SYNC RATE LIVE COUNTER
   Fluctuates ±50–180 actions/min to simulate real-time activity
   ═══════════════════════════════════════════════════════════════ */

(function initSyncRateCounter() {
  const valueEl = document.getElementById('sync-rate-value');
  if (!valueEl) return;

  function formatRate(n) {
    return n.toLocaleString('en-IN') + ' actions / min';
  }

  function fluctuate() {
    if (window.NexusOS?.streamPaused) return;

    const delta = Math.floor(Math.random() * 180) - 70; // -70 to +110
    STATE.syncRate = Math.max(4200, Math.min(5600, STATE.syncRate + delta));

    const prev = valueEl.textContent;
    const next = formatRate(STATE.syncRate);

    if (prev !== next) {
      valueEl.textContent = next;
      valueEl.classList.remove('value-flash');
      // Reflow trick to restart animation
      void valueEl.offsetWidth;
      valueEl.classList.add('value-flash');
    }
  }

  // Initial set
  valueEl.textContent = formatRate(STATE.syncRate);

  // Update every 2.8 seconds
  setInterval(fluctuate, 2800);
})();

/* ═══════════════════════════════════════════════════════════════
   METRIC CARD VALUE ANIMATIONS (count-up on load)
   ═══════════════════════════════════════════════════════════════ */

(function initCountUpAnimations() {
  /**
   * Animates a numeric element from 0 to its target value.
   * @param {HTMLElement} el - The element to animate
   * @param {number} target - The target value to count up to
   * @param {number} duration - Animation duration in ms
   * @param {string} suffix - Optional suffix (e.g. '%', ' hrs', ' orders')
   * @param {number} decimals - Number of decimal places
   */
  function countUp(el, target, duration, suffix = '', decimals = 0) {
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = easedProgress * target;

      el.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Wait for page entrance animations to settle
  setTimeout(() => {
    const metricActions = document.getElementById('metric-actions');
    if (metricActions) countUp(metricActions, 47, 1200, '', 0);

    // Hours saved value (nested unit span — handle separately)
    const hoursCard = document.querySelector('.metric-card--hours .metric-card__value');
    if (hoursCard) {
      const unitSpan = hoursCard.querySelector('.metric-card__unit');
      const unitHtml = unitSpan ? unitSpan.outerHTML : '';

      let frame;
      const start = performance.now();
      const duration = 1400;
      const target = 42.8;

      function animHours(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = (eased * target).toFixed(1);
        hoursCard.innerHTML = val + unitHtml;
        if (progress < 1) requestAnimationFrame(animHours);
        else hoursCard.innerHTML = '42.8' + unitHtml;
      }
      requestAnimationFrame(animHours);
    }

    // Sync success (99.98%)
    const syncCard = document.querySelector('.metric-card--sync .metric-card__value');
    if (syncCard) {
      const unitSpan = syncCard.querySelector('.metric-card__unit');
      const unitHtml = unitSpan ? unitSpan.outerHTML : '';

      let start2 = performance.now();
      const dur2 = 1600;

      function animSync(now) {
        const progress = Math.min((now - start2) / dur2, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = (97 + eased * 2.98).toFixed(2);
        syncCard.innerHTML = val + unitHtml;
        if (progress < 1) requestAnimationFrame(animSync);
        else syncCard.innerHTML = '99.98' + unitHtml;
      }
      requestAnimationFrame(animSync);
    }

    // Prevented RTOs (184 orders)
    const rtoCard = document.querySelector('.metric-card--rto .metric-card__value');
    if (rtoCard) {
      const unitSpan = rtoCard.querySelector('.metric-card__unit');
      const unitHtml = unitSpan ? unitSpan.outerHTML : '';

      let start3 = performance.now();
      const dur3 = 1300;

      function animRTO(now) {
        const progress = Math.min((now - start3) / dur3, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(eased * 184);
        rtoCard.innerHTML = val + unitHtml;
        if (progress < 1) requestAnimationFrame(animRTO);
        else rtoCard.innerHTML = '184' + unitHtml;
      }
      requestAnimationFrame(animRTO);
    }
  }, 500);
})();

/* ═══════════════════════════════════════════════════════════════
   LIVE LOG STREAM INJECTION
   Periodically prepends a new log row to simulate real activity
   ═══════════════════════════════════════════════════════════════ */

const LOG_TEMPLATES = [
  {
    scope: 'OMNICHANNEL_SYNC',
    scopeClass: 'scope-badge--sync',
    worker: 'worker-node-04a',
    status: 'success',
    getMessage: (ts) =>
      `Polled Amazon India SP-API. Received <strong>7</strong> shipment status events. AWB mapping updated at <span class="log-highlight">${ts}</span>.`,
  },
  {
    scope: 'INVENTORY_REBALANCE',
    scopeClass: 'scope-badge--inventory',
    worker: 'worker-node-03d',
    status: 'success',
    getMessage: () =>
      `Buffer pool recalculation complete. SKU <span class="log-highlight">NX-SKU-${Math.floor(Math.random()*9000+1000)}</span> rebalanced across <strong>3</strong> warehouse nodes.`,
  },
  {
    scope: 'COURIER_ALLOCATION',
    scopeClass: 'scope-badge--courier',
    worker: 'worker-node-01c',
    status: 'success',
    getMessage: () =>
      `Auto-routed order to <strong>Shiprocket</strong>. Zone B weight <span class="log-mono">${(Math.random()*3+0.5).toFixed(2)} kg</span> matched regional rate matrix.`,
  },
  {
    scope: 'COD_VERIFICATION',
    scopeClass: 'scope-badge--cod',
    worker: 'worker-node-02b',
    status: 'pending',
    getMessage: () =>
      `WhatsApp RTO-prevention prompt dispatched to <span class="log-highlight">+91 97XXX-XXXXX</span> for <span class="log-highlight">#FK-${Math.floor(Math.random()*90000+10000)}</span>. Lifecycle timer: 12h.`,
  },
  {
    scope: 'REPLENISHMENT_DRAFT',
    scopeClass: 'scope-badge--reorder',
    worker: 'worker-node-05b',
    status: 'pending',
    getMessage: () =>
      `Velocity breach on SKU <span class="log-highlight">NX-SKU-${Math.floor(Math.random()*9000+1000)}</span>. PO draft auto-generated. Qty: <span class="log-mono">${Math.floor(Math.random()*800+200)} units</span>. Pending approval.`,
  },
];

function getNowTimestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

function buildStatusCell(status) {
  if (status === 'success') {
    return `
      <span class="log-status log-status--success" aria-label="Status: Success">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5L4 7L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        SUCCESS
      </span>`;
  }
  if (status === 'pending') {
    return `
      <span class="log-status log-status--pending" aria-label="Status: Pending">
        <span class="pending-spinner" aria-hidden="true"></span>
        PENDING
      </span>`;
  }
  return `<span class="log-status log-status--error">ERROR</span>`;
}

(function initLogStream() {
  const tbody = document.getElementById('log-table-body');
  const logCountEl = document.getElementById('log-count');
  if (!tbody) return;

  const MAX_VISIBLE_ROWS = 10;

  function injectLogRow() {
    if (window.NexusOS?.streamPaused) return;

    const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
    const ts = getNowTimestamp();

    const row = document.createElement('tr');
    row.className = `logs-table__row logs-table__row--${template.status}`;
    row.style.setProperty('--delay', '0ms');

    row.innerHTML = `
      <td class="logs-table__td logs-table__td--timestamp">
        <time datetime="${new Date().toISOString()}" class="timestamp">${ts}</time>
      </td>
      <td class="logs-table__td logs-table__td--scope">
        <span class="scope-badge ${template.scopeClass}">${template.scope}</span>
      </td>
      <td class="logs-table__td logs-table__td--worker">
        <span class="worker-node">${template.worker}</span>
      </td>
      <td class="logs-table__td logs-table__td--context">
        <p class="log-context">${template.getMessage(ts)}</p>
      </td>
      <td class="logs-table__td logs-table__td--status">
        ${buildStatusCell(template.status)}
      </td>
    `;

    // Add entrance animation
    row.classList.add('log-entry-animate');

    // Insert at the top of the tbody
    tbody.insertBefore(row, tbody.firstChild);

    // Update state and counter
    STATE.logCount++;
    STATE.totalEvents++;

    if (logCountEl) {
      logCountEl.innerHTML = `Showing <strong>${Math.min(STATE.logCount, MAX_VISIBLE_ROWS)}</strong> of <strong>${STATE.totalEvents.toLocaleString('en-IN')}</strong> active trace events`;
    }

    // Prune rows exceeding maximum
    const allRows = tbody.querySelectorAll('.logs-table__row');
    if (allRows.length > MAX_VISIBLE_ROWS) {
      const lastRow = allRows[allRows.length - 1];
      lastRow.style.transition = 'opacity 0.3s ease';
      lastRow.style.opacity = '0';
      setTimeout(() => lastRow.remove(), 300);
    }
  }

  // Inject a new row every 5–9 seconds
  function scheduleNextLog() {
    const delay = 5000 + Math.random() * 4000;
    setTimeout(() => {
      injectLogRow();
      scheduleNextLog();
    }, delay);
  }

  // Start after initial animations settle
  setTimeout(scheduleNextLog, 3500);
})();

/* ═══════════════════════════════════════════════════════════════
   TIMESTAMP CLOCK ON SUBHEADER (live local time display)
   ═══════════════════════════════════════════════════════════════ */

(function initSubheaderClock() {
  // Append a subtle live clock to the subheader right side
  const subheaderRight = document.querySelector('.subheader__right');
  if (!subheaderRight) return;

  const clockEl = document.createElement('div');
  clockEl.className = 'subheader__clock';
  clockEl.setAttribute('aria-label', 'Current local time');
  clockEl.setAttribute('role', 'timer');

  // Inline styles for the clock (keeps modular CSS clean)
  Object.assign(clockEl.style, {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--color-text-tertiary)',
    letterSpacing: '0.04em',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    whiteSpace: 'nowrap',
  });

  subheaderRight.insertBefore(clockEl, subheaderRight.firstChild);

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s} IST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

/* ═══════════════════════════════════════════════════════════════
   STATUS DOT SLOW HEARTBEAT
   Adds a subtle heartbeat effect to the status dot every 10s
   ═══════════════════════════════════════════════════════════════ */

(function initStatusHeartbeat() {
  const statusBadge = document.querySelector('.subheader__status-badge');
  if (!statusBadge) return;

  setInterval(() => {
    statusBadge.style.transform = 'scale(1.02)';
    setTimeout(() => {
      statusBadge.style.transform = '';
    }, 200);
  }, 10000);
})();

console.info('[NexusOS] Telemetry module initialized ✓');
