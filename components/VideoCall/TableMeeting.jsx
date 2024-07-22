import MeetingRepository from '@repositories/MeetingRepository'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import React, { useContext, useEffect, useState } from 'react'
import RecordMeeting from './RecordMeeting'
import { useRouter } from 'next/router'

export default function TableMeeting({
    
}) {
    const router = useRouter()
    const { tabMeeting } = router.query
    const context = useContext(MyContext)
    const statename = "dataMeeting"
    const [keyword, setKeyword] = useState("")
    const [tab, setTab] = useState(1)

    const getAllVideoCall = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await MeetingRepository.getMeeting({
            xa: getxa
        })
        const inviteResult = await MeetingRepository.getInvitationAudience({
            flag: 1,
            xa: getxa
        })
        let obj = {
            1: result.data,
            2: inviteResult.data
        }
        if(result.status == 0 && inviteResult.status == 0){
            context.setData({ ...context, [statename]: obj })
        }else Notify("Something went wrong", 'error')
    }

    const handleTab = (value) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tabMeeting: value }
        }, undefined, { shallow: true })
        setTab(value)
    }

    useEffect(() => {
        if(!tabMeeting){
            router.push({ pathname: router.pathname, query: { ...router.query, tabMeeting: 1 }}, undefined, { shallow: true })
            setTab(1)
        }else{
            setTab(tabMeeting)
        }

        if(!context[statename]?.['1']){
            getAllVideoCall()
        }
    }, [context[statename], tabMeeting])

    const dataList = context?.[statename] ?? {}

    const fetchComponent = () => Object.keys(dataList).length > 0 && dataList?.[tab].sort((a, b) => b?._cd?.epoch_time - a?._cd?.epoch_time)
                                .filter(res => {
                                    const stringifydata = JSON.stringify(res)
                                    if(!stringifydata.toLowerCase().includes(keyword.toLowerCase())) return false
                                    return true
                                })
                                .map((item, key) => {
                                    const isTerakhir = key + 1 == dataList?.[tab].length || key + 1 == dataList?.[tab].length - 1 ;
                                    return <RecordMeeting terakhir={isTerakhir} tab={tab} key={key} data={item} />
                                })
    
  return (
    <>
        <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                <button onClick={() => handleTab(1)} className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${tab == 1 ? "bg-gray-200":"hover:bg-gray-200"}`}>
                    My Own
                </button>
                <button onClick={() => handleTab(2)} className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 ${tab == 2 ? "bg-gray-200":"hover:bg-gray-200"}`}>
                    Invited
                </button>
            </div>

            <div className="relative flex items-center mt-4 md:mt-0">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </span>

                <input type="text" onChange={e => setKeyword(e.target.value)} placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
            </div>
        </div>
        <div className='relative'>
            <div className="flex flex-col mt-6 relative">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-y-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>Meeting Title</span>
                                            </button>
                                        </th>

                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Status
                                        </th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            About
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Passcode
                                        </th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Audiences</th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Start</th>

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Bulk Action</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 border border-red-500">
                                    { fetchComponent() }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page <span className="font-medium text-gray-700 dark:text-gray-100">1 of 10</span> 
                </div>

                <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
                    <a href="#" className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>

                        <span>
                            previous
                        </span>
                    </a>

                    <a href="#" className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                        <span>
                            Next
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </>
  )
}
