export {};

(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  const BACKEND = 'http://localhost:3251'; // change to your deployed URL
  const RECONNECT_DELAY = 3000;
  const MAX_RECONNECTS = 10;

  // ── Get API key + session id ──────────────────────────────────────────────
  function getKey() {
    if (window.TF_NUDGE_KEY) return window.TF_NUDGE_KEY;
    const tag = document.querySelector('script[src*="track.js"]');
    if (tag) {
      try { return new URL(tag.src).searchParams.get('k'); } catch {}
    }
    return null;
  }

  function getSid() {
    return sessionStorage.getItem('tf_sid');
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const STYLES = `
    .tf-nudge-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      z-index: 99999;
      background: #0f172a;
      color: #f8fafc;
      padding: 14px 20px;
      border-radius: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.5;
      max-width: min(420px, calc(100vw - 32px));
      box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: auto;
    }
    .tf-nudge-banner.tf-show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .tf-nudge-banner.tf-high { background: #1e293b; border-left: 3px solid #f59e0b; }
    .tf-nudge-banner.tf-medium { background: #1e293b; border-left: 3px solid #3b82f6; }
    .tf-nudge-banner.tf-low { background: #1e293b; border-left: 3px solid #10b981; }
    .tf-nudge-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
    .tf-nudge-text { flex: 1; }
    .tf-nudge-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 0;
      flex-shrink: 0;
      transition: color 0.15s;
    }
    .tf-nudge-close:hover { color: #f8fafc; }
    /* Demo badge — shows in demo mode */
    .tf-demo-badge {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 99999;
      background: #0f172a;
      color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tf-demo-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: tf-pulse 2s infinite;
    }
    @keyframes tf-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;

  // ── Inject styles ─────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('tf-nudge-styles')) return;
    const s = document.createElement('style');
    s.id = 'tf-nudge-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  // ── Demo badge ────────────────────────────────────────────────────────────
  function showDemoBadge() {
    if (document.getElementById('tf-demo-badge')) return;
    const badge = document.createElement('div');
    badge.id = 'tf-demo-badge';
    badge.className = 'tf-demo-badge';
    badge.innerHTML = '<div class="tf-demo-dot"></div>TrackFlow Live';
    document.body.appendChild(badge);
  }

  // ── Nudge renderer ────────────────────────────────────────────────────────
  let currentNudge = null;
  let autoDismissTimer = null;

  const ICONS = { high: '⚡', medium: '💡', low: '✨' };

  function showNudge(payload) {
    if (!payload.message) return;
    if (Date.now() > payload.expires_ts) return; // stale

    // Remove existing
    dismissNudge(false);

    const el = document.createElement('div');
    el.id = 'tf-nudge';
    el.className = `tf-nudge-banner tf-${payload.priority || 'medium'}`;
    el.innerHTML = `
      <span class="tf-nudge-icon">${ICONS[payload.priority] || '💡'}</span>
      <span class="tf-nudge-text">${escHtml(payload.message)}</span>
      <button class="tf-nudge-close" aria-label="Dismiss">✕</button>
    `;

    el.querySelector('.tf-nudge-close').addEventListener('click', () => {
      dismissNudge(true, payload.nudge_id);
    });

    document.body.appendChild(el);
    currentNudge = { el, payload };

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('tf-show'));
    });

    // Auto dismiss after 8s
    autoDismissTimer = setTimeout(() => dismissNudge(true, payload.nudge_id), 8000);

    console.log('[TF NUDGE] shown:', payload.template_id, payload.message);
  }

  function dismissNudge(logOutcome = true, nudgeId = null) {
    clearTimeout(autoDismissTimer);
    if (currentNudge) {
      const { el } = currentNudge;
      el.classList.remove('tf-show');
      setTimeout(() => el.remove(), 300);
      currentNudge = null;
    }
    if (logOutcome && nudgeId) reportOutcome(nudgeId, 'dismissed');
  }

  function reportOutcome(nudgeId, result) {
    try {
      navigator.sendBeacon(
        `${BACKEND}/nudge-outcome`,
        JSON.stringify({ nudge_id: nudgeId, result, ts: Date.now() })
      );
    } catch {}
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── SSE connection ────────────────────────────────────────────────────────
  let reconnectCount = 0;
  let reconnectTimer = null;

  function connect() {
    const key = getKey();
    const sid = getSid();
    if (!key || !sid) {
      // retry after SDK sets sid
      setTimeout(connect, 1000);
      return;
    }

    const url = `${BACKEND}/nudge-stream?k=${encodeURIComponent(key)}&sid=${encodeURIComponent(sid)}`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      try {
        if (!e.data || e.data.startsWith(':')) return;
        const payload = JSON.parse(e.data);
        console.log('[TF NUDGE] received:', payload);
        if (payload.nudge_id) showNudge(payload);
      } catch(err) {
        console.log('[TF NUDGE] parse error:', err.message, '| raw:', e.data);
      }
    };

    es.onerror = () => {
      es.close();
      if (reconnectCount < MAX_RECONNECTS) {
        reconnectCount++;
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY * Math.min(reconnectCount, 4));
      }
    };

    es.onopen = () => {
      reconnectCount = 0;
      console.log('[TF NUDGE] SSE connected, session:', sid);
    };
  }

  // ── Outcome: report when user acts after nudge ────────────────────────────
  document.addEventListener('click', () => {
    if (currentNudge) {
      const { payload } = currentNudge;
      dismissNudge(false);
      reportOutcome(payload.nudge_id, 'acted');
    }
  }, true);

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    showDemoBadge();
    connect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();