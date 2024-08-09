import Pre_Type from '@components/Content/Preview/Pre_Type'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import BreadCrumbPage from './BreadCrumbPage'

export default function MainPage() {
    const router = useRouter()
    const { docId, pageId } = router.query
    const [content, setContent] = useState(null)
    const context = useContext(MyContext)
    const device = 1

    useEffect(() => {
        const find = context.publishDoc?.[docId].pages.find(res => res.id == pageId)
        if(find){
            setContent(find)
        }
    }, [pageId])

    if(content)
  return (
    <div className='w-full xl:w-3/4 p-10'>
        <div>
            <div className={`w-full relative`}>
                <BreadCrumbPage list={content.breadcrumb}/>
                {
                    content.content.map((comp, key) => {
                        return (
                        <div>
                            {
                                comp.hasOwnProperty("cols") ?
                                <div className={`${device != 1 ? "w-full":`grid gap-10 grid-cols-${comp.cols.length}`}`}>
                                    {
                                        comp.cols.map((item, idx) => {
                                            return (
                                                <div key={idx}>
                                                    {
                                                        item.hasOwnProperty("rows") ?
                                                            item.rows.map((row, idx2) => {
                                                                return <Pre_Type comp={row} key={idx2}/>
                                                            })
                                                        :
                                                        <Pre_Type comp={item} device={device}/>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <Pre_Type comp={comp} device={device} key={key}/>
                            }
                        </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}
