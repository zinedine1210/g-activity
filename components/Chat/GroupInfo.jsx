import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "context/MyProvider";
import { FaTimes, FaUsers, FaSignOutAlt, FaUserPlus } from 'react-icons/fa'
import { emit } from "@utils/socketfunction"
import CollectionData from "@repositories/CollectionData"
import Swal from "sweetalert2";

export const GroupInfo = ({ profileData, roomInfo, closePanel, handleLeaveGroup }) => {
    const [listMembers, setListMembers] = useState([])
    const context = useContext(MyContext)
    const statename = "dataRoom"

    const getDetailRoom = async () => {
        setListMembers(null)
        const result = await CollectionData.postData({ url: `chat-room/detail`, values: { "room_id": roomInfo['id'] } })
        context.setData(prevData => ({
            ...prevData,
            memberGroup: result.data
        }));

    }

    useEffect(() => {
        getDetailRoom()
    }, [roomInfo])

    useEffect(() => {
        setListMembers(context.memberGroup);
    }, [context.memberGroup]);


    const addMemberGroup = async cont => {
        context.setData({ ...context, modal: { name: "newgroup", type: "addgroupmember", data: roomInfo } })
    }

    const kickMemberGroup = async cont => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to kick this member from the group",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Kick member group
                let obj = {
                    room_id: roomInfo['id'],
                    member: [{
                        uid: cont['id'],
                        username: cont['username']
                    }]
                }
                emit("kickGroupMember", obj)
                    .then(callback => {
                        const updatedMembers = listMembers.filter(member =>
                            !obj['member'].some(memberToKick => memberToKick.uid === member.id)
                        );
                        context.setData(prevData => ({
                            ...prevData,
                            memberGroup: updatedMembers,
                        }));

                    })
            }
        })
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
                    {
                        profileData.id == roomInfo._cb && <li key="addmember" className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10 p-2" onClick={addMemberGroup}>
                            <div>
                                <span className='w-8 h-8 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                                    <FaUserPlus className="text-zinc-600 text-lg" />
                                </span>
                            </div>
                            <div>
                                Add Member
                            </div>
                        </li>}

                    {listMembers && listMembers.map((member) => (
                        <li key={member.id} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10 p-2">
                            <div>
                                <span className='w-8 h-8 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                                    {member.username.charAt(0)}
                                </span>
                            </div>
                            <div className='flex-grow'>
                                {member.id == profileData.id ? "Anda" : member.username}
                            </div>
                            {
                                profileData.id == roomInfo._cb && profileData.id != member.id ? <div className="ml-auto">
                                    <button className="disabled:bg-zinc-600 bg-red-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold" onClick={() => kickMemberGroup(member)}>
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Kick
                                    </button>
                                </div> : null
                            }
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