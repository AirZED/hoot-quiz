'use client'

import { useEffect } from "react"
import Button from "../components/atoms/Button"
import { connectWebSocket, getSocket } from '../utils/socket'

export default function Home() {

  const handleSocketConnection = () => {

    const socket = getSocket();

    try {
      socket.emit('sendMessage', 'Hello WebSocket!');

      console.log('hmm')
    } catch (error) {
      console.error('Error emitting message:', error);
      console.log('haa')
    }

  }
  useEffect(() => {
    const socket = connectWebSocket();

    // Handle WebSocket events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    return () => {
      // Cleanup on component unmount
      socket.disconnect();
    };
  }, []);


  return (
    <main className="flex min-h-screen flex-col p-24 bg-white text-black">

      <h2>Hello World</h2>

      <Button variant="primary" onClick={handleSocketConnection} >Start Session</Button>
    </main>
  )
}
