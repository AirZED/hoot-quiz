import { ReactElement, FormEvent } from "react";
import webSocketService from "../utils/socket";

const JoinGame = (): ReactElement => {


    const joinGameHandler = (e: FormEvent): void => {
        e.preventDefault()

        const data = {
            action: 'sendMessage',
            content: 'Hello, server!',
        };

        webSocketService.sendMessage(JSON.stringify(data));
        console.log('joined game')
    }
    return <div className="w-full h-screen flex items-center justify-center">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="game_code">
                    Game Code
                </label>
                <input className="bg-white shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="game_code" type="text" />
                <p className="text-red-500 text-xs italic">Please enter a game code.</p>
            </div>

            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={joinGameHandler}>
                Join Game
            </button>
        </form>
    </div>
}

export default JoinGame