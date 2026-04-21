/**
 * sessionLogger.js
 * ─────────────────────────────────────────────────────────────
 * Logs a complete demo session to Supabase (REST from the browser).
 *
 * PRODUCTION CHECKLIST (most failures are one of these):
 *   1. VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY must be set on your
 *      host **before** `npm run build` — Vite inlines them at build time.
 *   2. Supabase: table `demo_sessions`, RLS policies, **unique index on
 *      session_id**, **UPDATE policy** for upsert, and **phone** column
 *      (see SQL at bottom).
 *   3. Optional staging debug: VITE_DEBUG_SESSION_LOG=true → last result
 *      on `window.__vynqeSessionLog` (no console).
 * ─────────────────────────────────────────────────────────────
 */

const TABLE = "demo_sessions";

function supabaseEnv() {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const url = typeof rawUrl === "string" ? rawUrl.trim().replace(/\/+$/, "") : "";
  return { url, key: typeof key === "string" ? key.trim() : "" };
}

function publishDebug(payload) {
  if (import.meta.env.VITE_DEBUG_SESSION_LOG !== "true") return;
  if (typeof window === "undefined") return;
  window.__vynqeSessionLog = payload;
}

/**
 * @returns {Promise<{ ok: boolean, error?: string, status?: number, detail?: string }>}
 */
export async function logSession(session, tracker) {
  const { url: supabaseUrl, key: supabaseKey } = supabaseEnv();

  if (!supabaseUrl || !supabaseKey) {
    const out = { ok: false, error: "missing_env" };
    publishDebug(out);
    return out;
  }

  try {
    const snap = tracker.getSnapshot();
    const hoverMap = tracker.getHoverMap();

    const row = {
      session_id:     session.sessionId ?? null,
      full_name:      session.fullName || session.name || null,
      email:          session.email || null,
      phone:          session.phone?.trim() || null,
      company:        session.company || null,
      job_title:      session.jobTitle || null,
      industry:       session.industry || null,
      account_type:   session.accountType || null,
      message:        session.message || null,
      device_type:    session.deviceType || null,
      journey_number: session.journeyNumber ?? null,
      started_at: session.startedAt ? new Date(session.startedAt).toISOString() : null,
      logged_at: new Date().toISOString(),

      top_product_id:      session.topProductId || snap.topProductId || null,
      top_product_seconds: session.timeSpentSeconds || snap.timeSpentSeconds || 0,
      top3_ids:
        session.top3Ids?.length ? session.top3Ids
        : snap.top3Ids?.length ? snap.top3Ids
        : [],
      hover_map: hoverMap,

      p1_expanded_card_index: session.p1ExpandedCardIndex ?? null,
      p1_expanded_product_id: session.p1ExpandedProductId || null,
      p1_expanded_read_time:  session.p1ExpandedReadTime || 0,
      p2_active_card_id: session.p2ActiveCardId || null,
      p2_read_time:      session.p2ReadTime || 0,
      p2_scroll_depth:   session.p2ScrollDepth || 0,
      p2_play_clicked:   session.p2PlayClicked || false,
      p2_play_seconds:   session.p2PlaySeconds || 0,
      faqs_opened:       session.faqsOpened || [],
      engagement_score:  snap.score || session.engagementScore || 0,
      raw_points:        snap.rawPoints || session.rawPoints || 0,
      faq_count:         snap.faqCount || 0,

      predicted_action:        session.prediction?.PredictedAction || null,
      action_confidence:       session.prediction?.ActionConfidence ?? null,
      next_product_id:         session.prediction?.NextProductID || null,
      next_product_name:       session.prediction?.NextProductName || null,
      next_product_confidence: session.prediction?.NextProductConfidence ?? null,
      signal_log: tracker.getLog(),
    };

    const res = await fetch(
      `${supabaseUrl}/rest/v1/${TABLE}?on_conflict=session_id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(row),
      }
    );

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 500);
      const out = { ok: false, error: "supabase_rejected", status: res.status, detail };
      publishDebug(out);
      return out;
    }

    const out = { ok: true };
    publishDebug(out);
    return out;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const out = { ok: false, error: "network_or_parse", detail: message.slice(0, 500) };
    publishDebug(out);
    return out;
  }
}


/* ════════════════════════════════════════════════════════════
   SQL — run in Supabase SQL Editor
════════════════════════════════════════════════════════════

create table demo_sessions (
  id                      bigserial primary key,

  session_id              text,
  full_name               text,
  email                   text,
  phone                   text,
  company                 text,
  job_title               text,
  industry                text,
  account_type            text,
  message                 text,
  device_type             text,
  journey_number          int,
  started_at              timestamptz,
  logged_at               timestamptz default now(),

  top_product_id          text,
  top_product_seconds     numeric,
  top3_ids                jsonb,
  hover_map               jsonb,

  p1_expanded_card_index  int,
  p1_expanded_product_id  text,
  p1_expanded_read_time   numeric,

  p2_active_card_id       text,
  p2_read_time            numeric,
  p2_scroll_depth         numeric,
  p2_play_clicked         boolean,
  p2_play_seconds         numeric,

  faqs_opened             jsonb,

  engagement_score        numeric,
  raw_points              numeric,
  faq_count               int,

  predicted_action        text,
  action_confidence       numeric,
  next_product_id         text,
  next_product_name       text,
  next_product_confidence numeric,

  signal_log              jsonb
);

alter table demo_sessions enable row level security;

-- RLS: avoid WITH CHECK (true) — Supabase linter flags it (anon key is still public;
-- for real abuse protection use an Edge Function + service_role insert instead).
-- session_id must match makeSessionId() in src/utils/session.js: sess_<ms>_<random>
create unique index if not exists demo_sessions_session_id_key on demo_sessions (session_id);

create policy "anon insert demo_sessions"
  on demo_sessions for insert
  to anon
  with check (
    session_id is not null
    and session_id ~ '^sess_[0-9]+_[a-z0-9]+$'
  );

create policy "anon update demo_sessions upsert"
  on demo_sessions for update
  to anon
  using (
    session_id is not null
    and session_id ~ '^sess_[0-9]+_[a-z0-9]+$'
  )
  with check (
    session_id is not null
    and session_id ~ '^sess_[0-9]+_[a-z0-9]+$'
  );

-- ── Migrate from old permissive policies (run once if you already have the table) ──
-- drop policy if exists "anon insert only" on demo_sessions;
-- drop policy if exists "anon update for upsert" on demo_sessions;
-- then run the two create policy statements above.

-- Existing projects (column / index only):
-- alter table demo_sessions add column if not exists phone text;
-- create unique index if not exists demo_sessions_session_id_key on demo_sessions (session_id);

════════════════════════════════════════════════════════════ */
