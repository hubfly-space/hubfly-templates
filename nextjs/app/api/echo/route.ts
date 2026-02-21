import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = { error: "Invalid JSON payload" };
  }

  return NextResponse.json({
    message: "Echo from HubFly Next.js template",
    payload
  });
}
