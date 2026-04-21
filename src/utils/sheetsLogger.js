const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbwEK06xdgpZbAwOMXGBVhGtBRkP1F2Yzpr6FffO8iUlMLdtJDemRhK9f8HduCGIWpl9pA/exec";

function toIST() {
  return new Date()
    .toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
}

const USER_ID_KEY = "vynqe_user_id";
const SESSION_ID_KEY = "vynqe_session_id";

export function getStoredUserId() {
  try { return localStorage.getItem(USER_ID_KEY) || null; }
  catch { return null; }
}

export function storeUserId(uid) {
  try { localStorage.setItem(USER_ID_KEY, uid); } catch {}
}

export function getStoredSessionId() {
  try { return localStorage.getItem(SESSION_ID_KEY) || null; }
  catch { return null; }
}

export function storeSessionId(sid) {
  try { localStorage.setItem(SESSION_ID_KEY, sid); } catch {}
}

function roundHoverMap(raw = {}) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = parseFloat(Number(v).toFixed(2));
  }
  return out;
}

function postWrite(payload) {
  if (!ENDPOINT) return;

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
    mode: "no-cors",
    redirect: "follow",
  }).catch(() => {});
}

/**
 * Log Book Demo form submission to Leads sheet
 * UserId is now generated client-side (UUID format) and passed explicitly
 */
export async function logBookDemo(formData) {
  const userId = formData.userId || getStoredUserId();
  
  if (!userId) {
    console.error("[sheetsLogger] No userId provided for logBookDemo");
    return { ok: false, error: "missing_user_id" };
  }

  postWrite({
    sheet: "leads",
    user_id: userId,
    submitted_at: toIST(),
    full_name: formData.fullName || "",
    email: formData.email || "",
    company: formData.company || "",
    job_title: formData.role || formData.jobTitle || "",
    industry: formData.industry || "",
    account_type: formData.accountType || "",
    message: formData.message || "",
  });

  return { ok: true, user_id: userId };
}

/**
 * Log complete session data to Sessions sheet
 * Called ONLY after model response (when sessionId is guaranteed to exist)
 */
export async function logSession(session, tracker, modelRequest = null, modelResponse = null) {
  // CRITICAL: Only log if we have both userId AND sessionId
  if (!session.userId) {
    console.error("[sheetsLogger] Cannot log session: missing userId");
    return { ok: false, error: "missing_user_id" };
  }
  
  if (!session.sessionId) {
    console.error("[sheetsLogger] Cannot log session: missing sessionId");
    return { ok: false, error: "missing_session_id" };
  }

  const finalized = tracker.finalizeHoverTracking ? tracker.finalizeHoverTracking() : {};
  const rawHover = tracker.getHoverMap ? tracker.getHoverMap() : {};
  const signalLog = tracker.getLog ? tracker.getLog() : [];
  const snap = tracker.getSnapshot ? tracker.getSnapshot() : {};

  const hoverMap = roundHoverMap(rawHover);
  const rawSecs = session.timeSpentSeconds || finalized.timeSpentSeconds || snap.timeSpentSeconds || 0;
  const topProductSec = parseFloat(Number(rawSecs).toFixed(2));

  const top3Ids = session.top3Ids?.length
    ? session.top3Ids
    : finalized.top3Ids?.length
    ? finalized.top3Ids
    : snap.top3Ids?.length
    ? snap.top3Ids
    : [];

  const topProductId = session.topProductId || finalized.topProductId || snap.topProductId || "";
  const prediction = modelResponse?.prediction ?? session.prediction ?? {};

  postWrite({
    sheet: "sessions",
    session_id: session.sessionId,
    user_id: session.userId,
    logged_at: toIST(),
    phone: session.phone?.trim() || "",
    top_product_id: topProductId,
    top_product_seconds: topProductSec,
    top3_ids: top3Ids,
    hover_map: hoverMap,
    p1_expanded_product_id: session.p1ExpandedProductId || "",
    p1_expanded_read_time: parseFloat(Number(session.p1ExpandedReadTime || 0).toFixed(2)),
    p2_active_card_id: session.p2ActiveCardId || "",
    p2_play_clicked: session.p2PlayClicked || false,
    p2_scroll_depth: session.p2ScrollDepth || 0,
    engagement_score: snap.score || session.engagementScore || 0,
    raw_points: snap.rawPoints || session.rawPoints || 0,
    predicted_action: prediction.PredictedAction || "",
    action_confidence: prediction.ActionConfidence || 0,
    next_product_id: prediction.NextProductID || "",
    next_product_name: prediction.NextProductName || "",
    model_request: modelRequest ? JSON.stringify(modelRequest) : "",
    model_response: modelResponse ? JSON.stringify(modelResponse) : "",
    signal_log: signalLog,
  });

  return { ok: true, session_id: session.sessionId, user_id: session.userId };
}

/**
 * Update phone number in existing session row
 * Does NOT create new session - only updates existing
 */
export function updatePhone(session) {
  if (!session.sessionId) {
    console.error("[sheetsLogger] Cannot update phone: missing sessionId");
    return { ok: false, error: "missing_session_id" };
  }

  postWrite({
    action: "patch_phone",
    session_id: session.sessionId,
    user_id: session.userId || getStoredUserId() || "",
    phone: session.phone?.trim() || "",
  });

  return { ok: true };
}

/**
 * @deprecated assignSession is no longer needed - session created on model response
 */
export async function assignSession() {
  console.warn("[sheetsLogger] assignSession is deprecated - sessions now created on model response");
  return { ok: true };
}