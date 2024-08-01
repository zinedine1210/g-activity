import { socket } from '../config/config-socket.js'
import { showToast } from "@utils/functionToast"

// EMIT FUNCTION 
export function emit(event, data) {
    const getxa = JSON.parse(localStorage.getItem("XA"))
    let emitData = {
        'xa': getxa,
        'data': data
      }
    return new Promise(resolve => {
        socket.emit(event, emitData,
            function (callback) {
                resolve(callback)
            });
    })
}

// ON CONNECT
export function connect() {
    console.group("ini connect socket")
    socket.connect(function (callback) {
        console.log("connect callback", callback)
        return callback
    });
}

// CHECK ERROR MSG
export function checkErrorMsg(callback) {
    // console.log("ini check error")
    // console.log(callback)
    if (callback['status'] == -1) {
        showToast({
            type: "error",
            text: "Terjadi Kesalahan Sistem"
        })
    }
    return
}

export function setupSocketListeners(onConnect, onError) {
    const handleConnect = () => {
        console.log("Connected to server with ID:", socket.id);
        if (onConnect) onConnect(socket.id);
    };

    const handleConnectError = (error) => {
        console.log("Connection error:", error);
        if (onError) onError(error);
    };

    const handleDisconnect = (reason) => {
        console.log("Disconnected:", reason);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    // Mengembalikan fungsi untuk menonaktifkan listener ketika komponen dilepas
    return () => {
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
    };
}