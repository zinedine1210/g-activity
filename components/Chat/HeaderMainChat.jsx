import ChatCollection from '@repositories/ChatCollection'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { BsSearch, BsTelephoneFill } from 'react-icons/bs'
import { FaVideo } from 'react-icons/fa'

export default function HeaderMainChat({
  roomInfo
}) {

  return (
    <header className="w-full py-2.5 px-10 shadow-xl bg-white flex items-center justify-between">
        <div className='flex items-center gap-5'>
            <span className='w-10 h-10 shadow-md rounded-full flex items-center justify-center text-white font-bold text-xl uppercase bg-gradient-to-br from-teal-600 to-teal-200'>
                {roomInfo?.label.charAt(0)}
            </span>
            <div>
                <h1 className='font-bold'>{roomInfo?.label}</h1>
                <span className='flex items-center text-sm font-semibold'>
                    <span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>
                    Online
                </span>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => router.push({ pathname: `/usr/chat`, query: router.query }, undefined, { shallow: true })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
            <BsSearch className="text-zinc-600 text-xl" />
            </button>
            <button onClick={() => router.push({ pathname: `/usr/chat`, query: router.query }, undefined, { shallow: true })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
            <BsTelephoneFill className="text-zinc-600 text-xl" />
            </button>
            <button onClick={() => router.push({ pathname: `/usr/chat`, query: router.query }, undefined, { shallow: true })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
            <FaVideo className="text-zinc-600 text-xl" />
            </button>
        </div>
    </header>
  )
}
