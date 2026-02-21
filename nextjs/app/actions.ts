"use server";

import { runHostRequest } from "@/lib/host-request";

export type HostActionState = {
  error?: string;
  result?: {
    ok: boolean;
    status: number;
    url: string;
    headers: Record<string, string>;
    body: string;
  };
};

export async function testHostRouteAction(
  _previousState: HostActionState,
  formData: FormData
): Promise<HostActionState> {
  try {
    const host = String(formData.get("host") ?? "");
    const method = String(formData.get("method") ?? "GET").toUpperCase() as "GET" | "POST";
    const payload = String(formData.get("payload") ?? "{}");

    if (!["GET", "POST"].includes(method)) {
      return {
        error: "Method must be GET or POST"
      };
    }

    const result = await runHostRequest({
      host,
      method,
      payload
    });

    return { result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unexpected error"
    };
  }
}
