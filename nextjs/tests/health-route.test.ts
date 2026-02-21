import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns service status payload", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.service).toBe("hubfly-nextjs-template");
    expect(typeof body.timestamp).toBe("string");
  });
});
