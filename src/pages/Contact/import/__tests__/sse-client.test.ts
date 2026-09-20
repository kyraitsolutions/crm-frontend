import { describe, expect, it } from "vitest";
import { readSseStream } from "../services/sse-client";

describe("fetch SSE client", () => {
  it("parses snapshot events and ignores heartbeats", async () => {
    const body = [
      ": heartbeat",
      "",
      "event: snapshot",
      "data: {\"id\":\"job-1\"}",
      "",
    ].join("\n");
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(body));
        controller.close();
      },
    });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(stream, { headers: { "Content-Type": "text/event-stream" } }) as Response;
    const events: Array<{ event: string; data: string }> = [];
    const result = await readSseStream(
      "http://localhost/events",
      { Authorization: "Bearer test" },
      new AbortController().signal,
      {
        onEvent: (event, data) => events.push({ event, data }),
      },
    );
    globalThis.fetch = originalFetch;
    expect(result).toBe("closed");
    expect(events).toEqual([{ event: "snapshot", data: '{"id":"job-1"}' }]);
  });

  it("treats a non-event-stream response as blocked", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response("nope", { headers: { "Content-Type": "text/plain" } }) as Response;
    const result = await readSseStream("http://localhost/events", {}, new AbortController().signal, {
      onEvent: () => undefined,
    });
    globalThis.fetch = originalFetch;
    expect(result).toBe("blocked");
  });
});
