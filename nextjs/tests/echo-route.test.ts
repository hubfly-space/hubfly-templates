import { POST } from "@/app/api/echo/route";

describe("POST /api/echo", () => {
  it("returns echoed JSON payload", async () => {
    const request = new Request("http://localhost/api/echo", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ hello: "world" })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Echo from HubFly Next.js template");
    expect(body.payload).toEqual({ hello: "world" });
  });
});
