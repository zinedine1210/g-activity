import { BsChat, BsSearch } from "react-icons/bs";
import { useRouter } from "next/router";
import { Notify } from "@utils/scriptApp";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "context/MyProvider";
import { HiRefresh } from "react-icons/hi";
import Swal from 'sweetalert2';
import TableMailBox from "@components/Mail/Mailbox/TableMailBox"
import ToolbarMailBox from "@components/Mail/Mailbox/ToolbarMailBox";
import SidebarMail from "@components/Mail/Mailbox/SidebarMail"
import DetailMail from "@components/Mail/Mailbox/DetailMail"
import ComposeEmail from "@components/Mail/Mailbox/ComposeEmail"
import DropdownAccount from "@components/Mail/DropdownAccount"
import CollectionData from "@repositories/CollectionData"

export default function PanelList({
    profileData,
    roomId
}) {
    const router = useRouter()
    const { uid } = router.query;
    const statename = "dataMailAccount"
    const context = useContext(MyContext)
    const [keyword, setKeyword] = useState("")
    const [currentAccount, setCurrentAccount] = useState("")
    const [listAccount, setListAccount] = useState("")
    const [currentRightPanel, setCurrentRightPanel] = useState(null)
    const matchHash = {
        "Inbox": true,
        "Sent": true,
        "Drafts": true,
        "Junk": true,
        "Trash": true,
    };

    const setCurrent = async (obj) => {
        setCurrentAccount(obj)
    }

    const getDataAccountMail = async () => {
        const result = await CollectionData.getData({ url: `mail_account` })
        if (result.status == 0) {
            if (result.data.length > 0) {
                setListAccount(result.data)
                let objCurrentAccount = result.data.find(account => account.id === uid);
                let currentActive = result.data[0]
                if (objCurrentAccount) {
                    currentActive = objCurrentAccount
                }
                setCurrent(currentActive)
                console.log("Disini yaa?? 111")
                // router.push(`/usr/mail?uid=${currentActive['id']}#Inbox`)
            }
            context.setData({ ...context, [statename]: result.data })
        } else Notify("Something went wrong", 'error')
    }

    useEffect(() => {
        console.log("tess1234")
        context.setData({ ...context, mailRightPanel: ''})
        if (!context[statename]) {
            getDataAccountMail()
        } else {
            const hash = router.asPath.split('#')[1] || 'Inbox';
            console.log("context[statename]", context[statename])
            if (context[statename].length > 0) {
                console.log("sini kah?")
                setListAccount(context[statename])
                if (!uid) {
                    router.push(`/usr/mail?uid=${context[statename][0]['id']}#Inbox`)
                    setCurrent(context[statename][0])
                } else {
                    let objCurrentAccount = context[statename].find(account => account.id === uid);
                    // console.log("objCurrentAccount", objCurrentAccount)
                    if (objCurrentAccount) {
                        setCurrent(objCurrentAccount)
                        console.log("matchHash[hash]", matchHash[hash])
                        if (!matchHash[hash] || matchHash[hash] == false) {
                            router.push(`/usr/mail?uid=${objCurrentAccount['id']}#Inbox`)
                        }
                        context.setData({ ...context, mailRightPanel: 'tableMail' })
                    } else {
                        console.log("gak ada account nih")
                        // router.push(`/usr/mail?uid=${context[statename][0]['id']}#Inbox`)
                    }
                }
            } else {
                console.log("disini ya??")
                Swal.fire({
                    title:`Email not found`,
                    text:"You don't have an email account yet, please enter your email account to use the email feature.",
                    icon: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Redirect to Email Account',
                    allowOutsideClick: false, // Prevent closing by clicking outside
                    allowEscapeKey: false
                }).then(async (result) => {
                    if (result.isConfirmed) {
                       router.push(`/usr/mail/account`)
                    }
                  })
            }
        }
    }, [context[statename], uid])

    useEffect(() => {
        setCurrentRightPanel(context['mailRightPanel'])
    }, [context['mailRightPanel']])


    const openComposeEmail = () => {
        context.setData({ ...context, mailRightPanel: 'composeMail' })
    }


    return (
        <div className="w-full xl:w-full h-screen overflow-y-hidden">
            <div className="flex-col flex h-full">
                <div className="flex items-center justify-center bg-slate-100">
                    <div className="w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar h-screen">
                        <div className="px-2">
                            <DropdownAccount listAccounts={listAccount} currentAccount={currentAccount} />

                            <div className="h-16 flex items-center">
                                <button onClick={() => openComposeEmail()} className="w-48 mx-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-gray-100 py-2 rounded space-x-2 transition duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <span>Compose</span>
                                </button>
                            </div>
                            {/* Section sidebar mail*/}
                            <SidebarMail />
                        </div>

                        <div className="flex-1 px-2 w-full">
                            {
                                currentRightPanel == "composeMail" && <ComposeEmail account={currentAccount} />
                            }

                            {
                                currentRightPanel == "tableMail" && <><div>
                                    {/* Section toolbar mail*/}
                                    <ToolbarMailBox />
                                </div>
                                    {/* Section table mail*/}
                                    <div className="max-w-full">
                                        <TableMailBox matchHash={matchHash} />
                                    </div></>
                            }

                            {/* Section detail mail*/}
                            {
                                currentRightPanel == "detailMail" && <><DetailMail account={currentAccount} /></>
                            }

                        </div >

                    </div >
                </div >
            </div>
        </div >
    )
}


