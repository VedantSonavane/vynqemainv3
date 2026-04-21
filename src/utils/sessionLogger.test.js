import { describe, it, expect, vi, afterEach } from "vitest";
import { logSession } from "./sessionLogger.js";

const mockTracker = {
  getSnapshot: () => ({
    score: 1,
    rawPoints: 2,
    topProductId: "ms-1",
    timeSpentSeconds: 10,
    top3Ids: ["ms-1"],
    faqCount: 0,
  }),
  getHoverMap: () => ({ "ms-1": 5 }),
  getLog: () => [{ e: "test" }],
};

describe("logSession", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns missing_env when Supabase URL or key is empty", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    const r = await logSession({ sessionId: "sess_test" }, mockTracker);
    expect(r.ok).toBe(false);
    expect(r.error).toBe("missing_env");
  });

  it("POSTs to REST API when env is set and returns ok on 2xx", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://xyzcompany.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", fetchMock);

    const r = await logSession(
      { sessionId: "sess_1", fullName: "Test User", email: "t@example.com" },
      mockTracker
    );

    expect(r.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://xyzcompany.supabase.co/rest/v1/demo_sessions?on_conflict=session_id"
    );
    expect(init.method).toBe("POST");
    expect(init.headers.Prefer).toContain("merge-duplicates");
    const body = JSON.parse(init.body);
    expect(body.session_id).toBe("sess_1");
    expect(body.full_name).toBe("Test User");
    expect(body.email).toBe("t@example.com");
  });

  it("returns supabase_rejected with status when API errors", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://xyzcompany.supabase.co/");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "k");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("invalid input"),
      })
    );

    const r = await logSession({ sessionId: "s" }, mockTracker);
    expect(r.ok).toBe(false);
    expect(r.error).toBe("supabase_rejected");
    expect(r.status).toBe(400);
    expect(r.detail).toContain("invalid");
  });
});
