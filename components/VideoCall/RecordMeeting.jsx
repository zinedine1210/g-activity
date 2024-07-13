import SelectReusable from '@components/Admin/Partials/SelectReusable'
import { getTimeDate, timeUntil } from '@utils/function'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import Link from 'next/link'
import React, { useContext } from 'react'
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs'
import { FaEllipsisH } from 'react-icons/fa'

export default function RecordMeeting({
    data
}) {
    const context = useContext(MyContext)
    let statusIcon = {
        1: <div className="inline px-3 py-1 text-sm font-normal rounded-full text-zinc-500 gap-x-2 bg-zinc-200 dark:bg-gray-800">
            Draft
            </div>,
        2: <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-200 dark:bg-gray-800">
                Active
            </div>,
        3: <div className="inline px-3 py-1 text-sm font-normal rounded-full text-red-500 gap-x-2 bg-red-200 dark:bg-gray-800">
                Finish
            </div>,
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

  return (
    <tr>
        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
            <h2 className="font-medium text-gray-800 dark:text-white ">{data?.title}</h2>
        </td>
        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
            {statusIcon[data?.status]}
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
            <div>
                <p className="text-gray-500 dark:text-gray-400">{data?.about}</p>
            </div>
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
            {timeUntil((data?.date?.epoch_time * 1000) - (7 * 60 * 60 * 1000))}
        </td>

        <td className="px-4 py-4 text-sm whitespace-nowrap flex items-center gap-2">
            <SelectReusable data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            <Link href={`/usr/videoCall/${data.id}`}>
                <button className='btn-primary'>
                    Start Meeting
                </button>
            </Link>
        </td>
    </tr>
  )
}
