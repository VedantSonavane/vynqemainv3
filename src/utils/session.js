/**
 * session.js
 * ─────────────────────────────────────────────────────────────
 * Central session state for the entire demo journey.
 * 
 * USER ID (Primary ID):
 *   • UUID format: "u_<timestamp>_<random>" (e.g., u_1774891521_x7k9)
 *   • Created ONCE on first BookDemo form submission
 *   • Stored in localStorage (vynqe_user_id)
 *   • Persists across ALL future visits
 *   • Passed via URL param (?uid=xxx) when navigating BookDemo → Demo
 * 
 * SESSION ID (Interaction ID):
 *   • Format: "s_<timestamp>_<random>" (e.g., s_1774891521529_a3f9)
 *   • Created ONLY when model response is received
 *   • One user_id → Many session_ids
 *   • Each session represents one complete demo interaction
 * 
 * SESSION CREATION FLOW:
 *   1. User submits BookDemo form → user_id created, stored, passed via URL
 *   2. Demo.jsx reads user_id from URL/localStorage
 *   3. User interacts with demo (hover, scroll, etc.)
 *   4. Model API called → setPrediction() creates session_id
 *   5. logSession() fires immediately with complete data
 * 
 * DATA INTEGRITY RULES:
 *   • NEVER create session without user_id
 *   • NEVER log data without session_id
 *   • Session created BEFORE logging
 *   • Phone updates go to SAME session row
 * ─────────────────────────────────────────────────────────────
 */

import { tracker } from "./engagementTracker";

// ─── Constants ───────────────────────────────────────────────
const USER_ID_KEY = "vynqe_user_id";
const SESSION_ID_KEY = "vynqe_session_id";
function gaEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, {
        ...params,
        session_id: window.__sessionId ?? "unknown",
        timestamp:  Date.now(),
      });
    }
  } catch (_) {}
}

// ─── UUID Generator for User ID ──────────────────────────────
function generateUserId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `u_${ts}_${rand}`;
}

// ─── Session ID Generator ──────────────────────────────────
function generateSessionId() {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 6);
  return `s_${ts}_${rand}`;
}

// ─── Detect device ───────────────────────────────────────────
function detectDevice() {
  if (typeof window === "undefined") return "Desktop";
  const w = window.innerWidth;
  if (w < 768)  return "Mobile";
  if (w < 1024) return "Tablet";
  return "Desktop";
}

// ─── Load persisted userId ───────────────────────────────────
export function getStoredUserId() {
  try {
    return localStorage.getItem(USER_ID_KEY) || null;
  } catch {
    return null;
  }
}

// ─── Store userId ────────────────────────────────────────────
export function storeUserId(userId) {
  try {
    localStorage.setItem(USER_ID_KEY, userId);
  } catch {}
}

// ─── Get or Create User ID ───────────────────────────────────
export function getOrCreateUserId() {
  let userId = getStoredUserId();
  if (!userId) {
    userId = generateUserId();
    storeUserId(userId);
    gaEvent("user_id_created", { user_id: userId });
  }
  return userId;
}

// ─── Load persisted sessionId ────────────────────────────────
function getStoredSessionId() {
  try {
    return localStorage.getItem(SESSION_ID_KEY) || null;
  } catch {
    return null;
  }
}

// ─── Store sessionId ─────────────────────────────────────────
function storeSessionId(sessionId) {
  try {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    if (typeof window !== "undefined") {
      window.__sessionId = sessionId;
    }
  } catch {}
}

// ─── Clear sessionId (called on reset) ───────────────────────
function clearStoredSessionId() {
  try {
    localStorage.removeItem(SESSION_ID_KEY);
    if (typeof window !== "undefined") {
      window.__sessionId = null;
    }
  } catch {}
}

// ─── Empty session shape (NO sessionId, NO startedAt) ────────
function emptySession() {
  return {
    // ── Identity (userId loaded from storage, sessionId null until model response) ──
    userId: getStoredUserId() || null,
    sessionId: null,
    startedAt: null,
    journeyNumber: getJourneyHistory().length + 1,

    // ── From BookDemo form (optional) ─────
    fullName:  "",
    email:     "",
    phone:     "",
    jobTitle:  "",
    company:   "",
    message:   "",

    // ── From DemoModal ────────────────────
    name:        "",
    accountType: "",
    industry:    "",
    deviceType:  detectDevice(),

    // ── From StepsSection hover tracking ──
    hoverMap:         {},
    topProductId:     null,
    timeSpentSeconds: 0,
    top3Ids:          [],

    // ── From FAQSection ───────────────────
    faqsOpened: [],

    // ── From Personalisation1 ─────────────
    p1ExpandedCardIndex: null,
    p1ExpandedProductId: null,
    p1ExpandedReadTime:  0,

    // ── From Personalisation2 ─────────────
    p2ActiveCardId: null,
    p2ReadTime:     0,
    p2ScrollDepth:  0,
    p2PlayClicked:  false,
    p2PlaySeconds:  0,

    // ── From model API ────────────────────
    prediction: null,
    /**
     * prediction shape:
     * {
     *   PredictedAction:       "Next Product" | "Share" | "Rewatch" | "Exit"
     *   ActionConfidence:      0.0–1.0
     *   NextProductID:         "fin-2" | null
     *   NextProductName:       string | null
     *   NextProductConfidence: 0.0–1.0 | null
     *   NextProduct:           full product object | null
     * }
     */

    // ── Engagement score snapshot ─────────
    engagementScore: 0,
    rawPoints:       0,
  };
}

// ─── In-memory state ─────────────────────────────────────────
let _session   = emptySession();
let _listeners = [];

// ─── Journey history (survives resets) ───────────────────────
const HISTORY_KEY = "vynqe_journey_history";

export function getJourneyHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveToHistory(snapshot) {
  try {
    const history = getJourneyHistory();
    history.push({ ...snapshot, savedAt: Date.now() });
    const trimmed = history.slice(-20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    gaEvent("journey_saved_to_history", {
      journey_number:   snapshot.journeyNumber,
      user_id:          snapshot.userId ?? "unknown",
      predicted_action: snapshot.prediction?.PredictedAction ?? "none",
      engagement_score: snapshot.engagementScore,
    });
  } catch (_) {}
}

// ─── Subscribe / notify ───────────────────────────────────────
function notify() {
  _listeners.forEach((fn) => fn({ ..._session }));
}

export function subscribe(fn) {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((l) => l !== fn);
  };
}

// ─── Read ─────────────────────────────────────────────────────
export function getSession() {
  return { ..._session };
}

// ─── Write ────────────────────────────────────────────────────
export function setSession(patch) {
  _session = { ..._session, ...patch };
  notify();
}

// ─── Specific setters ─────────────────────────────────────────

/** Called from DemoModal onStart */
export function setProfile({ name, company, accountType, industry }) {
  setSession({ name, company, accountType, industry, deviceType: detectDevice() });
  gaEvent("demo_session_started", {
    account_type: accountType,
    industry,
    device_type:  detectDevice(),
  });
}

/**
 * Called from BookDemo form submission.
 * Ensures userId is created and stored before navigating to demo.
 */
export function setBookDemoData({ fullName, email, jobTitle, company, message, industry, accountType }) {
  const firstName = fullName ? fullName.trim().split(/\s+/)[0] : "";
  
  // Ensure userId exists (create if needed)
  const userId = getOrCreateUserId();
  
  setSession({
    name: firstName,
    fullName,
    email,
    jobTitle,
    company,
    message,
    industry,
    accountType,
    userId, // Ensure userId is in session
  });
  
  gaEvent("book_demo_submitted", { email, job_title: jobTitle, company, user_id: userId });
  
  return { userId }; // Return for URL param passing
}

/** Called from DemoEnd when the user submits their phone for a callback */
export function setPhone(phone) {
  setSession({ phone: phone || "" });
}

/** Called from StepsSection after user scrolls past */
export function setHoverResults({ hoverMap, topProductId, timeSpentSeconds, top3Ids }) {
  setSession({ hoverMap, topProductId, timeSpentSeconds, top3Ids });
  gaEvent("hover_results_finalized", {
    top_product_id: topProductId,
    time_spent:     timeSpentSeconds,
    top3:           top3Ids.join(","),
  });
}

/** Called from FAQSection */
export function addFaqOpened(index) {
  const current = _session.faqsOpened ?? [];
  if (!current.includes(index)) {
    setSession({ faqsOpened: [...current, index] });
    gaEvent("faq_session_update", { faq_index: index, total_opened: current.length + 1 });
  }
}

/** Called from Personalisation1 */
export function setP1Expanded({ cardIndex, productId, readTime }) {
  setSession({
    p1ExpandedCardIndex: cardIndex,
    p1ExpandedProductId: productId,
    p1ExpandedReadTime:  readTime,
  });
  gaEvent("p1_expanded_session", { card_index: cardIndex, product_id: productId, read_time: readTime });
}

/** Called from Personalisation2 */
export function setP2State({ activeCardId, readTime, scrollDepth, playClicked, playSeconds }) {
  setSession({
    p2ActiveCardId: activeCardId,
    p2ReadTime:     readTime,
    p2ScrollDepth:  scrollDepth,
    p2PlayClicked:  playClicked,
    p2PlaySeconds:  playSeconds,
  });
}

/**
 * CRITICAL: Called from Personalisation3 after model responds.
 * This is the ONLY place where session_id is created.
 * 
 * Flow:
 *   1. Check if userId exists (required)
 *   2. Create sessionId if doesn't exist
 *   3. Set startedAt timestamp
 *   4. Store prediction data
 *   5. Return session data for logging
 */
export function setPrediction(wrapped) {
  const flat = wrapped?.prediction ?? wrapped ?? {};
  const snap = tracker.getSnapshot();

  // ENSURE userId exists - create if missing
  let userId = _session.userId;
  if (!userId) {
    userId = getOrCreateUserId();
  }

  // Create sessionId ONLY if it doesn't exist (first model response)
  let sessionId = _session.sessionId;
  let startedAt = _session.startedAt;
  
  if (!sessionId) {
    sessionId = generateSessionId();
    startedAt = Date.now();
    storeSessionId(sessionId);
  }

  const sessionUpdates = {
    userId,
    sessionId,
    startedAt,
    prediction: flat,
    engagementScore: snap.score,
    rawPoints: snap.rawPoints,
  };

  setSession(sessionUpdates);

  gaEvent("model_response_received", {
    predicted_action: flat.PredictedAction       ?? "none",
    action_confidence: flat.ActionConfidence      ?? 0,
    next_product_id: flat.NextProductID         ?? "none",
    next_product_confidence: flat.NextProductConfidence ?? 0,
    engagement_score: snap.score,
    user_id: userId,
    session_id: sessionId,
  });

  // Return complete session data for immediate logging
  return {
    ...getSession(),
    ...sessionUpdates,
  };
}

/**
 * Check if session exists (has sessionId)
 */
export function hasSession() {
  return !!_session.sessionId;
}

/**
 * Get userId for navigation URL params
 */
export function getUserIdForUrl() {
  return _session.userId || getStoredUserId();
}

// ─── Reset ───────────────────────────────────────────────────

/**
 * Saves current session to history, resets state + tracker.
 * NOTE: userId is NOT cleared on reset — persists across all sessions.
 * SessionId IS cleared — new session created on next model response.
 */
export function resetSession() {
  const snapshot = {
    ..._session,
    engagementScore: tracker.getScore(),
    rawPoints:       tracker.getRawPoints(),
  };

  // Only save to history if we had a complete session
  if (snapshot.sessionId && snapshot.prediction) {
    saveToHistory(snapshot);
  }

  tracker.reset();

  // Clear stored sessionId
  clearStoredSessionId();

  // Preserve userId across reset
  const preservedUserId = _session.userId;
  _session = emptySession();
  if (preservedUserId) {
    _session.userId = preservedUserId;
  }

  notify();
  gaEvent("session_reset", {
    journey_number: snapshot.journeyNumber,
    user_id:        preservedUserId ?? "unknown",
  });
}

// ─── Initialize userId from URL or storage ───────────────────
/**
 * Called on Demo.jsx mount to ensure userId is loaded.
 * Priority: URL param > localStorage > create new
 */
export function initializeUserId(urlUserId = null) {
  let userId = urlUserId || getStoredUserId();
  
  if (!userId) {
    // This shouldn't happen if coming from BookDemo, but handle gracefully
    userId = getOrCreateUserId();
    console.warn("[session] No userId found - created new one:", userId);
  }
  
  if (userId !== _session.userId) {
    setSession({ userId });
  }
  
  return userId;
}

// ─── React hook ───────────────────────────────────────────────
import { useState, useEffect } from "react";

export function useSession() {
  const [state, setState] = useState(getSession());

  useEffect(() => {
    setState(getSession());
    const unsub = subscribe((s) => setState(s));
    return unsub;
  }, []);

  return state;
}

/**
 * ─────────────────────────────────────────────────────────────
 * WIRING GUIDE — Updated Flow
 *
 *  BookDemo.jsx:
 *    1. User submits form
 *    2. setBookDemoData() creates/gets userId
 *    3. Navigate to /demo?uid=<userId>
 *
 *  Demo.jsx:
 *    1. On mount, read uid from URL
 *    2. initializeUserId(urlUserId) sets userId in session
 *    3. User interacts with demo
 *
 *  Personalisation3.jsx:
 *    1. When section visible, fireModel() called
 *    2. Model API responds
 *    3. setPrediction() creates sessionId (if needed)
 *    4. logSession() fires with complete data
 *
 *  DemoEnd.jsx (if exists):
 *    1. Phone submission
 *    2. updatePhone() updates SAME session row
 *
 *  KEY RULES:
 *   • user_id: Created once, stored forever
 *   • session_id: Created per model response
 *   • NO sessions without user_id
 *   • NO logging without session_id
 * ─────────────────────────────────────────────────────────────
 */