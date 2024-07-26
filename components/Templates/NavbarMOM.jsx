import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { MyContext, urlData } from "../../context/MyProvider";
import { FaUserPlus, FaPrint, FaPalette, FaSave, FaTrash } from "react-icons/fa"
import { handlerPutMOM, handlerPutRecord } from "../../utils/repositories"
import ProjectRepository from "../../repositories/ProjectRepository";
import MomRepository from "../../repositories/MomRepository";
import CardAssign from "./CardAssign";
import Swal from "sweetalert2";

export default function NavbarMOM(props) {
    console.log("dipanggil???")
    const { lang, editor } = props
    const [active, setActive] = useState(false)
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const defaultLocale = router.locale
    const [open, setOpen] = useState(false)
    const context = useContext(MyContext)
    const [language, setLanguage] = useState(defaultLocale)

    const settingsLanguage = (value) => {
        if (value == "id") {
            router.push(router.asPath, router.asPath, { locale: "id" })
            setLanguage("id")
        } else if (value == "en") {
            router.push(router.asPath, router.asPath, { locale: "en" })
            setLanguage("en")
        }
    }

    const handlerSave = async () => {
        // update data record:
        const newArr = JSON.parse(JSON.stringify(context.dataDocumentation))
        delete newArr.assigns
        delete newArr.header
        delete newArr.participants
        delete newArr.id
        delete newArr._cb
        delete newArr._cd
        delete newArr.is_owner
        delete newArr.workspace_id
        newArr.mom_date = newArr.mom_date ? new Date(newArr.mom_date.epoch_time * 1000).toISOString() : null
        newArr.start_time = newArr.start_time ? new Date(newArr.start_time.epoch_time * 1000).toISOString() : null
        newArr.end_time = newArr.end_time ? new Date(newArr.end_time.epoch_time * 1000).toISOString() : null
        newArr.privacy = -1

        newArr.record.forEach(async (val, key) => {
            val.pos = key + 1
            val.target_date = val.target_date ? new Date(val.target_date.epoch_time * 1000).toISOString() : null
            delete val.mom_id
            delete val._cd

            console.log("point update:", val)
            const point = await MomRepository.putMomPoint({ xa: JSON.parse(localStorage.getItem("XA")), data: val, id: val.id })
            console.log(point);
        })

        console.log("Mom update: ", newArr)

        const result = await MomRepository.putMom({ xa: JSON.parse(localStorage.getItem("XA")), data: newArr, id: context.dataDocumentation.id })
        console.log(result);
        if (result.status == 0) {
            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Changes saved successfully",
                timer: 1000,
                showConfirmButton: false
            })
        }
    }

    const handlerPinned = () => {
        context.dataDocumentation.pin = !context.dataDocumentation.pin
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerLock = () => {
        context.dataDocumentation.privacy = context.dataDocumentation.privacy == "private" ? "public" : "private"
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerClose = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Leave this page?',
            text: "Do you want to save the changes you made?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            showDenyButton: true,
            confirmButtonText: 'Yes, save it',
            denyButtonText: "Don't Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handlerSave()
                router.push(`/usr/workspaces/project/U?id=${context.dataDocumentation.project_id}`)
                context.setDataDocumentation(null)
            } else if (result.isDenied) {
                router.push(`/usr/workspaces/project/U?id=${context.dataDocumentation.project_id}`)
                context.setDataDocumentation(null)
            }
        })
    }

    return (
        <nav className="fixed w-full bg-white shadow dark:bg-dark z-50">
            <div className="contain px-6 py-2">
                <div className="-mx-3 whitespace-nowrap scroll-hidden flex items-center justify-between">
                    <div className="gap-1 grid grid-flow-col items-center">
                        <a href={context.dataDocumentation ? `/usr/workspaces/project/U?id=${context.dataDocumentation.project_id}` : "/usr"} onClick={(e) => handlerClose(e)} className={`flex gap-1`}>
                            <span className="font-extrabold text-green-500 text-4xl block">G</span>
                            <p className="self-end text-xs font-extrabold uppercase mb-1">Minute Of Meeting</p>
                        </a>
                        {/* <MenuBar editor={editor}/> */}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {
                                context.dataDocumentation?.assigns ? context.dataDocumentation.assigns.slice(0, 3).map((item, key) => {
                                    console.log("ini kah map item mom", item)
                                    if (key == 3)
                                        return (
                                            <span key={key} className="w-10 h-10 border ring-2 ring-offset-1 ring-zinc-200 rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center text-sm text-white uppercase group font-bold">
                                                {context.dataDocumentation.assigns.length - 3}+
                                            </span>
                                        )
                                    return (
                                        <CardAssign item={item} key={key} />
                                    )
                                })
                                    : ""
                            }

                            <div className="relative">
                                <span onClick={() => setOpen(true)} className={`flex items-center justify-center relative transition-all cursor-pointer w-10 h-10 font-semibold border-2 border-dashed ${open ? "border-primary" : "hover:border-primary border-zinc-300"} rounded-full bg-zinc-50 text-zinc-800`}><FaUserPlus /></span>
                                {
                                    open ?
                                        <ModalAssign open={open} setOpen={e => setOpen(e)} />
                                        : ""
                                }
                            </div>
                        </div>
                        {/* {
                        context.dataDocumentation ?
                        <>
                            <button onClick={() => handlerPinned()} title="Pinned">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className={`w-6 h-6 ${context.dataDocumentation.pin ? "fill-yellow-300 stroke-yellow-300":""}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </button>
                        </>
                        :""
                    } */}
                        <button title="Color"><FaPalette className="w-4 h-4" /></button>
                        <button title="Print"><FaPrint className="w-4 h-4" /></button>

                        <button disabled={context.dataDocumentation ? false : true} onClick={() => handlerSave()} className="disabled:bg-zinc-500 hover:bg-blue-400 transition-all bg-primary rounded-md text-white px-3 py-2 font-semibold text-sm flex items-center gap-2">
                            {lang("save")}
                            <FaSave />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}


function ModalAssign(props) {
    const context = useContext(MyContext)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(context.dataDocumentation ? JSON.parse(JSON.stringify(context.dataDocumentation.assigns)) : [])
    const [keyword, setKeyword] = useState(null)
    const [member, setMember] = useState(null)
    const [datatimeout, setDatatimeout] = useState(null)

    const handlerSubmitEmail = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(data);
        let dataFinal = {
            add: [],
            delete: []
        }

        context.dataDocumentation.assigns.forEach((val, key) => {
            const findData = data.find(res => {
                return res.uid == val.uid
            })

            if (!findData) {
                dataFinal.delete.push(val.uid)
            }
        });

        data.forEach((val) => {
            const findData = context.dataDocumentation.assigns.find(res => {
                return res.uid == val.uid
            })

            if (!findData) {
                dataFinal.add.push(val.uid)
            }
        })
        console.log(dataFinal);

        const getXA = JSON.parse(localStorage.getItem("XA"))
        if (dataFinal.add.length > 0) {
            const result = await MomRepository.postTeamMom({ data: dataFinal.add, xa: getXA, projectID: context.dataDocumentation.project_id, id: context.dataDocumentation.id })
            console.log(result);
        }

        if (dataFinal.delete.length > 0) {
            const deleteData = await MomRepository.deleteTeam({ xa: JSON.parse(localStorage.getItem("XA")), id: context.dataDocumentation.id, data: dataFinal.delete })
            console.log(deleteData);
        }
        context.dataDocumentation.assigns = data
        context.setDataDocumentation(context.dataDocumentation)
        setData([])
        props.setOpen(false)
        setLoading(false)
    }

    const handlerAddEmail = (value) => {
        data.push(value)
        setData(data)
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDeleteEmail = (value) => {
        const filter = data.filter(res => {
            return res.uid != value.uid
        })
        setData(filter)
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerKeyword = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            let newData = null

            if (value == "") {
                newData = member
            } else {
                newData = member.filter(res => {
                    const filter = res.username.includes(value)
                    if (filter)
                        return res
                })
            }

            setKeyword(newData)
        }, 1000);
        setDatatimeout(getdatatimeout)
    }

    useEffect(() => {
        async function getMember() {
            const result = await ProjectRepository.getTeam({ xa: JSON.parse(localStorage.getItem("XA")), type: 1, id: context.dataDocumentation.project_id })
            console.log(result);
            setMember(result.data)
            setKeyword(result.data)
        }

        if (!member) {
            getMember()
        }
    }, [member])

    return (
        <div className={`bg-white space-y-1 right-0 rounded-md shadow-xl absolute w-96 py-2 ${props.open ? "visible opacity-100" : "invisible opacity-0"}`}>
            <div className="p-2">
                <h1 className="font-bold">Share this Minute of Meeting</h1>
                <p className="text-zinc-500 text-sm">Member with access:</p>
            </div>
            <div className="mb-5 max-h-40 overflow-auto">
                
                {
                    data ?
                        data.length > 0 ?
                            data.map((item, key) => {
                                return (
                                    <div key={key} className={`relative group hover:bg-blue-100 px-3 py-2 flex items-center gap-3 cursor-pointer w-full`}>
                                        <span className="w-8 h-8 border rounded-full relative bg-blue-500 border-blue-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{item.username.charAt(0)}</span>
                                        <div className="text-start">
                                            <h1 className="text-sm font-bold">{item.username}</h1>
                                            <p className="text-xs">{item.fullname}</p>
                                        </div>
                                        <button onClick={() => handlerDeleteEmail(item)} className="invisible group-hover:visible absolute top-1/2 right-2 -translate-y-1/2 p-2 hover:bg-blue-200 rounded-md">
                                            <FaTrash className="text-red-500" />
                                        </button>
                                    </div>
                                )
                            })
                            :
                            <h1 className="text-sm text-red-500 px-2 font-bold mb-5">Not Available</h1>
                        :
                        "Loading..."
                }
            </div>
            <div className="relative mx-2">
                <input type="search" onChange={(e) => handlerKeyword(e.target.value)} placeholder="Filter by name" className="transition-all duration-300 w-full text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary peer" />
                <div className="absolute bg-white hover:visible w-full peer-focus:visible invisible space-y-1 max-h-56 h-fit shadow-md border overflow-y-scroll">
                    {
                        keyword ?
                            keyword.length > 0 ?
                                keyword.filter(res => {
                                    function getOption() {
                                        const member = data.find(opt => {
                                            return opt.uid == res.uid
                                        })
                                        let result = true

                                        if (member) {
                                            result = false
                                        }
                                        return result
                                    }

                                    const filter = getOption()

                                    if (filter) {
                                        return res
                                    }
                                }).map((item, key) => {
                                    return (
                                        <button onClick={() => handlerAddEmail(item)} key={key} className={`disabled:bg-zinc-100 hover:bg-zinc-100 px-3 py-2 flex items-center gap-3 cursor-pointer w-full`}>
                                            <span className="w-8 h-8 border rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{item.username.charAt(0)}</span>
                                            <div className="text-start">
                                                <h1 className="text-sm font-bold">{item.username}</h1>
                                                <p className="text-xs">{item.fullname}</p>
                                            </div>
                                        </button>
                                    )
                                })
                                : <h1 className="text-zinc-500 text-sm text-center p-2 block">Members of this project not found, please add them first</h1>
                            :
                            <div role="status" className="w-full py-2">
                                <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                    }
                </div>
            </div>
            <div className="flex items-center gap-2 px-2">
                {
                    loading ?
                        <div role="status" className="w-full py-2">
                            <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <>
                            <button onClick={() => props.setOpen(false)} className="block w-1/4 bg-red-500 hover:bg-red-600 text-sm font-bold text-white text-center py-2 rounded-md transition-all duration-300">
                                Close
                            </button>
                            <button onClick={(e) => handlerSubmitEmail(e)} className="block w-3/4 bg-blue-500 hover:bg-blue-600 text-sm font-bold text-white text-center py-2 rounded-md transition-all duration-300">
                                Saved
                            </button>
                        </>
                }
            </div>
        </div>
    )
}