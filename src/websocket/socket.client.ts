// websocket/socket.client.ts
type Listener = (data: any) => void;

class SocketManager {
  private socket: WebSocket | null = null;

  private listeners: Map<string, Set<Listener>> = new Map();

  connect(url: string) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      this.socket.close();
      this.socket = null;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("✅ WS Connected");
    };

    this.socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      const eventListeners = this.listeners.get(parsed.event);

      if (!eventListeners) return;

      eventListeners.forEach((callback) => {
        callback(parsed.data);
      });
    };

    this.socket.onclose = () => {
      console.log("❌ WS Closed");

      this.socket = null;
      // reconnect
      //   setTimeout(() => {
      //     this.connect(url);
      //   }, 3000);
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
    this.socket?.close();
    this.socket = null;
  }
}

export const socketManager = new SocketManager();
