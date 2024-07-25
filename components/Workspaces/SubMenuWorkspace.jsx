import { useWorkspaces } from '@utils/swr'
import Link from 'next/link'
import React from 'react'
import { BsGrid, BsGridFill } from 'react-icons/bs'
import { FaMoneyBill } from 'react-icons/fa'

export default function SubMenuWorkspace() {
    const dataMyWorkspace = useWorkspaces(1, JSON.parse(localStorage.getItem("XA")))
    const dataShareWorkspace = useWorkspaces(2, JSON.parse(localStorage.getItem("XA")))
    console.log(dataShareWorkspace)
  return (
    <div className='px-5 flex-col flex h-full'>
        <div className='flex-1 overflow-y-auto space-y-5'>
            <div>
                <h1 className='font-bold text-xl'>Your own workspace(s)</h1>
                <div className='mt-3'>
                    {
                        dataMyWorkspace ? dataMyWorkspace.data.data.length > 0 ? dataMyWorkspace.data.data.map((item, index) => {
                            return (
                                <Link href={`/usr/workspaces/${item.name}?id=${item.id}&tabProject=shareProject`}>
                                    <button className='w-full mb-2 text-start py-2 px-3 relative rounded-md overflow-hidden bg-gradient-to-tr from-blue-500 via-sky-400 to-blue-500 text-white' key={index}>
                                        <h1 className='font-bold'>{item.name}</h1>
                                        <p className='text-sm'>{item?.description ? item.description.substring(0, 20) :"----"}</p>
                                        <BsGridFill className='absolute rotate-12 opacity-10 -top-3 right-2 text-white text-7xl'/>
                                    </button>
                                </Link>
                            )
                        })
                        :
                        <h1 className='w-full bg-zinc-300 py-2 text-center'>
                            Not found
                        </h1>
                        :
                        <div role="status" className="w-full py-2">
                            <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    }
                </div>
            </div>
            <div>
                <h1 className='font-bold text-xl'>Share with you</h1>
                <div className='mt-3'>
                    {
                        dataShareWorkspace ? dataShareWorkspace.data.data.length > 0 ? dataShareWorkspace.data.data.map((item, index) => {
                            return (
                                <Link href={`/usr/workspaces/${item.name}?id=${item.id}&tabProject=shareProject`}>
                                    <button className='w-full mb-2 text-start py-2 px-3 relative rounded-md overflow-hidden bg-gradient-to-tr from-zinc-700 via-gray-600 to-zinc-700 text-white' key={index}>
                                        <h1 className='font-bold'>{item.name}</h1>
                                        <p className='text-sm'>{item?.description ? item.description.substring(0, 20) : "----"}</p>
                                        <BsGridFill className='absolute rotate-12 opacity-10 -top-3 right-2 text-white text-7xl'/>
                                    </button>
                                </Link>
                            )
                        })
                        :
                        <h1 className='w-full bg-zinc-300 py-2 text-center'>
                            Not found
                        </h1>
                        :
                        <div role="status" className="w-full py-2">
                            <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
