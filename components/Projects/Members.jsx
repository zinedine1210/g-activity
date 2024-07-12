import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import WorkspacesRepository from "../../repositories/WorkspacesRepository";
import ProjectRepository from "../../repositories/ProjectRepository";
import CollectionData from "@repositories/CollectionData"
import Swal from "sweetalert2";

export default function Members(props) {
    const member = props.member
    const isOwner = props.data?.is_owner !== 0;
    const ownerInfo = props.data?.owner_info
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(false)

    const handlerRemoveMember = async (value) => {
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
                let obj = { "url": `project/${value.project_id}/team/rm`, "values": [value.id] }
                const result = await CollectionData.deleteData(obj)
                // const result = await ProjectRepository.deleteTeam({ xa: JSON.parse(localStorage.getItem("XA")), data: [value.uid], id: value.project_id })

                if (result.status == 0) {
                    const newArr = JSON.parse(JSON.stringify(member)).filter(res => {
                        return res.uid != value.uid
                    })

                    props.setMember(newArr)
                }
            }
        })
    }

    return (
        <div>
            {
                active && <ModalMembers active={active} members={member} data={props.data} setMember={(val) => props.setMember(val)} setActive={(val) => setActive(val)} />
            }

            <h1 className="text-xl font-bold">Projects Members ({member?.length + 1})</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Projects members can view and join all Projects visible boards and create new boards in the Projects.</p>

            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <input type="search" placeholder="Filter by name" className="text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary" />
                    {
                        props.data?.is_owner !== 0 && (
                            <div className="flex items-center gap-2">
                                <button onClick={() => setActive(true)} className="hidden md:flex items-center gap-2 font-semibold bg-zinc-500 py-1 px-3 text-sm rounded-md shadow-md text-white">
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>
                                    <h1>Invite Project members</h1>
                                </button>
                            </div>
                        )
                    }
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
                        <div className="flex items-center gap-2">
                            <button className="bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                                Hubungi
                            </button>
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
                        member ? member.length > 0 ? member.map((item, key) => {
                            if (item.uid_docs)
                                return (
                                    <li key={key} className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                                        <div className="flex items-center gap-2 md:w-96">
                                            <span className="w-12 h-12 bg-black rounded-full uppercase flex items-center text-white font-bold justify-center">{item.uid_docs.username.charAt(0)}</span>
                                            <div>
                                                <h1 className="font-semibold text-sm">{item.uid_docs.fullname}</h1>
                                                <p className="text-zinc-600 dark:text-zinc-300 font-semibold text-sm">{item.uid_docs.username}</p>
                                            </div>
                                        </div>
                                        <div className="md:min-w-24 bg-gray-500 py-1 text-sm rounded-md flex items-center justify-center gap-1 px-3 font-semibold">
                                            <h1 className="text-white dark:text-zinc-300">Member</h1>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="bg-green-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
                                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                </svg>
                                                Hubungi
                                            </button>
                                            {
                                                props.data?.is_owner !== 0 && (
                                                    <button onClick={() => handlerRemoveMember(item)} className="bg-red-600 py-1 text-sm rounded-md flex items-center gap-1 px-3 text-white font-semibold">
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
                            : ""
                    }

                </ul>
            </div>
        </div>
    )
}


function ModalMembers(props) {
    const [data, setData] = useState([])
    const [keyword, setKeyword] = useState("")
    const [member, setMember] = useState(null)
    const [suggestMember, setSuggestMember] = useState(null)
    const [datatimeout, setDatatimeout] = useState(null)
    const context = useContext(MyContext)
    const [loading, setLoading] = useState(false)


    const handlerSubmitEmail = async (e) => {
        e.preventDefault()
        setLoading(true)
        let dataFinal = []
        data.forEach(val => {
            if (val.uid) {
                dataFinal.push(val.uid)
            }
        })
        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await ProjectRepository.postTeamProject({ data: dataFinal, xa: getXA, workspaceID: props.data.workspace_id, id: props.data.id })
        if (result.status == 0) {
            Swal.fire({
                icon: "success",
                title: "Successfully Added",
                text: "The workspace will be added to your page",
                timer: 1500,
                showConfirmButton: false
            })
        }

        const newData = JSON.parse(JSON.stringify(props.members))
        data.forEach(val => {
            newData.unshift(val)
        });

        setData([])
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

    useEffect(() => {
        async function getMember() {
            const result = await WorkspacesRepository.getTeam({ xa: JSON.parse(localStorage.getItem("XA")), type: 1, id: props.data.workspace_id })
            setMember(result.data)
            console.log("result", result)
            setSuggestMember(result.data)
        }


        if (!member) {
            getMember()
        }
    }, [member])

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
                            <h1 className="font-bold text-xl">Share this Project</h1>
                            <p className="text-zinc-600 text-sm md:text-base dark:text-zinc-300">This team only comes with 1 project, but getting more is easy.</p>
                            <div className="my-2">
                                <div>
                                    <div className="flex items-center justify-between relative">
                                        <input type="search" onChange={(e) => handlerKeyword(e.target.value)} placeholder="Filter by name" className="dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary peer w-1/2" />
                                        <div className="top-full bg-white dark:bg-dark max-h-80 overflow-y-scroll absolute left-0 shadow-lg  w-full md:w-1/2 hover:visible peer-focus:visible invisible">
                                            <h1 className="text-sm text-zinc-400 mb-2 p-2">Sharing Suggestions</h1>
                                            {console.log("keyword", keyword)}
                                            {
                                                suggestMember || keyword != "" ?
                                                    suggestMember.length > 0 ?
                                                        suggestMember.filter(res => {
                                                            function getOption() {
                                                                const find = props.members.find(opt => {
                                                                    return opt.uid == res.uid
                                                                })

                                                                let result = true

                                                                if (find) {
                                                                    result = false
                                                                }

                                                                return result
                                                            }

                                                            const mantap = getOption()

                                                            if (mantap && (res.uid_docs.username.toLowerCase().includes(keyword.toLowerCase()) || res.uid_docs.fullname.toLowerCase().includes(keyword.toLowerCase()))) {
                                                                return res;
                                                              }
                                                        }).map((item, key) => {
                                                            return (
                                                                <button key={key} onClick={() => handlerAddEmail(item)} className="outline-none disabled:bg-zinc-200 focus:bg-blue-100 hover:bg-blue-100 p-2 transition-all duration-300 w-full text-start flex items-center gap-2 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary">
                                                                    <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
                                                                        {item.uid_docs.username.charAt(0)}
                                                                    </span>
                                                                    <div className="text-start">
                                                                        <h1 className="font-bold text-sm">{item.uid_docs.username}</h1>
                                                                        <p className="text-xs text-zinc-500">{item.uid_docs.fullname}</p>
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
                                                if (item.uid_docs)
                                                    return (
                                                        <div key={key} className="flex items-center justify-between hover:bg-blue-50 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary group">
                                                            <div className="w-full flex items-center gap-3 py-2 px-2">
                                                                <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
                                                                    {item.uid_docs.username.charAt(0)}
                                                                </span>
                                                                <div className="text-start">
                                                                    <h1 className="font-bold text-sm">{item.uid_docs.username}</h1>
                                                                    <p className="text-xs text-zinc-500">{item.uid_docs.fullname}</p>
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