import React, { useContext, useState, useEffect } from 'react'
import MeetingRepository from '@repositories/MeetingRepository'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import RecordAccount from '@components/Mail/Account/RecordAccount'
import { useRouter } from 'next/router'
import CollectionData from "@repositories/CollectionData"
import { convertDateMail } from '@utils/function'

export default function TableMailBox({

}) {
    const router = useRouter()
    const { pathname, query } = router;
    const context = useContext(MyContext)
    const statename = "dataMailBox"
    const [keyword, setKeyword] = useState("")
    const [itemHover, setItemHover] = useState(false);
    const [filterHash, setFilterHash] = useState(false);
    const [dataMail, setDataMail] = useState([
        // {
        //     sender: "William Livingston",
        //     title: "Lorem ipsum dolor sit amet",
        //     desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        //     starred: false,
        //     time: "3:05 PM"
        // },
        // {
        //     sender: "Betty Garmon",
        //     title: "Consectetur adipiscing elit",
        //     desc: "Ccusantium doloremque laudantium, totam rem aperiam, eaque ipsa",
        //     starred: true,
        //     time: "1:23 PM"
        // }
    ]);

    const toolbarOptions = [
        {
            title: "Archive",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
            ),
            action: () => { console.log('Archive clicked'); }
        },
        {
            title: "Delete",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            action: () => { console.log('Delete clicked'); }
        },
        // {
        //     title: "Mark As Read",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg"
        //             className="text-gray-500 hover:text-gray-900 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
        //             </path>
        //         </svg>
        //     ),
        //     action: () => { console.log('Mark As Read'); }
        // },
        // {
        //     title: "Snooze",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 hover:text-gray-900 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        //     ),
        //     action: () => { console.log('Snooze'); }
        // }
    ];


    const getDataBoxMail = async (filterUID, filterType, filterPage) => {
        console.log('filterUID, filterType', filterUID, filterType)
        if(filterUID && filterType){
            const result = await CollectionData.getData({ url: `mail/${filterUID}/${filterType}`, start:filterPage})
            console.log("result apa broo?", result)
            if (result.status == 0) {
                context.setData({ ...context, [statename]: result.data })
            } else Notify("tesss", 'error')
        }
    }


    useEffect(() => {
        console.log("ini aspath")
        setDataMail(null)
        // Mendapatkan filter dari hash di URL
        const hash = router.asPath.split('#')[1];
        const page = router.query.page || 1
        setFilterHash(hash || '#INBOX');
        getDataBoxMail(router.query.uid, hash, page)
    }, [router.asPath]);

    useEffect(() => {
        if (!context[statename]) {
            getDataBoxMail()
        } else {
            setDataMail(context[statename]['emails'])
        }
    }, [context[statename]]);

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const detailEmail = (mail) => {
        console.log("detail", mail)
        context.setData({ ...context, mailRightPanel: 'detailMail', detailMailData: mail })
    }


    return (
        <>
            <div className="bg-gray-100 mb-6 max-w-full overflow-hidden">
                <ul className="ul-container">
                    {
                        dataMail && dataMail.length > 0 ? dataMail.map((mail, index) => {
                            // const title_desc = `${mail.title} - ${mail.desc}`;
                            return (
                                <li key={index} className="flex items-center border-y hover:bg-gray-200 px-2" onClick={() => detailEmail(mail)}>
                                    <input type="checkbox" className="focus:ring-0 border-2 border-gray-400" />
                                    <div
                                        onMouseEnter={() => setItemHover(index)}
                                        onMouseLeave={() => setItemHover(null)}
                                        className={`w-full flex items-center justify-between p-1 my-1 cursor-pointer ${itemHover === index ? 'hover-class' : ''}`}
                                    >
                                        <div className="flex items-center text-sm">
                                            <div className="flex items-center mr-4 ml-1 space-x-1">
                                                <button title={mail.starred ? "Starred" : "Not starred"}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`text-${mail.starred ? 'yellow-500' : 'gray-500'} hover:text-yellow-600 h-5 w-5`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <span className="min-w-64 pr-2">{mail.From}</span>
                                            <div className="w-full flex flex-col max-w-full">
                                                <span className="truncate-text">{mail.Subject}</span>
                                                <span className="truncate-multiline text-gray-400 block text-ellipsis overflow-hidden">{truncateText(mail.Body, 100)}</span>
                                            </div>
                                        </div>
                                        <div className="w-32 flex items-center justify-end">
                                            {itemHover === index && (
                                                <div className="flex items-center space-x-2">
                                                    {toolbarOptions.map((option, i) => (
                                                        <button key={i} title={option.title} onClick={option.action}>
                                                            {option.icon}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {itemHover !== index && (
                                                <span className="text-sm text-gray-500 min-w-14">
                                                    {convertDateMail(mail.Date, "datetime")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )
                        }) : new Array(10).fill("loading").map((load) => {
                            return (
                                <div className='mb-2 p-1'><div className="skeleton w-full h-12" /></div>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}
