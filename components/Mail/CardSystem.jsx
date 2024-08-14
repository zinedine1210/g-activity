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
            const addedUsers = data.user_list.map(user => user.username).join(", ");
            return (
                <div>
                    <h1 className="font-semibold">{isMe ? "You" : data.username} added {addedUsers} to the group</h1>
                </div>
            );
        },
        4: () => {
            const removedUsers = data.user_list.map(user => user.username).join(", ");
            return (
                <div>
                    <h1 className="font-semibold">{isMe ? "You" : data.username} has removed {removedUsers} from the group</h1>
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
        <div className="px-4 py-3 w-full xl:w-1/2 mx-auto mb-4 text-sm rounded-lg bg-yellow-50 bg-opacity-50 backdrop-blur-sm dark:bg-gray-800 dark:text-blue-400 text-center" role="alert">
            {renderMessage()}
        </div>
    )
}
