import { BsChat, BsSearch } from "react-icons/bs";
import { FaAddressBook, FaEllipsisV, FaUsers } from "react-icons/fa";
import DropdownChat from "./DropdownChat";
import { useRouter } from "next/router";
import { Notify } from "@utils/scriptApp";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "context/MyProvider";
import ChatCollection from "@repositories/ChatCollection";
import { HiRefresh } from "react-icons/hi";
import { setupSocketListeners, connect, emit, checkErrorMsg } from "@utils/socketfunction"
import { socket } from '../../config/config-socket'
import notifyChat from '@components/Chat/NotifChat';
import ModalGroup from "./ModalGroup";

export default function PanelList({
    profileData,
    roomId
}) {
    const router = useRouter()
    const statename = "dataRoom"
    const context = useContext(MyContext)
    const [keyword, setKeyword] = useState("")
    const [timestamp, setTimestamp] = useState("")
    const intervalRef = useRef(null)

    // socket state
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [error, setError] = useState(null);



    const fetchNewMessageRoom = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        let currentTimestamp = ""
        if (timestamp == "") {
            const now = new Date().toISOString()
            setTimestamp(now)
            currentTimestamp = now
        } else {
            currentTimestamp = timestamp
        }
        const result = await ChatCollection.dataNewRoom({
            xa: getxa,
            data: {
                date: currentTimestamp
            }
        })
        if (result.status == 0) {
            // console.log(result, timestamp)
            if (result.data.length > 0) {
                const now = new Date();
                const timeInMillis = now.getTime();
                const newTimeInMillis = timeInMillis + 2000; // Tambahkan 2000 milidetik (2 detik)
                const newTime = new Date(newTimeInMillis);
                const isoString = newTime.toISOString();
                setTimestamp(isoString)
                result.data.forEach((el, index) => {
                    const find = JSON.parse(JSON.stringify(context[statename])).find(res => res.id == el.id)
                    if (find) { // kalau roomnya udah ada berarti cuma update msg
                        const filter = JSON.parse(JSON.stringify(context[statename])).filter(res => res.id != el.id)
                        let obj = {
                            last_msg: el.last_msg,
                            last_msg_uid: el.last_msg_uid,
                            last_msg_username: el.last_msg_username
                        }
                        const mergeObj = { ...find, ...obj }
                        context.setData({ ...context, [statename]: [mergeObj, ...filter] })
                    } else {
                        context.setData({ ...context, [statename]: [...context[statename], el] })
                    }
                });
            }
        }
    }

    const getAllRoom = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await ChatCollection.getRoom({
            xa: getxa
        })
        // console.log(result)
        if (result.status == 0) {
            context.setData({ ...context, [statename]: result.data })
            setTimestamp(new Date().toISOString())
        } else Notify("Something went wrong when get room")
    }

    useEffect(() => {
        if (!context[statename]) getAllRoom()
        console.log("ini ada lagi??")

        // intervalRef.current = setInterval(() => {
        //     if (context[statename]) fetchNewMessageRoom();
        // }, 2000); // Interval set to 5 seconds

        // // Cleanup interval on component unmount
        // return () => clearInterval(intervalRef.current);
    }, [context[statename]])

    let optionsChat = [
        {
            label: "All your contact",
            icon: <FaAddressBook className="text-zinc-600 text-lg" />,
            action: (value) => {
                router.push({
                    pathname: "/usr/chat/contact",
                    query: router.query
                }, undefined, { shallow: true })
            }
        },
        {
            label: "Refresh Room",
            icon: <BsChat className="text-zinc-600 text-lg" />,
            action: (value) => {

            }
        },
        {
            label: "Create Group",
            icon: <FaUsers className="text-zinc-600 text-lg" />,
            action: (value) => {
                // Notify("Action not found", "info")
                handleAddNewGroup()
            }
        },
    ]

    const handleStartChat = async item => {
        console.log("tess1234")
        // emit('join', { 'room_id': item.id }).then(callback => {
        //     console.log("adakah callback join ??", callback)
        //     // checkErrorMsg(callback)
        // })
        // const getxa = JSON.parse(localStorage.getItem("XA"))
        // await ChatCollection.putIsRead({
        //     xa: getxa,
        //     data: {
        //         room_id: item.id
        //     }
        // })
        // // context.setData({ ...context, dataChat: null, dataDetailRoom: null, dataReply: null }) // hapus semua data
        // if (intervalRef.current) {
        //     clearInterval(intervalRef.current);
        // }
        router.push(`/usr/chat?roomId=${item.id}`)
    }

    const handleAddNewGroup = async cont => {
        context.setData({ ...context, modal: { name: "newgroup", type: "create", data: cont } })
    }

    const mapDataRoom = () => {
        if (context[statename]) {
            const filterbykeyword = context[statename].filter(res => {
                const stringifydata = JSON.stringify(res)
                if (!stringifydata.toLowerCase().includes(keyword.toLowerCase())) return false
                return true
            })
            return (
                <div className="w-full">
                    <div className="space-y-1 mt-2 px-2">
                        {
                            filterbykeyword.length > 0 ? filterbykeyword.map((item, index) => {
                                return (
                                    <button onClick={() => handleStartChat(item)} className={`${item.id == roomId ? "bg-blue-50 border-blue-500" : "hover:bg-blue-500/10"} relative w-full text-start flex items-center gap-2 py-3 px-4 border-b p-2 transition-colors duration-300 rounded-md`} key={index}>
                                        <span className="w-10 h-10 uppercase rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-teal-600 to-teal-200">
                                            {
                                                item ? (item.type == 2 ? <FaUsers className="text-zinc-600 text-xl" /> : item.label.charAt(0))
                                                : null
                                            }

                                        </span>
                                        <div>
                                            <h1 className="font-semibold">{item?.label}</h1>
                                            <p className="text-sm text-zinc-500">{item?.last_msg.length > 20 ? item.last_msg.substring(0, 20) + "..." : item.last_msg ?? ""}</p>
                                        </div>
                                        <span className="absolute bottom-3 right-3 w-6 text-sm h-6 rounded-full bg-teal-100 text-teal-500 font-bold flex items-center justify-center">{item?.unread ? item.unread : 0}</span>
                                    </button>
                                )
                            })
                                :
                                <div className="text-center text-red-500 mt-5">
                                    <h1 className="font-bold">Room not found</h1>
                                </div>
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div className="space-y-2 px-2 mt-2">
                    {
                        new Array(10).fill("contact").map((load, index) => {
                            return (
                                <div key={index} className="h-20 w-full rounded-xl mt-1 bg-zinc-200 animate-pulse"></div>
                            )
                        })
                    }
                </div>
            )
        }
    }

    const isActiveModal = context?.modal?.name == "newgroup"
    return (
        <div className="w-full xl:w-full h-screen overflow-y-hidden">
            <div className="flex-col flex h-full">
                <header className="w-full border-b-2 border-blue-500 shadow-md px-2 py-2.5">
                    <div className="w-full flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <span className='w-10 h-10 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xl uppercase bg-gradient-to-br from-blue-600 to-blue-200'>
                                {profileData?.username?.charAt(0)}
                            </span>
                            <h1 className="font-bold">{profileData?.username}</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => router.push({
                                pathname: "/usr/chat/contact",
                                query: router.query
                            }, undefined, { shallow: true })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
                                <FaAddressBook className="text-blue-500 text-xl" />
                            </button>
                            <button onClick={() => context.setData({ ...context, dataRoom: null })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
                                <HiRefresh className="text-blue-500 text-xl" />
                            </button>
                            <DropdownChat options={optionsChat} label={<FaEllipsisV className="text-blue-500" />} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <BsSearch className="absolute top-1/2 -translate-y-1/2 left-3" />
                            <input type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="focus:bg-zinc-300 duration-300 rounded-md outline-none w-full py-3 pl-10 text-sm placeholder:text-zinc-500" placeholder="Search available room chat" />
                        </div>
                    </div>
                </header>

                <div className="w-full flex-1 overflow-y-auto space-y-2">
                    {
                        mapDataRoom()
                    }
                </div>
                {isActiveModal && <ModalGroup statename={statename} />}

                <footer className="">
                    {/* <button className="px-5 hover:bg-blue-200 py-3 text-sm w-full duration-300 ease-in-out font-semibold border-t-2 flex items-center gap-2 justify-center">
                    New Room
                </button> */}
                </footer>
            </div>
        </div>
    )
}


