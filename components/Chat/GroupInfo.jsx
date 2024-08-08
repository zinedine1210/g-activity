import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "context/MyProvider";
import { FaTimes, FaUsers, FaSignOutAlt, FaUserPlus } from 'react-icons/fa'
import CollectionData from "@repositories/CollectionData"

export const GroupInfo = ({ profileData, roomInfo, closePanel, handleLeaveGroup }) => {
    const [listMembers, setListMembers] = useState([])
    const context = useContext(MyContext)
    const statename = "dataRoom"

    const getDetailRoom = async () => {
        setListMembers(null)
        const result = await CollectionData.postData({ url: `chat-room/detail`, values: { "room_id": roomInfo['id'] } })
        setListMembers(result.data)
    }

    useEffect(() => {
        getDetailRoom()
    }, [roomInfo])

    const addMemberGroup = async cont => {
        context.setData({ ...context, modal: { name: "newgroup", type: "addgroupmember", data: roomInfo } })
    }


    return (
        <div className=" w-1/4 bg-white shadow-lg absolute right-0 h-full p-4 overflow-y-auto space-y-2">
            <div>
                <div className="flex items-center space-x-2">
                    <button onClick={closePanel} className="text-red-500 flex items-center">
                        <FaTimes className="text-zinc-600 text-xs" />
                    </button>
                    <h5 className="text-lg font-bold mb-0">Info Group</h5>
                </div>
                <div className='flex items-center space-x-2 p-2'>
                    <span className='w-10 h-10 shadow-md rounded-full flex items-center justify-center text-white font-bold text-lg uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                        <FaUsers className="text-zinc-600 text-lg" />
                    </span>
                    <div className='items-center'>
                        {roomInfo.label}
                    </div>
                </div>
            </div>
            {/* <p className="mb-4">{group.description}</p> */}
            <div>
                <h5 className="text-lg font-semibold">Members ({listMembers && listMembers.length})</h5>
                <ul className='space-y-0'>
                    <li key="addmember" className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10 p-2" onClick={addMemberGroup}>
                        <div>
                            <span className='w-8 h-8 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                                <FaUserPlus className="text-zinc-600 text-lg" />
                            </span>
                        </div>
                        <div>
                            Add Member
                        </div>
                    </li>
                    {listMembers && listMembers.map((member) => (
                        <li key={member.id} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10 p-2">
                            <div>
                                <span className='w-8 h-8 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                                    {member.username.charAt(0)}
                                </span>
                            </div>
                            <div>
                                {member.id == profileData.id ? "Anda" : member.username}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {
                roomInfo['is_leave'] != 1 ? <div className='flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10' onClick={handleLeaveGroup}>
                    <FaSignOutAlt className="text-zinc-600 text-lg" />
                    <span>
                        Leave Group
                    </span>
                </div> : null
            }
            {/* <h3 className="text-lg font-semibold mt-4 mb-2">Media, Links, and Docs</h3>
            <div className="flex flex-wrap">
                {group.media.map((media, index) => (
                    <img key={index} src={media.url} alt="Media" className="w-16 h-16 m-2" />
                ))}
            </div> */}
            {/* {isActiveModal && <ModalGroup statename={statename} />} */}
        </div>
    );
};