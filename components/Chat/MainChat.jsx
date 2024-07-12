import ChatCollection from "@repositories/ChatCollection";
import { Notify } from "@utils/scriptApp";
import { MyContext } from "context/MyProvider";
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react";
import { BsPlus, BsSearch, BsSend, BsTelephoneFill, BsX } from "react-icons/bs";
import CardFromMe from "./CardFromMe";
import CardFromContact from "./CardFromContact";
import HeaderMainChat from "./HeaderMainChat";
import ChatLoading from "@components/Templates/Loading/ChatLoading";

export default function MainChat({
  profileData
}) {
  const context = useContext(MyContext)
  const router = useRouter()
  const { roomId } = router.query;
  const statename = "dataChat"
  const containerRef = useRef(null);
  const [text, setText] = useState("")

  const getAllChat = async () => {
    const getxa = JSON.parse(localStorage.getItem("XA"))
    const result = await ChatCollection.getChatByRoomId({
      xa: getxa,
      roomId: roomId
    })
    console.log("panel list chat", result)
    if(result.status == 0){
      context.setData({ ...context, [statename]: result.data })
    }else Notify("Something went wrong when get all chat", "error")
  }
  const replyChat = context?.dataReply ?? null

  const handleSubmit = async e => {
    e.preventDefault()
    const getxa = JSON.parse(localStorage.getItem("XA"))
    if(!text) return false // kalau textnya kosong jangan dikirim
    let obj = {
      msg: text,
      room_id: roomId,
      type: 1
    }

    if(replyChat){
      let context = {
        id: replyChat.id ?? "" ,
        msg: replyChat.msg ?? "" ,
        type: replyChat.type ?? "" ,
        user_id: replyChat.user_id ?? ""
      }
      obj.context = context
    }

    const result = await ChatCollection.postChat({
      xa: getxa,
      data: obj
    })
    if(result.status == 0){
      context.dataChat.push(result.data)
      context.setData({ ...context, dataChat: context.dataChat, dataReply: null }) // push data baru ke mapping
      containerRef.current?.scrollIntoView({ behavior: "auto" }); // scroll kebawah
      setText("") // kosongkan lagi input editor
    }
  }

  const fetchNewMessage = async () => {
    const getxa = JSON.parse(localStorage.getItem("XA"))
        const currentTimestamp = new Date().toISOString();
        const result = await ChatCollection.fetchNewChatMessage({
            xa: getxa,
            data: {
                date: currentTimestamp,
                room_id: roomId
            }
        })
        if(result.status == 0){
          if(result.data.length > 0){
            result.data.forEach(async (el, index) => {
              if(context?.[statename]){
                const find = context[statename].find(res => res.id == el.id)
                if(!find) {
                  if(index == 0){
                    await ChatCollection.putIsRead({
                      xa: getxa,
                      data: {
                          room_id: roomId
                      }
                    })
                  }
                  context.setData({ ...context, [statename]: [ ...context[statename], el ]})
                }
              }
            });
          }
        }
  }

  useEffect(() => {
    if(roomId && !context[statename]) {
      getAllChat()
    }

    const intervalId = setInterval(() => {
      fetchNewMessage();
    }, 5000); // Interval set to 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [roomId, context[statename]])


  const groupByDay = (data) => {
    const groupedData = data.reduce((acc, curr) => {
        const date = new Date(curr._cd.epoch_time * 1000);
        const day = date.toISOString().split('T')[0]; // Dapatkan tanggal dalam format YYYY-MM-DD
    
        if (!acc[day]) {
        acc[day] = [];
        }
        acc[day].push(curr);
        return acc;
    }, {});
    
    return groupedData;
  };


  useEffect(() => {
    ScrollOnTop("auto")
  }, [context[statename]])


  const mapAllChat = () => {
    if(context?.[statename]){
      const sortdata = context[statename].sort((a, b) => a._cd.epoch_time - b._cd.epoch_time)
      const grouped = groupByDay(sortdata)
      return (
        Object.keys(grouped).map((day, index) => {
          return (
              <div className="w-full py-5">
                <div className="p-4 mb-4 text-sm text-teal-500 rounded-lg bg-teal-50 bg-opacity-50 backdrop-blur-sm dark:bg-gray-800 dark:text-blue-400 text-center" role="alert">
                  <h1 className="font-semibold">
                    {new Date(day).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h1>
                </div>
                <div className="space-y-4 mt-10">
                  {
                    grouped[day].map((item, key) => {
                      const isMe = item.user_id == profileData.id
                      item.isMe = isMe
                      
                      if(isMe) return <CardFromMe data={item} key={key}/>
                      else {
                        item.label = context?.dataDetailRoom?.label ?? "Searching"
                        return <CardFromContact data={item} key={key}/>
                      }
                    })
                  }
                </div>

              </div>
            )
          })
      )
    }else{
      return (
        <div className="w-full h-full flex items-center justify-center">
            <ChatLoading />
        </div>
      )
    }
  }

  const ScrollOnTop = (viewType) => {
    containerRef.current?.scrollIntoView({ behavior: viewType });
  }

  if(roomId){
    return (
      <div className="w-full xl:w-full h-screen overflow-y-hidden bg-zinc-300 image bg-cover bg-center" >
          <div className="flex-col flex h-full">
              <HeaderMainChat />
              
              <div className="w-full flex-1 overflow-y-auto space-y-4 px-10 py-5">
                {
                  mapAllChat()
                }
                <div ref={containerRef}></div>
              </div>
  
              <form onSubmit={(e) => handleSubmit(e)} className="pb-5 px-10">
                <div className="bg-white shadow-xl rounded-2xl w-3/4 mx-auto px-5 pb-2 pt-3">
                  {
                    replyChat && (
                      <div className="w-full border-s-4 border-green-500 rounded-md py-3 px-5 relative">
                        <h1 className="font-bold">{replyChat.isMe ? "You":replyChat.label}</h1>
                        <p className="text-sm">{replyChat?.msg}</p>
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={() => {context.setData({...context, dataReply: null}); ScrollOnTop("smooth")}}>
                          <BsX className="text-red-500 text-3xl"/>
                        </button>
                      </div>
                    )
                  }
                  <div className="flex items-center gap-2">
                    <button type="button" className="w-10 h-10 rounded-full hover:bg-blue-200 hover:rotate-180 transition-all ease-in-out duration-300 flex items-center justify-center">
                      <BsPlus className="text-3xl "/>
                    </button>
                    <div className="w-full relative">
                      <input value={text} type="text" onChange={(e) => setText(e.target.value)} className="peer w-full py-3 text-sm pl-2 pr-16 outline-none placeholder:text-zinc-500" placeholder="Type Here..." />
                      <button className="absolute top-1/2 -translate-y-1/2 right-0 w-16 flex items-center justify-center duration-300 ease-out peer-focus:visible peer-focus:opacity-100 opacity-0 peer-focus:rotate-45 invisible transition-all" type="submit">
                        <BsSend className="text-blue-500 text-2xl duration-300 hover:text-teal-500"/>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
          </div>
      </div>
    )
  }else{
    return (
    <div className="w-full xl:w-full h-screen overflow-y-hidden bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Gnusa Chat</h1>
        <p className="text-lg text-zinc-500">Click on a room to start a conversation</p>
      </div>
    </div>
    )
  }
}
