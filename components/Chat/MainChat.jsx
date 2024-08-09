import ChatCollection from "@repositories/ChatCollection";
import { Notify } from "@utils/scriptApp";
import { MyContext } from "context/MyProvider";
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react";
import { BsPlus, BsSend, BsX } from "react-icons/bs";
import CardFromMe from "./CardFromMe";
import CardFromContact from "./CardFromContact";
import CardSystem from "@components/Chat/CardSystem";
import HeaderMainChat from "./HeaderMainChat";
import { GroupInfo } from "@components/Chat/GroupInfo";
import { emit, on, connect, checkErrorMsg } from "@utils/socketfunction"
import { socket } from '../../config/config-socket'
import Swal from 'sweetalert2';

export default function MainChat({
  profileData,
  roomId
}) {
  const context = useContext(MyContext)
  const containerRef = useRef(null);
  const [text, setText] = useState("")
  const [timestamp, setTimestamp] = useState("")
  const [dataChat, setDataChat] = useState(null)
  const [roomInfo, setRoomInfo] = useState(null)
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);


  const getAllChat = async () => {
    const getxa = JSON.parse(localStorage.getItem("XA"))
    const result = await ChatCollection.getChatByRoomId({
      xa: getxa,
      roomId: roomId
    })
    if (result.status == 0) {
      setDataChat(result.data)
      setTimestamp(new Date().toISOString())
    } else Notify("Something went wrong when get all chat", "error")
  }

  const getThisRoom = async () => {
    const getxa = JSON.parse(localStorage.getItem("XA"))
    // await ChatCollection.putIsRead({
    //     xa: getxa,
    //     data: {
    //         room_id: roomId
    //     }
    // })

    let find = null
    if (context?.dataRoom) {
      find = context.dataRoom.find(res => res.id == roomId)
      if (find) {
        // Update context data dengan dataRoom yang telah diperbarui
        find.unread = 0
        const updatedDataRoom = context.dataRoom.map(room =>
          room.id == roomId ? { ...room, unread: find.unread } : room
        )
        context.setData({
          ...context,
          dataRoom: updatedDataRoom
        })
      }
    } else {
      const result = await ChatCollection.getRoom({
        xa: getxa
      })
      if (result.status == 0) {
        find = result.data.find(res => res.id == roomId)
        if (find) {
          // Update context data dengan dataRoom yang telah diperbarui
          find.unread = 0
          const updatedDataRoom = [find]
          context.setData({
            ...context,
            dataRoom: updatedDataRoom
          })
        }
      }
    }
    setRoomInfo(find)
  }

  const replyChat = context?.dataReply ?? null

  const handleSubmit = async e => {
    e.preventDefault()
    if (!text) return false // kalau textnya kosong jangan dikirim
    let obj = {
      msg: text,
      room_id: roomId,
      type: 1
    }

    if (replyChat) {
      let context = {
        id: replyChat.id ?? "",
        msg: replyChat.msg ?? "",
        type: replyChat.type ?? "",
        user_id: replyChat.user_id ?? ""
      }
      obj.context = context
    }

    setText("") // kosongkan lagi input editor
    if (roomInfo.type == 1) {
      // SEND MESSAGE PRIVATE
      emit("sendPrivateMsg", obj)
        .then(callback => {
          checkErrorMsg(callback)
        })
    } else {
      // SEND MESSAGE GROUP
      emit("sendGroupMsg", obj)
        .then(callback => {
          checkErrorMsg(callback)
        })
    }
  }

  const receiveMsg = (msg) => {
    if (msg['room_id'] == roomId) {
      setDataChat(prevDataChat => {
        return [...prevDataChat, msg];
      });
      context.setData({ ...context, dataReply: null })
      containerRef.current?.scrollIntoView({ behavior: "auto" }); // scroll kebawah
    }
  }

  const receiveRoomSystem = (msg) => {
    if (msg['room_id'] == roomId) {
      setDataChat(prevDataChat => {
        return [...prevDataChat, msg];
      });
      if (msg['user_list']) {
        const idExists = msg['user_list'].some(user => user.uid === profileData.id);
        if (idExists) {
          let isLeave = msg['system_type'] == 4? 1:0 
          setRoomInfo(prevRoomInfo => {
            prevRoomInfo['is_leave'] = isLeave
            return { ...prevRoomInfo };
          });
        }
      }
      context.setData({ ...context, dataReply: null })
      containerRef.current?.scrollIntoView({ behavior: "auto" }); // scroll kebawah 
    }
  }


  // join room
  const joinRoom = (newRoomId) => {
    emit('join', { 'room_id': newRoomId }).then(callback => {
      console.log("join room id success", callback)
      // checkErrorMsg(callback)
    })
  }

  // leave room
  const leaveRoom = (oldRoomId) => {
    socket.emit('leaveRoom', oldRoomId);
  };

  useEffect(() => {
    if (!roomInfo) {
      getThisRoom()
      getAllChat()

      // const getxa = JSON.parse(localStorage.getItem("XA"))
      // await ChatCollection.putIsRead({
      //     xa: getxa,
      //     data: {
      //         room_id: item.id
      //     }
      // })
      // // context.setData({ ...context, dataChat: null, dataDetailRoom: null, dataReply: null }) // hapus semua data

      // Leave room sebelumnya jika ada dan join room baru
      if (roomId) {
        leaveRoom(roomId);
      }
      joinRoom(roomId);

      // receive new private message
      socket.on('receiveMsg', (data) => {
        receiveMsg(data)
      });

      // receive new private message
      socket.on('receiveRoomSystem', (data) => {
        receiveRoomSystem(data)
      });

      // Cleanup saat komponen di-unmount atau roomId berubah
      return () => {
        if (roomId) {
          leaveRoom(roomId);
        }
        socket.off('receiveMsg');
      };
    }
  }, [roomId])


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
  }, [dataChat])


  const mapAllChat = () => {
    if (dataChat) {
      const sortdata = dataChat.sort((a, b) => a._cd.epoch_time - b._cd.epoch_time)
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
                    if (item.system) return <CardSystem data={item} key={key} roomInfo={roomInfo} isMe={isMe} />
                    else if (isMe) return <CardFromMe data={item} key={key} roomInfo={roomInfo} />
                    else {
                      item.label = roomInfo?.label ?? ""
                      return <CardFromContact data={item} key={key} roomInfo={roomInfo} />
                    }
                  })
                }
              </div>

            </div>
          )
        })
      )
    }
  }

  const ScrollOnTop = (viewType) => {
    containerRef.current?.scrollIntoView({ behavior: viewType });
  }

  const closeGroupInfo = () => {
    setIsGroupInfoOpen(false);
  };

  const openGroupInfo = () => {
    // open info group
    roomInfo.type == 2 && roomInfo['is_leave'] != 1 ? setIsGroupInfoOpen(true) : null
  };

  const leaveGroup = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will not be in this group",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Leave group
        let obj = {
          room_id: roomId
        }
        emit("leaveGroup", obj)
          .then(callback => {
            setRoomInfo(prevRoomInfo => {
              prevRoomInfo['is_leave'] = 1
              return { ...prevRoomInfo };
            });
            setIsGroupInfoOpen(false);
            leaveRoom(roomId)
          })
      }
    })
  };


  if (roomId && roomInfo) {
    return (
      <div className="w-full xl:w-full h-screen overflow-y-hidden bg-zinc-200 bg-cover bg-center" >
        <div className="flex-col flex h-full">
          <HeaderMainChat roomInfo={roomInfo} handleOpenInfo={openGroupInfo} />
          <div className="w-full flex-1 overflow-y-auto space-y-4 px-10 py-5">
            {
              mapAllChat()
            }
            <div ref={containerRef}></div>
          </div>
          {
            roomInfo && roomInfo['is_leave'] && roomInfo['is_leave'] == 1 ? <div className="flex items-center justify-center bg-gray-100">
              <div className="text-center p-4 bg-white shadow-lg rounded">
                <p className="text-lg font-semibold text-gray-700">
                  You are no longer a member of this group.
                </p>
              </div>
            </div> : <form onSubmit={(e) => handleSubmit(e)} className="pb-5 px-10">
              <div className="bg-white shadow-xl rounded-2xl w-3/4 mx-auto px-5 pb-2 pt-3">
                {
                  replyChat && (
                    <div className="w-full border-s-4 border-teal-500 bg-teal-50 rounded-md py-3 px-5 relative">
                      <h1 className="font-bold text-teal-500">{replyChat.isMe ? "You" : replyChat.label}</h1>
                      <p className="text-sm">{replyChat?.msg}</p>
                      <button type="button" className="absolute top-1/2 -translate-y-1/2 right-2" onClick={() => { context.setData({ ...context, dataReply: null }); ScrollOnTop("smooth") }}>
                        <BsX className="text-red-500 text-3xl" />
                      </button>
                    </div>
                  )
                }
                <div className="flex items-center gap-2">
                  <button type="button" className="w-10 h-10 rounded-full hover:bg-blue-200 hover:rotate-180 transition-all ease-in-out duration-300 flex items-center justify-center">
                    <BsPlus className="text-3xl " />
                  </button>
                  <div className="w-full relative">
                    <input value={text} type="text" onChange={(e) => setText(e.target.value)} className="peer w-full py-3 text-sm pl-2 pr-16 outline-none placeholder:text-zinc-500" placeholder="Type Here..." />
                    <button className="absolute top-1/2 -translate-y-1/2 right-0 w-16 flex items-center justify-center duration-300 ease-out peer-focus:visible peer-focus:opacity-100 opacity-0 peer-focus:rotate-45 invisible transition-all" type="submit">
                      <BsSend className="text-blue-500 text-2xl duration-300 hover:text-teal-500" />
                    </button>
                  </div>
                </div>
              </div>
            </form>}

          {isGroupInfoOpen && <GroupInfo closePanel={closeGroupInfo} roomInfo={roomInfo} profileData={profileData} handleLeaveGroup={leaveGroup} />}
        </div>
      </div>
    )
  } else {
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
