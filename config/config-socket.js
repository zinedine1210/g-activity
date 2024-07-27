import io from 'socket.io-client';
import { baseDomain } from '@repositories/Repository';

// const URL_SERVER = 'http://localhost:7792';
const URL_SERVER = `${baseDomain}/`;

export const socket = io(`${URL_SERVER}`,{
     secure:false,
     autoConnect: false, 
     reconnection: false,
     transports: ['websocket'],
    //  path:"/socket.io",
    //  query : {
        // "auth": "--SOME AUTH STRING---",
        // "tokenpercakapan" : `${TOKEN_PERCAKAPAN}`,
        // "tokenRuangPercakapan" : `${TOKEN_LOGIN}`,
        // "tokenRuangPercakapan" : `${TOKEN_PARTISIPAN}`,
        // "tokenPartisipan" : `${TOKEN_PARTISIPAN}`,
        // "info": "new connection from website",
        // "timestamp": ''
      // }
});
