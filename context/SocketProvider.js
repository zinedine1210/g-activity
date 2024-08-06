// context/socket.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '@config/config-socket';
import { setupSocketListeners, connect, emit, checkErrorMsg } from "@utils/socketfunction"
import { MyContext } from "context/MyProvider";
import notifyChat from '@components/Chat/NotifChat';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, profileData }) => {
    const context = useContext(MyContext)
    const [connectionStatus, setConnectionStatus] = useState({ status: 'disconnected', id: null });
    const statename = "dataRoom"

    // join room
    const joinRoom = (newRoomId) => {
        console.log("adakah join room", newRoomId)
        emit('join', { 'room_id': newRoomId }).then(callback => {
            console.log("apa callback")
            console.log("callback", callback)
            // checkErrorMsg(callback)
        })
    }

    const receiveNotif = (data) => {
        console.log("ini receive notif", data)
        if (profileData['id'] != data['last_msg_uid']) {
            let objNotif = {
                'label': data['label'],
                'msg': data['last_msg'],
                'type': data['type'],
                'username': data['last_msg_username']
            }
            notifyChat(objNotif);
        }

        context.setData(prevContext => {
            const prevDataChat = prevContext[statename] || [];
            console.log("prevDataChat", prevContext[statename])
            const existingMessageIndex = prevDataChat.findIndex(res => res.id === data.id);
            if (existingMessageIndex !== -1) { // kalau roomnya udah ada berarti cuma update msg
                const updatedMessages = [...prevDataChat];
                updatedMessages[existingMessageIndex] = data;
                console.log("updatedMessagesupdatedMessages", updatedMessages)
                return { ...prevContext, [statename]: updatedMessages };
            } else {
                return { ...prevContext, [statename]: [data, ...prevDataChat] };
            }
        });
    }

    useEffect(() => {
        if (!profileData || socket.connected) {
            return;
        }

        // CONNECT SOCKET IO
        connect()

        const cleanup = setupSocketListeners(
            (id) => {
                console.log("disini connect id", id)
                setConnectionStatus({ status: 'connected', id });
                joinRoom(profileData['id']);
            },
            (err) => {
                console.log("disini error connect", err)
                // setError(err);
            }
        );

        // receive new message
        socket.on('receiveNotif', (data) => {
            receiveNotif(data)
        });

        // Fungsi cleanup untuk menonaktifkan listener ketika komponen dilepas
        return () => {
            cleanup();
        };
    }, [profileData])

    return (
        <SocketContext.Provider value={{ socket, connectionStatus }}>
            {children}
        </SocketContext.Provider>
    );
};
