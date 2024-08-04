import { getTimeAgo } from '@utils/function';
import { MyContext } from 'context/MyProvider';
import React, { useContext, useEffect, useRef, useState } from 'react'
import DropdownChat from './DropdownChat';
import { FaEllipsisV } from 'react-icons/fa';
import { BsForward, BsReply, BsShare } from 'react-icons/bs';
import { Notify } from '@utils/scriptApp';

export default function CardFromContact({
    data,
    roomInfo
}) {
    const [open, setOpen] = useState(false);
    const context = useContext(MyContext)
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    let optionsChat = [
        {
            label: "Reply",
            icon: <BsReply className="text-zinc-600 text-lg" />,
            action: (value) => {
                context.setData({ ...context, dataReply: data })
            }
        },
        {
            label: "Share",
            icon: <BsShare className="text-zinc-600 text-lg" />,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
        {
            label: "Forward",
            icon: <BsForward className="text-zinc-600 text-lg" />,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
    ]

    const isContext = data?.context ?? null

    return (
        <div className="flex items-start gap-2.5">
            <span className='w-10 h-10 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xl uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                {/* {dataContact?.label.charAt(0)} */}
                {console.log("data bang", data)}
                {roomInfo.type == 2 ? roomInfo.label.charAt(0) : data?.label.charAt(0)}
            </span>
            <div className={`pt-3 pb-7 px-3 bg-white leading-1.5 text-white relative shadow-xl max-w-[500px] ${isContext ? "min-w-72" : "min-w-56"} rounded-e-xl rounded-es-xl`}>
                {roomInfo.type == 2 ? <span className="text-sm font-semibold text-gray-900 dark:text-white">{data?.username}</span> : null}
                {
                    isContext && (
                        <a href={`#${isContext.id}`} className="border-s-4 block border-teal-800 mt-2 bg-teal-100 w-full rounded-md p-3">
                            <h1 className="text-teal-800 capitalize font-bold text-sm">
                                {/* {isContext.user_id == data.user_id ? "You" : context?.dataDetailRoom?.label} */}
                                {isContext.user_id == data.user_id ? "You" : (roomInfo?.type === 2 ? data.username : roomInfo?.label)}
                            </h1>
                            <p className="text-zinc-600 text-sm">{isContext?.msg}</p>
                        </a>
                    )
                }
                <p className="text-sm font-normal py-1.5 text-gray-900 dark:text-white">{data?.msg}</p>
                <div className="absolute bottom-1 right-2 flex items-center gap-2 text-black">
                    <p className="text-xs">{getTimeAgo(data?._cd?.epoch_time * 1000)}</p>
                </div>
            </div>
            <DropdownChat options={optionsChat} label={<FaEllipsisV className="text-zinc-500" />} position={"top-full left-0"} />

        </div>
    )
}
