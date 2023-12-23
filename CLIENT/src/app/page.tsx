'use client'
import Button from "../components/atoms/Button"

export default function Home() {

  const handleSocketConnection = ()=>{

    console.log('Button has been clicked')

  }
  return (
    <main className="flex min-h-screen flex-col p-24 bg-white text-black">

      <h2>Hello World</h2>

      <Button variant="primary" onClick={handleSocketConnection} >Start Session</Button>
    </main>
  )
}
