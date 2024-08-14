import React, { useContext, useState, useEffect } from 'react'
import MeetingRepository from '@repositories/MeetingRepository'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import RecordAccount from '@components/Mail/Account/RecordAccount'
import { useRouter } from 'next/router'
import CollectionData from "@repositories/CollectionData"

export default function TableMailAccount({

}) {
    const router = useRouter()
    const context = useContext(MyContext)
    const statename = "dataMailAccount"
    const [keyword, setKeyword] = useState("")
    const [providerOptions, setProviderOptions] = useState([])


    const dataList = context?.[statename] ?? {}

    const getDataAccountMail = async () => {
        const result = await CollectionData.getData({ url: `mail_account` })
        if (result.status == 0) {
            context.setData({ ...context, [statename]: result.data })
        } else Notify("Something went wrong", 'error')
    }

    useEffect(() => {
        if (!context[statename]) {
            getDataAccountMail()
        }
    }, [context[statename]])

    const fetchComponent = () => Object.keys(dataList).length > 0 && dataList?.map((item, key) => {
        return <RecordAccount key={key} data={item} />
    })

    return (
        <>
            <div className='relative'>
                <div className="flex flex-col mt-6 relative">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-y-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <button className="flex items-center gap-x-3 focus:outline-none">
                                                    <span>Name</span>
                                                </button>
                                            </th>
                                            
                                            <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Email
                                            </th>

                                            <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                IMAP
                                            </th>

                                            <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                SMTP
                                            </th>
                                            <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Storage
                                            </th>
                                            <th scope="col" className="relative py-3.5 px-4">
                                                <span className="sr-only">Bulk Action</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 border border-red-500">
                                        {fetchComponent()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
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
            </div> */}
            </div>
        </>
    )
}
