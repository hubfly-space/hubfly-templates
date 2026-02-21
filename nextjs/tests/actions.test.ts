import { testHostRouteAction } from "@/app/actions";
import * as hostRequest from "@/lib/host-request";

describe("testHostRouteAction", () => {
  it("returns validation error for unsupported method", async () => {
    const formData = new FormData();
    formData.set("host", "example.com");
    formData.set("method", "PUT");

    const result = await testHostRouteAction({}, formData);

    expect(result.error).toBe("Method must be GET or POST");
  });

  it("returns request result when host request succeeds", async () => {
    const formData = new FormData();
    formData.set("host", "example.com");
    formData.set("method", "GET");

    const runHostRequestSpy = vi.spyOn(hostRequest, "runHostRequest").mockResolvedValue({
      ok: true,
      status: 200,
      url: "https://example.com/",
      headers: { "content-type": "application/json" },
      body: "{\"status\":\"ok\"}"
    });

    const result = await testHostRouteAction({}, formData);

    expect(runHostRequestSpy).toHaveBeenCalledTimes(1);
    expect(result.result?.status).toBe(200);

    runHostRequestSpy.mockRestore();
  });
});
