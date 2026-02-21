"use client";

import { useActionState } from "react";
import { testHostRouteAction, type HostActionState } from "@/app/actions";

const initialState: HostActionState = {};

export function HostRouteTester() {
  const [state, formAction, isPending] = useActionState(testHostRouteAction, initialState);

  return (
    <section className="card">
      <h2>Host Route Tester (Server Action)</h2>
      <form action={formAction}>
        <label htmlFor="host">Host or URL</label>
        <input id="host" name="host" placeholder="example.com/api/health" required />

        <label htmlFor="method">Method</label>
        <select id="method" name="method" defaultValue="GET">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>

        <label htmlFor="payload">JSON payload (POST only)</label>
        <textarea
          id="payload"
          name="payload"
          rows={5}
          defaultValue={JSON.stringify(
            {
              message: "Hello from HubFly Next.js template"
            },
            null,
            2
          )}
        />

        <button type="submit" disabled={isPending}>
          {isPending ? "Testing..." : "Test Route"}
        </button>
      </form>

      {state.error ? <p>error: {state.error}</p> : null}

      {state.result ? (
        <pre>
          {JSON.stringify(
            {
              ok: state.result.ok,
              status: state.result.status,
              url: state.result.url,
              headers: state.result.headers,
              body: state.result.body
            },
            null,
            2
          )}
        </pre>
      ) : null}
    </section>
  );
}
