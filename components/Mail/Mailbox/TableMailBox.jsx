import React, { useContext, useState, useEffect } from 'react'
import MeetingRepository from '@repositories/MeetingRepository'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import RecordAccount from '@components/Mail/Account/RecordAccount'
import { useRouter } from 'next/router'
import CollectionData from "@repositories/CollectionData"
import { convertDateMail } from '@utils/function'
import Swal from 'sweetalert2';

export default function TableMailBox({
    matchHash
}) {
    const router = useRouter()
    const { pathname, query } = router;
    const context = useContext(MyContext)
    const statename = "dataMailBox"
    const [keyword, setKeyword] = useState("")
    const [itemHover, setItemHover] = useState(false);
    const [filterHash, setFilterHash] = useState('#Inbox');
    const [filterUID, setFilterUID] = useState(null);
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [dataMail, setDataMail] = useState([
        // {
        //     sender: "William Livingston",
        //     title: "Lorem ipsum dolor sit amet",
        //     desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        //     starred: false,
        //     time: "3:05 PM"
        // },
    ]);

    // Definisikan hash, page, dan uid di luar useEffect
    const hash = router.asPath.split('#')[1] || '#Inbox';
    const page = router.query.page || 1;
    const uid = router.query.uid;

    useEffect(() => {
        setDataMail(null)
        const hash = router.asPath.split('#')[1] || '#Inbox';
        const page = router.query.page || 1;
        const uid = router.query.uid;
        setFilterUID(uid)
        if (context[statename]) {
            const hasChanged = (
                context[statename]['filterType'] !== hash ||
                context[statename]['filterPage'] !== page ||
                context[statename]['filterUID'] !== uid
            );
            if (hasChanged) {
                getDataBoxMail(uid, hash, page);
            }
        } else {
            getDataBoxMail(uid, hash, page);
        }

        setFilterHash(hash);
    }, [uid, page, hash]);

    useEffect(() => {
        if (!context[statename]) {
            getDataBoxMail(uid, hash, page);
            setDataMail(null)
        } else {
            setDataMail(context[statename]['emails'])
        }
    }, [context[statename]]);


    const getDataBoxMail = async (filterUID, filterType, filterPage) => {
        if (filterUID && filterType) {
            if (!matchHash[hash] || matchHash[hash] == false) {
                filterType = "Inbox"
            }

            let result = await CollectionData.getData({ url: `mail/${filterUID}/${filterType}`, start: filterPage })
            if (result.status == 0) {
                if (Object.keys(result.data).length > 0) {
                    result['data']['filterUID'] = filterUID
                    result['data']['filterType'] = filterType
                    result['data']['filterPage'] = Number(filterPage)
                }
                context.setData({ ...context, [statename]: result.data })
            } else Notify("failed to get data", 'error')
        }
    }

    const delToTrashEmail = async (data) => {
        let emailId = data['id'];
      
        if (hash == "Trash") {
            Swal.fire({
                title: 'Are you sure?',
                text: "This email will be deleted permanent",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // delete permanent
                    let obj = { 'email_id': emailId, 'msg_id': data['msg_id'] }
                    if(data['Attachments'] && data['Attachments'].length > 0){
                        obj['filename'] = data['Attachments'][0]['filename']
                    }
                    let result = await CollectionData.deleteData({ url: `delete/${filterUID}`, values: obj })
                    let updatedData = context[statename]['emails'].filter(item => item.id !== emailId);
                    context.setData({ ...context, [statename]: { ...context[statename], 'emails': updatedData } });
                    Notify("Email has deleted", 'success')
                }
            })
        } else {
            let obj = { 'email_id': emailId }
            let result = await CollectionData.deleteData({ url: `mail_to_trash/${filterUID}/Inbox`, values: obj })
            let updatedData = context[statename]['emails'].filter(item => item.id !== emailId);
            context.setData({ ...context, [statename]: { ...context[statename], 'emails': updatedData } });
            Notify("Email has move to trash", 'success')
        }
    }


    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const detailEmail = (mail) => {
        context.setData({ ...context, mailRightPanel: 'detailMail', detailMailData: mail })
    }

    const extractFirstEmail = (toField) =>
        toField[0].match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null;

    const checkFromEmail = (mail) => {
        if (["Sent", "Drafts"].includes(filterHash)) {
            return mail.To.length > 0 ? extractFirstEmail(mail.To) || "(no receiver)" : "(no receiver)";
        }
        return mail.From;
    };

    const toolbarOptions = (index, mail) => [
        // {
        //     title: "Archive",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
        //         </svg>
        //     ),
        //     action: () => { console.log('Archive clicked'); }
        // },
        {
            title: "Delete",
            icon: loadingIndex === index ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            action: async (e) => {
                e.stopPropagation();
                setLoadingIndex(index);
                try {
                    await delToTrashEmail(mail);
                } finally {
                    setLoadingIndex(null);
                }
            }
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

    return (
        <>
            <div className="bg-gray-100 mb-6 max-w-full overflow-hidden">
                <ul className="ul-container">
                    {
                        dataMail ? dataMail.length > 0 ? dataMail.map((mail, index) => {
                            // const title_desc = `${mail.title} - ${mail.desc}`;
                            return (
                                <li key={index} className="flex items-center border-y hover:bg-gray-200 px-2" onClick={() => detailEmail(mail)}>
                                    {/* <input type="checkbox" className="focus:ring-0 border-2 border-gray-400" /> */}
                                    <div
                                        onMouseEnter={() => setItemHover(index)}
                                        onMouseLeave={() => setItemHover(null)}
                                        className={`w-full flex items-center justify-between p-1 my-1 cursor-pointer ${itemHover === index ? 'hover-class' : ''}`}
                                    >
                                        <div className="flex items-center text-sm">
                                            {/* <div className="flex items-center mr-4 ml-1 space-x-1">
                                                <button title={mail.starred ? "Starred" : "Not starred"}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`text-${mail.starred ? 'yellow-500' : 'gray-500'} hover:text-yellow-600 h-5 w-5`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            </div> */}
                                            <div className="flex items-center mr-2 ml-1 space-x-1"></div>
                                            <span className="min-w-64 pr-2"> {checkFromEmail(mail)}</span>
                                            <div className="w-full flex flex-col max-w-full">
                                                <span className="truncate-text">{mail.Subject ? mail.Subject : "(no subject)"}</span>
                                                <span className="truncate-multiline text-gray-400 block text-ellipsis overflow-hidden">{mail.Body ? truncateText(mail.Body, 100) : "(no body)"}</span>
                                            </div>
                                        </div>
                                        <div className="w-32 flex items-center justify-end">
                                            {itemHover === index && (
                                                <div className="flex items-center space-x-2">
                                                    {toolbarOptions(index, mail).map((option, i) => (
                                                        <button key={i} title={option.title} onClick={option.action} disabled={loadingIndex === index}>
                                                            {option.icon}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {itemHover !== index && (
                                                <span className="text-sm text-gray-500 min-w-14">
                                                    {mail.Date && convertDateMail(mail.Date, "datetime")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )
                        }) : (
                            <div className="flex items-center justify-center border-y hover:bg-gray-200 px-2 py-4">
                                <div className="text-gray-500 text-center">
                                    <p className="text-lg font-semibold">No Data</p>
                                    <p className="text-sm">There are currently no emails available.</p>

                                </div>
                            </div>
                        ) : new Array(10).fill("loading").map((load) => {
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
