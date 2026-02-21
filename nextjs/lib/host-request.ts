export type HostRequestInput = {
  host: string;
  method: "GET" | "POST";
  payload?: string;
};

export type HostRequestResult = {
  ok: boolean;
  status: number;
  url: string;
  headers: Record<string, string>;
  body: string;
  error?: string;
};

export function normalizeHostInput(host: string): string {
  const trimmed = host.trim();

  if (!trimmed) {
    throw new Error("Host is required");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https protocols are supported");
  }

  return url.toString();
}

export async function runHostRequest(input: HostRequestInput): Promise<HostRequestResult> {
  const url = normalizeHostInput(input.host);

  const response = await fetch(url, {
    method: input.method,
    headers: {
      "content-type": "application/json"
    },
    body: input.method === "POST" ? input.payload ?? "{}" : undefined,
    cache: "no-store"
  });

  const text = await response.text();
  const headers = Object.fromEntries(response.headers.entries());

  return {
    ok: response.ok,
    status: response.status,
    url,
    headers,
    body: text.slice(0, 4000)
  };
}
