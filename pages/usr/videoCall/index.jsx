import React, { useContext, useState } from 'react'
import Layout2 from '../../../components/Layouts/Layout2'
import { MyContext } from 'context/MyProvider'
import TableMeeting from '@components/VideoCall/TableMeeting'
import ModalCreateMeeting from '@components/VideoCall/ModalCreateMeeting'

export default function VideoCall(props) {
    const context = useContext(MyContext)

    const isModal = context?.modal?.name == "modalMeeting"
    
  return (
    <Layout2 title={"Video Call"} desc={"Halaman Video Call"} profileData={props.profileData}>
        <section className="min-h-screen px-10 py-5" >
            {
                isModal && <ModalCreateMeeting />
            }
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Meeting History</h2>

                        {/* <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{context.dateMeeting} history</span> */}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Starting meetings is easy and managed in GActivity</p>
                </div>

                <div className="flex items-center mt-4 gap-x-3">

                    <button onClick={() => context.setData({ ...context, modal: { name: "modalMeeting", type: "create" }})}  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <span>Create Meeting</span>
                    </button>
                </div>
            </div>

            <TableMeeting />
           
        </section>
    </Layout2>
  )
}
