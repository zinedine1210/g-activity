import BlurToggle from '@components/Input/BlurToggle'
import MeetingRepository from '@repositories/MeetingRepository'
import { getTimeDate, timeUntil } from '@utils/function'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs'
import { FaEllipsisH } from 'react-icons/fa'
import Swal from 'sweetalert2'
import CollectionData from "@repositories/CollectionData"

export default function RecordAccount({
    data
}) {
    const context = useContext(MyContext)
    const router = useRouter()
    const [audience, setAudience] = useState(null)
    const recordAccountMail = data

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
        // {
        //     label: "Update",
        //     iconLabel: <BsPencil className='text-blue-500' />,
        //     onClick: (data) => {
        //         context.setData({ ...context, modal: { name: "modalMailCreateAccount", type: "update", data: data } })
        //     }
        // },
        {
            label: "Delete",
            iconLabel: <BsTrash className='text-red-500' />,
            onClick: (data) => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const result = await CollectionData.deleteData({ url: `mail_account/${data.id}`, values: [data.id] })
                        if (result.status == 0) {
                            const filteredData = context.dataMailAccount.filter(el => el.id !== data.id);

                            context.setData({
                                ...context,
                                dataMailAccount: filteredData,
                                modal: null
                            });
                            Notify("Deleted", "info")
                        } else Notify("Something went wrong", "error")
                    } 
                })
            }
        }
    ]

    const dataStatus = recordAccountMail?.status ?? 0


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
                <h2 className="font-medium text-gray-800 dark:text-white ">{recordAccountMail?.name}</h2>
            </td>
            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                <p className="text-gray-500 dark:text-gray-400">{recordAccountMail?.username}</p>
            </td>
            <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                <p className="text-gray-500 dark:text-gray-400">{recordAccountMail?.imap}</p>
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <p className="text-gray-500 dark:text-gray-400">{recordAccountMail?.smtp}</p>
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <p className="text-gray-500 dark:text-gray-400">{recordAccountMail?.storage_usage} / {recordAccountMail?.storage_limit}</p>
            </td>

            <td className={`px-4 py-4 text-sm flex items-center gap-2 w-20`}>
                <SelectReusable data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            </td>
        </tr>
    )
}

function SelectReusable({ data, customCss = "btn-primary inline-block", options, customAction = undefined, label = "Label", position = "left-0" }) {
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

    const classOpen = () => open ? "not-sr-only opacity-100" : "absolute opacity-0 invisible translate-y-5 sr-only"

    return (
        <div ref={dropRef} className="relative">
            <button onClick={() => setOpen(!open)} className={customCss}>
                {label}
            </button>
            <div role="menu" aria-orientation="vertical" aria-labelledby="menu-button" className={`${classOpen()} max-h-52 overflow-y-auto w-full min-w-min transition-all duration-300 backdrop-blur-md top-full bg-white shadow-2xl border rounded-xl z-50 ${position} mt-1`}>
                {
                    options && options.map((opt, index) => {
                        return (
                            <button key={index} id={index} onClick={() => customAction != undefined ? customAction(data) : opt.onClick(data)} className="py-2 px-4 w-full flex items-center gap-2 text-start text-sm transition-colors duration-300 hover:bg-blue-100 dark:hover:bg-blue-500 ">
                                {opt.iconLabel} {opt.label}
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}
