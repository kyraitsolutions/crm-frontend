type Listener = (data: any) => void;

class SocketManager {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();
  private url = "";
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionallyClosed = false;

  connect(url: string) {
    this.url = url;
    this.intentionallyClosed = false;

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      const currentUrl = (this.socket as WebSocket).url;
      if (currentUrl === url || currentUrl.startsWith(url)) {
        return;
      }
      this.socket.close();
      this.socket = null;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("✅ WS Connected");
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const eventListeners = this.listeners.get(parsed.event);
        if (!eventListeners) return;
        eventListeners.forEach((callback) => {
          callback(parsed.data);
        });
      } catch {
        console.error("Invalid WS message");
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      if (this.intentionallyClosed || !this.url) return;
      this.reconnectTimer = setTimeout(() => {
        this.connect(this.url);
      }, 3000);
    };
  }

  subscribe(event: string, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, data: any) {
    this.socket?.send(
      JSON.stringify({
        event,
        data,
      }),
    );
  }

  disconnect() {
    this.intentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }
}

export const socketManager = new SocketManager();
