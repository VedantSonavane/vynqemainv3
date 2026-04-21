function gaEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, {
        ...params,
        session_id: window.__sessionId ?? "unknown",
        timestamp: Date.now(),
      });
    }
  } catch (_) {}
}

function hoverPts(seconds) {
  if (seconds > 15) return 40;
  if (seconds > 8) return 28;
  if (seconds > 4) return 16;
  if (seconds > 2) return 8;
  return 2;
}

function scrollPts(pct) {
  if (pct >= 100) return 40;
  if (pct >= 75) return 32;
  if (pct >= 50) return 24;
  if (pct >= 25) return 16;
  return 8;
}

function readTimePts(seconds) {
  if (seconds > 40) return 30;
  if (seconds > 20) return 22;
  if (seconds > 10) return 14;
  return 8;
}

function pageTimePts(seconds) {
  if (seconds > 120) return 20;
  if (seconds > 60) return 16;
  if (seconds > 30) return 10;
  return 6;
}

const RAW_MAX = 260;
const RAW_MIN = -10;
const RANGE = RAW_MAX - RAW_MIN;

class EngagementTracker {
  constructor() {
    this._raw = 0;
    this._log = [];
    this._applied = new Set();
    this._hoverMap = {};
    this._faqCount = 0;
    this._pageStart = Date.now();
  }

  _add(signalKey, pts, meta = {}) {
    if (this._applied.has(signalKey)) return;
    this._applied.add(signalKey);
    this._raw += pts;
    this._log.push({ signal: signalKey, pts, meta, ts: Date.now() });
  }

  _addRepeat(signalKey, pts, meta = {}) {
    this._raw += pts;
    this._log.push({ signal: signalKey, pts, meta, ts: Date.now() });
  }

  _overwrite(signalKey, newPts, meta = {}) {
    const prev = this._log.find(l => l.signal === signalKey);
    if (prev) {
      const diff = newPts - prev.pts;
      if (diff > 0) {
        this._raw += diff;
        prev.pts = newPts;
        prev.meta = meta;
        prev.ts = Date.now();
      }
    } else {
      this._raw += newPts;
      this._log.push({ signal: signalKey, pts: newPts, meta, ts: Date.now() });
    }
  }

  startCardHover(cardId) {
    const start = Date.now();
    return () => {
      const seconds = (Date.now() - start) / 1000;
      this.recordCardHover(cardId, seconds);
    };
  }

  recordCardHover(cardId, seconds) {
    this._hoverMap[cardId] = (this._hoverMap[cardId] ?? 0) + seconds;
    const pts = hoverPts(seconds);
    this._addRepeat(`hover_${cardId}_${Date.now()}`, pts, { cardId, seconds });
    gaEvent("card_hover", { card_id: cardId, duration_seconds: seconds, pts });
  }

  finalizeHoverTracking() {
    const sorted = Object.entries(this._hoverMap).sort(([, a], [, b]) => b - a);
    const topProductId = sorted[0]?.[0] ?? null;
    const timeSpentSeconds = sorted[0]?.[1] ?? 0;
    const top3Ids = sorted.slice(0, 3).map(([id]) => id);

    if (topProductId) {
      this._add("top_product_bonus", 20, { topProductId });
    }

    if (Object.keys(this._hoverMap).length > 2) {
      this._add("multi_hover_bonus", 15, {});
    }

    return { topProductId, timeSpentSeconds, top3Ids };
  }

  getHoverMap() {
    return { ...this._hoverMap };
  }

  trackFaqOpened(index) {
    this._faqCount++;
    this._addRepeat(`faq_${index}`, 10, {});
  }

  trackFaqReadTime(index, seconds) {
    if (seconds > 8) {
      this._addRepeat(`faq_read_${index}`, 6, {});
    }
  }

  trackP1CardExpanded() {
    this._add("p1_expanded", 18, {});
  }

  trackP1ExpandedReadTime(_, seconds) {
    if (seconds > 6) {
      this._add("p1_read", 12, {});
    }
  }

  trackP2ScrollDepth(cardId, pct) {
    const pts = scrollPts(pct);
    this._overwrite("p2_scroll", pts, { cardId, pct });
  }

  trackP2ReadTime(cardId, seconds) {
    const pts = readTimePts(seconds);
    this._overwrite("p2_read", pts, { cardId, seconds });
  }

  trackP2PlayClicked(cardId) {
    this._add("p2_play", 16, { cardId });
  }

  trackP2PlayProgress(cardId, seconds) {
    if (seconds >= 20) {
      this._add("p2_full", 20, { cardId });
    } else if (seconds >= 8) {
      this._add("p2_partial", 10, { cardId });
    }
  }

  trackP2ImageHover(cardId) {
    this._addRepeat("p2_image_hover", 6, { cardId });
    gaEvent("p2_image_hover", { card_id: cardId });
  }

  trackP2CardSwitched() {
    this._add("p2_switch", 8, {});
  }

  trackSectionScrolledThrough() {
    this._addRepeat("section_scroll", 6, {});
  }

  trackScrolledBackUp() {
    this._add("scroll_back", 8, {});
  }

  trackCtaClicked() {
    this._add("cta", 20, {});
  }

  finalizeTotalPageTime() {
    const seconds = (Date.now() - this._pageStart) / 1000;
    const pts = pageTimePts(seconds);
    this._add("time", pts, { seconds });

    if (seconds > 90) {
      this._add("deep_session_bonus", 20, {});
    }

    return seconds;
  }

  buildModelInput(sessionProfile) {
    const { topProductId, timeSpentSeconds } = this.finalizeHoverTracking();
    const engagementScore = this.getScore();

    return {
      ProductID: topProductId ?? "ec-1",
      TimeSpentSeconds: Math.max(timeSpentSeconds, 45),
      EngagementScore: engagementScore,
      AccountType: sessionProfile.accountType ?? "Customer",
      Industry: sessionProfile.industry ?? "IT",
      DeviceType: sessionProfile.deviceType ?? "Desktop",
    };
  }

  getScore() {
    const clamped = Math.max(RAW_MIN, Math.min(RAW_MAX, this._raw));
    let score = (clamped - RAW_MIN) / RANGE;

    if (score < 0.5) score = 0.5 + score * 0.2;
    if (score > 0.75) score += 0.1;

    return parseFloat(Math.min(score, 0.98).toFixed(2));
  }

  getSnapshot() {
    return {
      score: this.getScore(),
      rawPoints: this._raw,
      topProductId: this.finalizeHoverTracking().topProductId,
      timeSpentSeconds: this.finalizeHoverTracking().timeSpentSeconds,
      top3Ids: this.finalizeHoverTracking().top3Ids,
      hoverMap: this.getHoverMap(),
    };
  }

  reset() {
    this._raw = 0;
    this._log = [];
    this._applied = new Set();
    this._hoverMap = {};
    this._faqCount = 0;
    this._pageStart = Date.now();
  }
}

function detectDevice() {
  if (typeof window === "undefined") return "Desktop";
  const w = window.innerWidth;
  if (w < 768) return "Mobile";
  if (w < 1024) return "Tablet";
  return "Desktop";
}

export const tracker = new EngagementTracker();
export default EngagementTracker;