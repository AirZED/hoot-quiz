class WebSocketService {
  private socket: WebSocket;

  constructor(onOpenCallback?: () => void) {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    this.socket = new WebSocket(`${protocol}://localhost:8080`);

    this.socket.addEventListener("open", () => {
      console.log("WebSocket connected");
      // Execute the callback function when the connection is open
      if (onOpenCallback) {
        onOpenCallback();
      }
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

const handleSocketOpen = () => {
  // Dispatch your controller function or any other action here
  console.log("Socket connection is open, dispatching controller function...");
  // Example: dispatchControllerFunction();
};

const webSocketService = new WebSocketService(handleSocketOpen);

export default webSocketService;
