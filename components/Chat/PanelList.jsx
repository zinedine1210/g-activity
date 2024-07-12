import { BsChat, BsSearch } from "react-icons/bs";
import { FaAddressBook, FaEllipsisV, FaUsers } from "react-icons/fa";
import DropdownChat from "./DropdownChat";
import { useRouter } from "next/router";
import { Notify } from "@utils/scriptApp";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "context/MyProvider";
import ChatCollection from "@repositories/ChatCollection";

export default function PanelList({
    profileData
}) {
    const router = useRouter()
    const { roomId } = router.query;
    const statename = "dataRoom"
    const context = useContext(MyContext)
    const [keyword, setKeyword] = useState("")

    const fetchNewMessageRoom = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const currentTimestamp = new Date().toISOString();
        const result = await ChatCollection.dataNewRoom({
            xa: getxa,
            data: {
                date: currentTimestamp
            }
        })
        if(result.status == 0){
            // console.log(result.data, context[statename])
            result.data.forEach(el => {
                const find = context[statename].find(res => res.id == el.id)
                // console.log(find)
                if(find){ // kalau roomnya udah ada berarti cuma update msg
                    const filter = context[statename].filter(res => res.id != el.id)
                    let obj = {
                        last_msg: el.last_msg,
                        last_msg_uid: el.last_msg_uid,
                        last_msg_username: el.last_msg_username
                    }
                    const mergeObj = { ...find, ...obj }
                    context.setData({ ...context, [statename]: [ mergeObj, ...filter ] })
                }else{
                    context.setData({ ...context, [statename]: [ ...context[statename], el ]})
                }
            });
        }
    }
    
    const getAllRoom = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await ChatCollection.getRoom({
            xa: getxa
        })
        // console.log(result)
        if(result.status == 0){
            context.setData({ ...context, [statename]: result.data })
        }else Notify("Something went wrong when get room")
    }

    useEffect(() => {
        if(!context?.[statename]) getAllRoom()

        const intervalId = setInterval(() => {
            fetchNewMessageRoom();
        }, 5000); // Interval set to 5 seconds
      
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [context[statename]])

    let optionsChat = [
        {
            label: "All your contact",
            icon: <FaAddressBook className="text-zinc-600 text-lg"/>,
            action: (value) => {
                router.push({
                    pathname: "/usr/chat/contact",
                    query: router.query
                }, undefined, {shallow: true})
            }
        },
        {
            label: "Refresh Room",
            icon: <BsChat className="text-zinc-600 text-lg"/>,
            action: (value) => {

            }
        },
        {
            label: "Create Group",
            icon: <FaUsers className="text-zinc-600 text-lg"/>,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
    ]

    const handleStartChat = async item => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, roomId: item.id }
        }, undefined, { shallow: true })
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await ChatCollection.putIsRead({
            xa: getxa,
            data: {
                room_id: item.id
            }
        })
        console.log(result)
        context.setData({ ...context, dataChat: null, dataDetailRoom: null }) // hapus semua data
    }

    const mapDataRoom = () => {
        if(context[statename]){
            const filterbykeyword = context[statename].filter(res => {
                const stringifydata = JSON.stringify(res)
                if(!stringifydata.toLowerCase().includes(keyword.toLowerCase())) return false
                return true
            })
            return (
                <div className="w-full">
                    <div className="space-y-1 mt-2 px-2">
                        {
                            filterbykeyword.length > 0 ? filterbykeyword.map((item, index) => {
                                return (
                                    <button onClick={() => handleStartChat(item)} className={`${item.id == roomId ? "bg-blue-50 border-blue-500":"hover:bg-blue-500/10"} relative w-full text-start flex items-center gap-2 py-3 px-4 border-b p-2 transition-colors duration-300 rounded-md`} key={index}>
                                        <span className="w-10 h-10 uppercase rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-teal-600 to-teal-200">{item?.label.charAt(0)}</span>
                                        <div>
                                            <h1 className="font-semibold">{item?.label}</h1>
                                            <p className="text-sm text-zinc-500">{item?.last_msg.length > 20 ? item.last_msg.substring(0, 20)+"..." : item.last_msg ?? ""}</p>
                                        </div>
                                        <span className="absolute bottom-3 right-3 w-6 text-sm h-6 rounded-full bg-teal-100 text-teal-500 font-bold flex items-center justify-center">{item?.unread ?? 0}</span>
                                    </button>
                                )
                            })
                            :
                            <div className="text-center text-red-500">
                                <h1>Room not found</h1>
                            </div>
                        }
                    </div>
                </div>
            )
        }else{
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

  return (
    <div className="w-full xl:w-full h-screen overflow-y-hidden">
        <div className="flex-col flex h-full">
            <header className="w-full border-b-2 border-blue-500 shadow-md px-2 py-2.5">
                <div className="flex items-center gap-2">
                    <div className="relative w-full">
                        <BsSearch className="absolute top-1/2 -translate-y-1/2 left-3"/>
                        <input type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="outline-none w-full py-3 pl-10 text-sm placeholder:text-zinc-500" placeholder="Search available room chat" />
                    </div>
                    <div className="flex items-center gap-1">
                        <DropdownChat options={optionsChat} label={<FaEllipsisV className="text-blue-500"/>} />
                    </div>
                </div>
            </header>
            
            <div className="w-full flex-1 overflow-y-auto space-y-2">
                {
                    mapDataRoom()
                }
            </div>

            <footer className="">
                {/* <button className="px-5 hover:bg-blue-200 py-3 text-sm w-full duration-300 ease-in-out font-semibold border-t-2 flex items-center gap-2 justify-center">
                    New Room
                </button> */}
            </footer>
        </div>
    </div>
  )
}


