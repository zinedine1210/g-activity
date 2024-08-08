import { useContext, useEffect, useRef, useState } from "react";

export default function CardSystem({
    data,
    roomInfo,
    isMe
}) {
    const systemMessages = {
        1: () => (
            <h1 className="font-semibold">{isMe ? "You" : data.username} {data.msg}</h1>
        ),
        2: () => (
            <h1 className="font-semibold">{isMe ? "You" : data.username} {data.msg}</h1>
        ),
        3: () => {
            const addedUsers = data.user_added.map(user => user.username).join(", ");
            return (
                <div>
                    <h1 className="font-semibold">{isMe ? "You" : data.username} added {addedUsers} to the group</h1>
                </div>
            );
        },
    };
    const renderMessage = systemMessages[data.system_type] || (() => (
        <div>
            <h1>Default</h1>
        </div>
    ));
    return (
        <div className="p-4 mb-4 text-sm text-teal-200 rounded-lg bg-green-700 bg-opacity-80 backdrop-blur-sm dark:bg-gray-800 dark:text-blue-400 text-center" role="alert">
            {renderMessage()}
        </div >
    )
}
