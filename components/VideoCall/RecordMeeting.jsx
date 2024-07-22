import BlurToggle from '@components/Input/BlurToggle'
import MeetingRepository from '@repositories/MeetingRepository'
import { getTimeDate, timeUntil } from '@utils/function'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs'
import { FaEllipsisH } from 'react-icons/fa'

export default function RecordMeeting({
    data,
    tab,
    terakhir
}) {
    const context = useContext(MyContext)
    const router = useRouter()
    const [audience, setAudience] = useState(null)
    const recordMeeting = tab == 1 ? data : data?.meet

    const getAllAudience = async () => {
        const result = await MeetingRepository.getAudience({
            xa: JSON.parse(localStorage.getItem("XA")),
            id: recordMeeting.id,
            flag: 1
        })
        console.log(result)
    }


    // useEffect(() => {
    //     if(!audience) getAllAudience()
    // }, [audience])

    let statusIcon = {
        1: {
            1: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-zinc-500 gap-x-2 bg-zinc-200 dark:bg-gray-800">
                    Draft
                </div>,
            2: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-blue-500 gap-x-2 bg-blue-100 dark:bg-gray-800">
                    Ongoing
                </div>,
            3: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-green-500 gap-x-2 bg-green-200 dark:bg-gray-800">
                    Done
                </div>,
            4: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-red-500 gap-x-2 bg-red-200 dark:bg-gray-800">
                    Cancel
                </div>
        },
        2: {
            1: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-zinc-500 gap-x-2 bg-zinc-200 dark:bg-gray-800">
                    Not Started
                </div>,
            2: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-blue-500 gap-x-2 bg-blue-100 dark:bg-gray-800">
                    Ongoing
                </div>,
            3: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-green-500 gap-x-2 bg-green-200 dark:bg-gray-800">
                    Done
                </div>,
            4: <div className="inline px-5 py-2 text-sm font-bold rounded-full text-red-500 gap-x-2 bg-red-200 dark:bg-gray-800">
                    Cancel
                </div>
        }
    }

    const bulkOptions = [
        {
            label: "Delete",
            iconLabel: <BsTrash className='text-red-500' />,
            onClick: () => {
                Notify("Action not found", "info")
            }
        },
        {
            label: "Update",
            iconLabel: <BsPencil className='text-blue-500' />,
            onClick: (data) => {
                context.setData({ ...context, modal: { name: "modalMeeting", type: "update", data: data } })
            }
        },
        {
            label: "View",
            iconLabel: <BsEye className='text-blue-500' />,
            onClick: (data) => {
                context.setData({ ...context, modal: { name: "modalMeeting", type: "view", data: data } })
            }
        },
    ]

    const dataStatus = recordMeeting?.status ?? 0

    const handleStartMeeting = async () => {
        actionMeeting[tab][dataStatus]()
    }

    let actionMeeting = {
        1: {
            1: async () => {
                const result = await MeetingRepository.setStatusMeeting({
                    xa: JSON.parse(localStorage.getItem("XA")),
                    id: recordMeeting.id,
                    data: {
                        status: 2
                    }
                })
                if(result.status == 0){
                    const findIndex = context.dataMeeting[tab].findIndex(res => res.id == recordMeeting.id)
                    context.dataMeeting[tab][findIndex] = result.data
                    context.setData({ ...context, dataMeeting: context.dataMeeting })
                }else Notify("Something went wrong", "error")
                router.push(`/usr/videoCall/${recordMeeting.id}`)
            },
            2: async () => {
                router.push(`/usr/videoCall/${recordMeeting.id}`)
            },
            3: async () => {
                Notify("Meeting done", "info")
            }
        },
        2: {
            2: async () => {
                // const result = await MeetingRepository.setStatusAudience({
                //     xa: JSON.parse(localStorage.getItem("XA")),
                //     id: recordMeeting.id,
                //     data: {
                //         status: 1
                //     }
                // })
                // console.log(result)
                // if(result.status == 0){
                //     const findIndex = context.dataMeeting[tab].findIndex(res => res.id == recordMeeting.id)
                //     context.dataMeeting[tab][findIndex] = result.data
                //     context.setData({ ...context, dataMeeting: context.dataMeeting })
                // }else Notify("Something went wrong", "error")
    
                router.push(`/usr/videoCall/${recordMeeting.id}`)
            },
        }
    }

    const statusButton = {
        1: {
            1: {
                disabled: false,
                hidden: false,
                label: "Start Meeting"
            },
            2: {
                disabled: false,
                hidden: false,
                label: "Join Meeting"
            },
            3: {
                hidden: true
            },
            4: {
                hidden: true
            },
            5: {
                hidden: true
            }
        },
        2: {
            1: {
                hidden: true
            },
            2: {
                disabled: false,
                label: "Join"
            },
            3: {
                hidden: true
            },
            4: {
                hidden: true
            }
        }
    }


  return (
    <tr>
        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
            <h2 className="font-medium text-gray-800 dark:text-white ">{recordMeeting?.title}</h2>
        </td>
        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
            {statusIcon[tab][dataStatus]}
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
            <div>
                <p className="text-gray-500 dark:text-gray-400">{recordMeeting?.about}</p>
            </div>
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
            {recordMeeting?.passcode ? <BlurToggle data={recordMeeting.passcode}/> : ""}
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
            <div className="flex items-center">
                <img className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                <img className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                <img className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1256&q=80" alt=""/>
                <img className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">+4</p>
            </div>
        </td>

        <td className="px-4 py-4 text-sm whitespace-nowrap">
            {timeUntil((recordMeeting?.date?.epoch_time * 1000))}
        </td>

        <td className={`px-4 py-4 text-sm whitespace-nowrap flex items-center gap-2`}> 
            <SelectReusable terakhir={terakhir} data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            {
                !statusButton[tab][dataStatus].hidden && (
                    <button className='btn-primary' disabled={statusButton[tab][dataStatus].disabled} onClick={() => handleStartMeeting()}>
                        {statusButton[tab][dataStatus].label}
                    </button>
                )
            }
        </td>
    </tr>
  )
}

function SelectReusable({ terakhir=false, data, customCss="btn-primary inline-block", options, customAction=undefined, label="Label", position="left-0" }) {
    const dropRef = useRef(null)
    const [open, setOpen] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const classOpen = () => terakhir ? open ? "not-sr-only opacity-100" : "sr-only opacity-0" : open ? "absolute visible translate-y-0 opacity-100" : "absolute opacity-0 invisible translate-y-5"


  return (
    <div ref={dropRef} className="relative">
        <button onClick={() => setOpen(!open)} className={customCss}>
            {label}
        </button>
        <div role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1" className={`${classOpen()} max-h-52 overflow-y-auto w-full min-w-min transition-all duration-300 backdrop-blur-md top-full bg-white shadow-2xl border rounded-xl z-50 ${position} mt-1`}>
            {
                options && options.map((opt, index) => {
                    return (
                        <button id={index} onClick={() => customAction != undefined ? customAction(data) : opt.onClick(data)} className="py-2 px-4 w-full flex items-center gap-2 text-start text-sm transition-colors duration-300 hover:bg-blue-100 dark:hover:bg-blue-500 ">
                            {opt.iconLabel} {opt.label}
                        </button>
                    )
                })
            }
        </div>
    </div>
  )
}
