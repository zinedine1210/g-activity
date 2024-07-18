import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa"
import { MyContext } from "../../context/MyProvider";
import WorkspacesRepository from "../../repositories/WorkspacesRepository";
import { useFindMembers } from "../../utils/swr";

export default function Members(props) {
    const router = useRouter()
    const members = props.members
    const profileData = props.profileData
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(false)
    const context = useContext(MyContext)
    const ownerInfo = props.data?.owner_info
    const isOwner = props.data?.is_owner !== 0;

    const handlerResend = async (value) => {
        setLoading(true)
        const result = await WorkspacesRepository.resendInvitation({ workspaceID: router.query.id, id: value.id, xa: JSON.parse(localStorage.getItem("XA")) })
        Swal.fire("Resend invitation successfully")
        setLoading(false)
    }

    const handlerCancel = async (value) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                let obj = []
                obj.push(value.id)
                const result = await WorkspacesRepository.deleteTeam({ id: router.query.id, xa: JSON.parse(localStorage.getItem("XA")), data: obj })
                console.log(result);
                if (result.status == 0 || result.message == "Data has been deleted") {
                    const filter = members.filter(res => {
                        return res.uid != value.uid
                    })
                    props.setMember(filter)
                    context.setDataDocumentation(context.dataDocumentation)
                }
                setLoading(false)
            }
        })
    }

    if (members)
        return (
            <div className="py-10">
                <ModalMembers active={active} members={props.members} setMember={(val) => props.setMember(val)} setActive={(val) => setActive(val)} />
                <h1 className="text-xl font-bold">Workspace Members ({members.length + 1})</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.</p>

                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <input type="search" placeholder="Filter by name" className="dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary" />
                        <div className="flex items-center gap-2">
                            {
                                isOwner && (
                                    <>
                                        <button onClick={() => setActive(true)} className="md:hidden bg-zinc-500 shadow-md flex items-center justify-center text-white rounded-full w-10 h-10 text-xl">
                                            <FaPlus />
                                        </button>
                                        <button onClick={() => setActive(true)} className="hidden md:flex items-center gap-2 font-semibold bg-zinc-500 py-1 px-3 text-sm rounded-md shadow-md text-white">
                                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                            </svg>
                                            <h1>Invite Workspace members</h1>
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <ul className="mt-5 py-5">
                        <li className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                            <div className="flex items-center gap-2 md:w-96">
                                <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center uppercase">{ownerInfo.username.charAt(0)}</span>
                                <div>
                                    <h1 className="font-semibold text-sm">{ownerInfo.fullname}</h1>
                                    <p className="text-zinc-600 dark:text-zinc-300 font-semibold text-sm">{ownerInfo.username}</p>
                                </div>
                            </div>
                            <div className="md:min-w-24 bg-blue-600 py-1 text-sm rounded-md flex items-center justify-center gap-1 px-3 font-semibold">
                                <h1 className="text-white dark:text-zinc-300">Owner</h1>
                            </div>
                            <div className="flex items-center gap-2 md:w-56 justify-end">
                                {
                                    ownerInfo.username != profileData.username && <button className="bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                        </svg>
                                        Hubungi
                                    </button>
                                }

                                {
                                    isOwner && (
                                        <button disabled className="bg-zinc-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Kick
                                        </button>
                                    )
                                }
                            </div>
                        </li>
                        {
                            members.length > 0 ? members.map((item, key) => {
                                if (item.status == -1)
                                    return (
                                        <li key={key} className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                                            <div className="flex items-center gap-2 md:w-96">
                                                <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center uppercase text-xl">{item.uid_docs.username.charAt(0)}</span>
                                                <div>
                                                    <h1 className="font-semibold text-sm">{item.uid_docs.fullname}</h1>
                                                    <p className="text-zinc-600 dark:text-zinc-300 font-semibold text-sm">{item.uid_docs.username}</p>
                                                </div>
                                            </div>
                                            <div className="md:min-w-24 bg-yellow-600 py-1 text-sm rounded-md flex items-center justify-center gap-1 px-3 font-semibold">
                                                <h1 className="text-white dark:text-zinc-300">Pending</h1>
                                            </div>
                                            <div className="flex items-center gap-2 md:w-56 justify-end">
                                                <button onClick={() => handlerResend(item)} disabled={loading} className="disabled:bg-zinc-600 bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                                                    </svg>
                                                    Resend
                                                </button>
                                                <button onClick={() => handlerCancel(item)} disabled={loading} className="disabled:bg-zinc-600 bg-red-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    )
                                if (item.status == 1)
                                    return (
                                        <li key={key} className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                                            <div className="flex items-center gap-2 md:w-96">
                                                <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center uppercase text-xl">{item.uid_docs.username.charAt(0)}</span>
                                                <div>
                                                    <h1 className="font-semibold text-sm">{item.uid_docs.fullname}</h1>
                                                    <p className="text-zinc-600 dark:text-zinc-300 font-semibold text-sm">{item.uid_docs.username}</p>
                                                </div>
                                            </div>
                                            <div className="md:min-w-24 bg-gray-500 py-1 text-sm rounded-md flex items-center justify-center gap-1 px-3 font-semibold">
                                                <h1 className="text-white dark:text-zinc-300">Member</h1>
                                            </div>
                                            <div className="flex items-center gap-2 md:w-56 justify-end">
                                                {
                                                    item.uid != profileData.id && <button className="bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                        </svg>
                                                        Hubungi
                                                    </button>
                                                }

                                                {
                                                    isOwner && (
                                                        <button onClick={() => handlerCancel(item)} className="bg-red-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Kick
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </li>
                                    )
                            })
                                : ""
                        }
                        {/* <li className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                    <div className="flex items-center gap-2">
                        <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center">Zz</span>
                        <div>
                            <h1 className="font-semibold text-sm">Zinedine Ziddan Fahdlevy</h1>
                            <p className="text-zinc-600 dark:text-zinc-300 font-semibold text-sm">@zine.zf</p>
                        </div>
                    </div>
                    <h1 className="text-zinc-600 dark:text-zinc-300">Guest</h1>
                    <div className="flex items-center gap-2">
                        <button className="bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Accept
                        </button>
                        <button className="bg-red-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                        </button>
                    </div>
                </li> */}
                    </ul>
                </div>
            </div>
        )
}

function ModalMembers(props) {
    const router = useRouter()
    const [data, setData] = useState([])
    const [keyword, setKeyword] = useState("")
    const dataMemberKeyword = useFindMembers({ data: { keyword: keyword }, xa: JSON.parse(localStorage.getItem("XA")) })
    const [datatimeout, setDatatimeout] = useState(null)
    const context = useContext(MyContext)
    const [loading, setLoading] = useState(false)

    const handlerSubmitEmail = async (e) => {
        e.preventDefault()
        setLoading(true)
        // console.log(data.members);
        let dataFinal = []
        data.forEach(val => {
            if (val.username) {
                dataFinal.push(val.username)
            }
        })

        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await WorkspacesRepository.postTeamWorkspace({ data: dataFinal, xa: getXA, workspaceID: router.query.id })
        console.log(result);
        if (result.data.type == "success") {
            Swal.fire({
                icon: "success",
                title: "Successfully Added",
                text: "The workspace will be added to your page",
                timer: 1500,
                showConfirmButton: false
            })
        }

        setData([])
        const newData = JSON.parse(JSON.stringify(props.members))
        result.data.data.forEach(val => {
            newData.unshift(val)
        });

        props.setMember(newData)
        props.setActive(false)
        setLoading(false)
    }

    const handlerKeyword = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            setKeyword(value)
        }, 1000);
        setDatatimeout(getdatatimeout)
    }

    const handlerAddEmail = (value) => {
        data.push(value)
        setData(data)
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDeleteEmail = (value) => {
        const filter = data.filter(res => {
            return res.id != value.id
        })

        setData(filter)
        context.setDataDocumentation(context.dataDocumentation)
    }

    if (props.active)
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center right-0 z-50 bg-black bg-opacity-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full md:h-full">
                <div className="relative w-full h-full max-w-2xl md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-zinc-700 flex items-center">
                        <div className="p-6 w-full relative">
                            <button type="button" className="absolute top-2 right-2" onClick={() => props.setActive(false)}>
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h1 className="font-bold text-xl">Share this Workspace</h1>
                            <p className="text-zinc-600 text-sm md:text-base dark:text-zinc-300">This team only comes with 1 project, but getting more is easy.</p>
                            <div className="my-2">
                                <div>
                                    <div className="flex items-center justify-between relative">
                                        <input type="search" onChange={(e) => handlerKeyword(e.target.value)} placeholder="Filter by name" className="dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary peer w-1/2" />
                                        <div className="top-full bg-white rounded-b-xl dark:bg-dark max-h-80 overflow-y-scroll absolute left-0 shadow-lg  w-full md:w-1/2 hover:visible peer-focus:visible invisible">
                                            <h1 className="text-sm text-zinc-400 mb-2 p-2">Sharing Suggestions</h1>
                                            {
                                                dataMemberKeyword ?
                                                    dataMemberKeyword.data?.data?.length > 0 ?
                                                        dataMemberKeyword.data.data.filter(res => {
                                                            function getOption() {
                                                                const find = data.find(opt => {
                                                                    return opt.id == res.id
                                                                })

                                                                const member = props.members.find(opt => {
                                                                    return opt.uid == res.id
                                                                })
                                                                let result = true

                                                                if (find || member) {
                                                                    result = false
                                                                }
                                                                return result
                                                            }

                                                            const mantap = getOption()

                                                            if (mantap) {
                                                                return res
                                                            }
                                                        }).map((item, key) => {
                                                            return (
                                                                <button key={key} onClick={() => handlerAddEmail(item)} className="outline-none disabled:bg-zinc-200 focus:bg-blue-100 hover:bg-blue-100 p-2 w-full text-start flex items-center gap-2 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary">
                                                                    <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
                                                                        {item.username.charAt(0)}
                                                                    </span>
                                                                    <div className="text-start">
                                                                        <h1 className="font-bold text-sm">{item.username}</h1>
                                                                        <p className="text-xs text-zinc-500">{item.email}</p>
                                                                    </div>
                                                                </button>
                                                            )
                                                        })
                                                        :
                                                        <div className="text-center font-bold text-red-500 p-5">
                                                            <h1>Not Available</h1>
                                                        </div>
                                                    :
                                                    <div className="text-center font-bold p-5">
                                                        <div className="bg-blue-200 mx-auto w-8 h-8 rounded-full animate-pulse">

                                                        </div>
                                                    </div>
                                            }
                                        </div>

                                        {
                                            loading ?
                                                <button disabled className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-all duration-300">
                                                    <div role="status" className="w-full py-2">
                                                        <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </button>
                                                :
                                                <button onClick={(e) => handlerSubmitEmail(e)} disabled={data.length > 0 ? false : true} className="disabled:bg-zinc-500 disabled:hover:bg-zinc-600 py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-all duration-300">
                                                    <h1>Share</h1>
                                                </button>
                                        }
                                    </div>
                                    <div className="my-2 max-h-56 overflow-y-scroll">
                                        {
                                            data.length > 0 ? data.map((item, key) => {
                                                return (
                                                    <div key={key} className="flex items-center justify-between hover:bg-blue-50 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary group">
                                                        <div className="w-full flex items-center gap-3 py-2 px-2">
                                                            <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
                                                                {item.username.charAt(0)}
                                                            </span>
                                                            <div className="text-start">
                                                                <h1 className="font-bold text-sm">{item.username}</h1>
                                                                <p className="text-xs text-zinc-500">{item.email}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 group-hover:visible invisible" onClick={() => handlerDeleteEmail(item)}>
                                                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            })
                                                :
                                                <div className="text-center font-bold text-red-500 pt-2">
                                                    <h1>Not Available</h1>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}