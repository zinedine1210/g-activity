import CollectionData from '@repositories/CollectionData'
import { MyContext } from 'context/MyProvider'
import React, { useContext, useEffect } from 'react'
import { BsTrash } from 'react-icons/bs';
import { FaTimes, FaUser } from 'react-icons/fa'
import { MdBlock } from "react-icons/md";

export default function PersonalInfo({ profileData, roomInfo, closePanel }) {
    const context = useContext(MyContext)
    const statename = "dataRoom"

    const getDetailRoom = async () => {
        const result = await CollectionData.postData({ url: `chat-room/detail`, values: { "room_id": roomInfo['id'] } })
        context.setData(prevData => ({
            ...prevData,
            memberGroup: result.data
        }));
        console.log(result.data)
    }

    useEffect(() => {
        getDetailRoom()
        console.log(roomInfo)
    }, [roomInfo])

  return (
    <div className="w-1/2 bg-white flex flex-col border-s">
            <div>
                <div className="flex items-center space-x-2 border-b py-4 px-5 justify-between">
                    <h5 className="text-lg font-bold mb-0">Info Personal</h5>
                    <button onClick={closePanel} className="text-red-500 flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-100 duration-300 ease-in-out">
                        <FaTimes className="text-zinc-600" />
                    </button>
                </div>
                <div className='text-center mx-auto'>
                    <span className='w-full h-56 mx-auto flex items-center justify-center text-white font-bold text-lg uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                        <FaUser className="text-teal-600 text-9xl" />
                    </span>
                    <div className='items-center text-2xl font-bold py-5'>
                        {roomInfo.label}
                    </div>
                </div>
            </div>

            <div className='border-y py-2 px-5 h-full'>
                <h1 className='font-semibold text-zinc-500'>Description</h1>
                <p className='text-sm mt-1'>Hallo there!! I use g-activity chat</p>
            </div>
            <footer>
                <button className='w-full text-start px-5 py-3 duration-300 ease-in-out text-sm flex items-center justify-between text-red-500 bg-red-50 hover:bg-red-100'>
                    Blokir {roomInfo.label}
                    <MdBlock />
                </button>
                <button className='w-full text-start px-5 py-3 duration-300 ease-in-out text-sm flex items-center justify-between text-red-500 bg-red-50 hover:bg-red-100'>
                    Hapus Chat
                    <BsTrash />
                </button>
            </footer>
        </div>
  )
}
