import { normalizeHostInput, runHostRequest } from "@/lib/host-request";

describe("normalizeHostInput", () => {
  it("adds https protocol when missing", () => {
    expect(normalizeHostInput("example.com/api")).toBe("https://example.com/api");
  });

  it("keeps full urls unchanged", () => {
    expect(normalizeHostInput("http://example.com/test")).toBe("http://example.com/test");
  });

  it("throws on empty input", () => {
    expect(() => normalizeHostInput("   ")).toThrow("Host is required");
  });
});

describe("runHostRequest", () => {
  it("executes GET requests", async () => {
    const mockResponse = new Response("ok", {
      status: 200,
      headers: {
        "x-template": "hubfly"
      }
    });

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const result = await runHostRequest({
      host: "example.com/health",
      method: "GET"
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.url).toBe("https://example.com/health");
    expect(result.headers["x-template"]).toBe("hubfly");
    expect(result.body).toBe("ok");

    fetchSpy.mockRestore();
  });
});
