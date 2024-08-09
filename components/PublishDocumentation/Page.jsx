import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { BsChevronDown, BsChevronRight } from 'react-icons/bs'

export default function Page({ page }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { docId, pageId } = router.query

    const handleRoute = () => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, pageId: page.id }
        }, undefined, { shallow: true })
    }

    const isPage = pageId == page.id
  return (
    <div className={`w-full`}>
        <div className={`${page.pid != "ortu" ? isPage ? " border-blue-500 border-s-2": "border-zinc-300 border-s" : ""} flex items-center justify-between py-1 px-5 text-start w-full`}>
            <button onClick={() => handleRoute()} type='button'><h1 className='hover:text-blue-500 duration-300 ease-in-out hover:translate-x-3 cursor-pointer'>{page?.title}</h1></button>
            {page?.child && <button className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-blue-100`} onClick={() => setOpen(!open)}><BsChevronRight className={`text-sm ${open && "rotate-90"} duration-300 `} /></button> }
        </div>
        {
            page?.child && (
                <div className={`${open ? 'max-h-screen' : 'max-h-0'} h-full transition-all overflow-hidden duration-500 ml-10 mt-2`}>
                    {
                        page.child.map((pagechild, index) => {
                            return <Page page={pagechild} key={index}/>
                        })
                    }
                </div>
            )
        }
    </div>
  )
}
