type Event = {
  event: string;
  targets: string[];
  data: any;
};

type Callback = (data?: any) => void;

class WebSocketConnection {
  private socket: WebSocket | null = null;
  private targets: string[];
  private callbacks: Map<string, Set<Callback>>; // event -> callback list
  private oneTimeCallbacks: Map<string, Set<Callback>>; // event -> callback list
  private id = "";
  private reservedEvent = ["connection", "disconnection", "join", "leave"];
  private lastUrl = "";

  constructor(url: string) {
    this.targets = [];
    this.callbacks = new Map();
    this.oneTimeCallbacks = new Map();

    this.on("connection", (data: { id: string }) => {
      this.id = data.id;
    });

    this.connect(url);
  }

  disconnect() {
    this.id = "";
    this.socket?.close();
    this.socket = null;
  }

  reconnect() {
    this.connect(this.lastUrl);
  }

  connect(url: string) {
    this.socket?.close();

    this.socket = new WebSocket(url);
    this.lastUrl = url;

    this.socket.onclose = () => {
      let callbacks = this.callbacks.get("disconnection");
      if (callbacks) {
        for (const callback of callbacks) callback();
      }

      callbacks = this.oneTimeCallbacks.get("disconnection");
      if (callbacks) {
        for (const callback of callbacks) callback();
      }
      this.oneTimeCallbacks.delete("disconnection");

      this.id = "";
    };

    this.socket.onmessage = (event) => {
      try {
        const msg: Event = JSON.parse(event.data);
        const eventType = msg.event;

        // handled in method 'onclose'
        if (eventType === "disconnection") return;

        let callbacks = this.oneTimeCallbacks.get(eventType);
        if (callbacks) {
          for (const callback of callbacks) {
            callback(msg.data);
          }
        }
        this.oneTimeCallbacks.delete(eventType);

        callbacks = this.callbacks.get(eventType);
        if (callbacks) {
          for (const callback of callbacks) {
            callback(msg.data);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
  }

  to(target: string) {
    this.targets.push(target);
    return this;
  }

  join(room: string) {
    this.upgradedEmit("join", { room: room });
  }

  leave(room?: string) {
    this.upgradedEmit("leave", room ? { room: room } : null);
  }

  private upgradedEmit(event: string, data: any) {
    if (this.socket) {
      const msg: Event = {
        event: event,
        data: data,
        targets: this.targets,
      };
      console.log(msg);
      this.socket.send(JSON.stringify(msg));
      this.targets = [];
    } else {
      throw Error("Disconnected to web socket server.");
    }
  }

  emit(event: string, data: any) {
    if (this.reservedEvent.indexOf(event) >= 0) {
      console.error("Not allowed to emit this event.");
      return;
    }

    this.upgradedEmit(event, data);
  }

  once(event: string, callback: Callback) {
    if (!this.oneTimeCallbacks.has(event))
      this.oneTimeCallbacks.set(event, new Set());
    const callbacks = this.oneTimeCallbacks.get(event)!;
    callbacks.add(callback);
  }

  on(event: string, callback: Callback) {
    if (!this.callbacks.has(event)) this.callbacks.set(event, new Set());
    const callbacks = this.callbacks.get(event)!;
    callbacks.add(callback);
  }

  off(event: string, callback?: Callback) {
    if (callback) {
      {
        const callbacks = this.callbacks.get(event);
        if (callbacks) callbacks.delete(callback);
      }

      const callbacks = this.oneTimeCallbacks.get(event);
      if (callbacks) callbacks.delete(callback);
    } else {
      this.callbacks.delete(event);
      this.oneTimeCallbacks.delete(event);
    }
  }

  getId() {
    return this.id.slice();
  }
}

export { WebSocketConnection };
