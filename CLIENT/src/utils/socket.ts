class WebSocketService {
  private socket: WebSocket;

  constructor() {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    this.socket = new WebSocket(`${protocol}://localhost:8080`);

    this.socket.addEventListener("open", () => {
      console.log("WebSocket connected");
    });

    this.socket.addEventListener("message", (event) => {
      console.log(`Received message: ${event.data}`);
    });

    this.socket.addEventListener("close", () => {
      console.log("WebSocket closed");
    });
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }
}

const webSocketService = new WebSocketService();

export default webSocketService;
