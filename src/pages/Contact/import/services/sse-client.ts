export interface SseHandlers {
  onEvent: (event: string, data: string) => void;
  onError?: (error: unknown) => void;
}

export async function readSseStream(
  url: string,
  headers: Record<string, string>,
  signal: AbortSignal,
  handlers: SseHandlers,
): Promise<"closed" | "blocked" | "error"> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        ...headers,
      },
      signal,
    });
  } catch (error) {
    if (signal.aborted) {
      return "closed";
    }
    handlers.onError?.(error);
    return "error";
  }

  if (!response.ok) {
    handlers.onError?.(new Error(`SSE ${response.status}`));
    return response.status === 429 ? "blocked" : "error";
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream") || !response.body) {
    return "blocked";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        flushSseBuffer(buffer, handlers.onEvent);
        return "closed";
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        dispatchSseChunk(part, handlers.onEvent);
      }
    }
  } catch (error) {
    if (signal.aborted) {
      return "closed";
    }
    handlers.onError?.(error);
    return "error";
  }
}

function flushSseBuffer(buffer: string, onEvent: (event: string, data: string) => void): void {
  if (buffer.trim()) {
    dispatchSseChunk(buffer, onEvent);
  }
}

function dispatchSseChunk(chunk: string, onEvent: (event: string, data: string) => void): void {
  const lines = chunk.split("\n");
  let event = "message";
  const data: string[] = [];
  for (const line of lines) {
    if (line.startsWith(":")) {
      continue;
    }
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
      continue;
    }
    if (line.startsWith("data:")) {
      data.push(line.slice(5).trimStart());
    }
  }
  if (data.length > 0) {
    onEvent(event, data.join("\n"));
  }
}
