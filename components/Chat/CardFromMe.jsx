import { getTimeAgo } from "@utils/function";
import { useContext, useEffect, useRef, useState } from "react";
import { BsCheck, BsForward, BsReply, BsShare } from "react-icons/bs";
import { HiOutlineCheck } from "react-icons/hi";
import DropdownChat from "./DropdownChat";
import { FaEllipsisV } from "react-icons/fa";
import { Notify } from "@utils/scriptApp";
import { MyContext } from "context/MyProvider";
import { useRouter } from "next/router";

export default function CardFromMe({
    data
}) {
    const router = useRouter()
    const context = useContext(MyContext)
    let optionsChat = [
        {
            label: "Reply",
            icon: <BsReply className="text-zinc-600 text-lg"/>,
            action: (value) => {
                context.setData({ ...context, dataReply: data })
            }
        },
        {
            label: "Share",
            icon: <BsShare className="text-zinc-600 text-lg"/>,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
        {
            label: "Forward",
            icon: <BsForward className="text-zinc-600 text-lg"/>,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
    ]

    const isContext = data?.context ?? null

  return (
    <div className="w-full flex" id={data?.id}>
        <div className="flex items-start gap-2.5 ml-auto">
            <DropdownChat options={optionsChat} label={<FaEllipsisV className="text-zinc-500"/>} />
            <div className={`pt-3 pb-7 px-3 rounded-s-lg rounded-ee-lg bg-teal-500 text-white relative shadow-xl max-w-[500px] w-full ${isContext ? "min-w-72":"min-w-56"}`}>
                <p className="text-sm">{data?.msg}</p>
                {
                    isContext && (
                        <a href={`#${isContext.id}`} className="border-s-4 block border-teal-800 mt-2 bg-teal-100 w-full rounded-md p-3">
                            <h1 className="text-sm text-teal-800 capitalize font-bold">{isContext.user_id == data.user_id ? "You": context?.dataDetailRoom?.label}</h1>
                            <p className="text-zinc-600 text-sm">{isContext?.msg}</p>
                        </a>
                    )
                }
                <div className="absolute bottom-1 right-2 flex items-center gap-2">
                    <div className={`flex items-center ${data?.is_read && "text-blue-500"}`}>
                        <HiOutlineCheck className={`text-xl font-bold`}/>
                        <HiOutlineCheck className={`text-xl font-bold -ms-3.5`}/>
                    </div>
                    <p className="text-xs">{getTimeAgo(data?._cd?.epoch_time * 1000)}</p>
                </div>
            </div>
        </div>
    </div>
  )
}
