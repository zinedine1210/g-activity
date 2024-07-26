// nakamaConfig.js
import { Client, Socket } from '@heroiclabs/nakama-js';
import dotenv from 'dotenv';

dotenv.config();

console.log("Server Key:", process.env.NEXT_PUBLIC_NAKAMA_SERVER_KEY);
console.log("Host:", process.env.NEXT_PUBLIC_NAKAMA_HOST);
console.log("Port:", process.env.NEXT_PUBLIC_NAKAMA_PORT);

const nakamaClient = new Client(
  process.env.NEXT_PUBLIC_NAKAMA_SERVER_KEY,
  process.env.NEXT_PUBLIC_NAKAMA_HOST,
  process.env.NEXT_PUBLIC_NAKAMA_PORT,
  false,
);

const socket = nakamaClient.createSocket();

const initSocket = async (profileData) => {
  try {
      // set session
      let sessionToken = { 'token': profileData['_NToken'] }
      console.log("sessionToken", sessionToken)
      console.log("nakamaClient", nakamaClient)
      console.log("nakama socket", socket)

      // const sessionNakama = await nakamaClient.getAccount(sessionToken);
      // console.log('sessionNakama', sessionNakama)

      // connect socket nakama
      let nakamaSocket = await socket.connect(sessionToken, true);
      console.log("connect nakamaSocket", nakamaSocket)
  } catch (error) {
      console.error('Error initializing socket:', error);
  }
};

export { nakamaClient, socket, initSocket };
