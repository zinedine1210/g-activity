import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FaSave, FaTrash, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { MyContext } from "../../context/MyProvider";
import DocumentationRepository from "../../repositories/DocumentationRepository"
import { mutate } from "swr";
import { findIndex } from "lodash";
import ProjectRepository from "../../repositories/ProjectRepository";
import CardAssign from "./CardAssign";

export default function Navbar(props) {
    const { lang } = props
    const [active, setActive] = useState(false)
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const defaultLocale = router.locale
    const context = useContext(MyContext)
    const [language, setLanguage] = useState(defaultLocale)
    const [open, setOpen] = useState(false)

    console.log("context navbar doc", context)

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
        const pages = JSON.parse(JSON.stringify(context.dataDocumentation.pages))
        console.log(context.dataDocumentation);
        let obj = []
        pages.forEach((val) => {
            if (val.hasOwnProperty("child")) {
                const child = val.child
                delete val.child
                child.forEach(val2 => {
                    obj.push(val2)
                })
            }
            obj.push(val)
        });

        console.log(obj);
        obj.forEach(async val => {
            const result = await DocumentationRepository.putPageDocumentation({ xa: JSON.parse(localStorage.getItem("XA")), id: val.id, data: val })
            console.log(result);
        })

        const newDocumentation = JSON.parse(JSON.stringify(context.dataDocumentation))
        delete newDocumentation.pages

        const returnRes = await DocumentationRepository.putDocumentation({ xa: JSON.parse(localStorage.getItem("XA")), id: newDocumentation.id, data: newDocumentation })
        if (returnRes.status == 0) {
            Swal.fire({ 
                icon: "success",
                position: "top-end",
                title: "Changes saved successfully",
                timer: 1000,
                showConfirmButton: false
            })

            mutate(['documentation', 1, context.dataDocumentation.project_id], cache => {
                if (!cache) {
                    cache = { data: [] };
                  }
                const indexData = findIndex(cache?.data, { id: returnRes.data.id })
                cache.data[indexData] = returnRes.data
                return cache
            }, false)
        } else {
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again or refresh the page'
                })
            }
        }

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
            <div className="px-6 py-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">

                            <a href={context.dataDocumentation ? `/usr/workspaces/project/U?id=${context.dataDocumentation.project_id}` : "/"} onClick={(e) => handlerClose(e)} className={`flex gap-1`}>
                                <span className="font-extrabold text-green-500 text-4xl block">G</span>
                                <p className="self-end text-xs font-extrabold uppercase mb-1">Documentation</p>
                            </a>

                            <div className="hidden mx-10 md:flex items-center">
                                <div className="flex items-center">
                                    <div className="flex -space-x-3">
                                        {
                                            context.dataDocumentation?.assigns ? context.dataDocumentation.assigns.slice(0, 3).map((item, key) => {
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
                                </div>
                            </div>
                        </div>
                        <div className="flex md:hidden">
                            <button type="button" onClick={() => setActive(!active)} className="relative text-zinc-500 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-400 focus:outline-none focus:text-zinc-600 dark:focus:text-zinc-400" aria-label="toggle menu">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${active ? "opacity-0 invisible" : "opacity-100 visible"} transition-all duration-300 ease-in-out`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>

                                <svg className={`w-6 h-6 ${active ? "opacity-100 visible" : "opacity-0 invisible"} absolute top-0 transition-all duration-300 ease-in-out`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={`${active ? "visible" : "invisible md:visible"} absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-28 dark:bg-dark md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}>
                        <div className="flex flex-col md:flex-row space-x-5 items-center">
                            <button onClick={() => setTheme(theme == "light" ? "dark" : "light")}>
                                <svg fill="none" stroke="currentColor" className={`${theme == "light" ? "block" : "hidden"} w-5 h-5`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                                <svg fill="none" stroke="currentColor" className={`${theme == "dark" ? "block" : "hidden"} w-5 h-5`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            </button>
                            <div className="flex items-center relative gap-1 group cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h1 className="text-sm">{language == "id" ? "Indonesia" : "Inggris"}</h1>
                                <svg className="w-4 h-4 group-hover:rotate-180 transition-all duration-300 delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                <div className="bg-white rounded-md shadow-xl text-sm dark:bg-dark p-2 invisible group-hover:visible absolute w-full hover:visible group-hover:translate-y-0 translate-y-3 transition-all top-5 delay-300 opacity-0 group-hover:opacity-100">
                                    <button className="hover:bg-basic w-full rounded-md py-1 dark:hover:bg-darkPrimary text-start px-2 cursor-pointer" onClick={() => settingsLanguage("id")}>Indonesia</button>
                                    <button className="hover:bg-basic w-full rounded-md py-1 dark:hover:bg-darkPrimary text-start px-2 cursor-pointer" onClick={() => settingsLanguage("en")}>Inggris</button>
                                </div>
                            </div>
                            <a onClick={(e) => handlerClose(e)} href={context.dataDocumentation ? `/usr/workspaces/project/Untitled?id=${context.dataDocumentation.project_id}` : ""} className="my-2 text-sm leading-5 text-zinc-700 transition-colors duration-300 transform dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:my-0">Project</a>
                            {/* <a onClick={(e) => handlerClose(e)} className="my-2 text-sm leading-5 text-zinc-700 transition-colors duration-300 transform dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:my-0" href="/usr/documentation/preview">{lang("preview")}</a> */}
                            <button disabled={context.dataDocumentation ? false : true} onClick={() => handlerSave()} className="disabled:bg-zinc-500 hover:bg-blue-400 transition-all bg-primary rounded-md text-white px-3 py-2 font-semibold text-sm flex items-center gap-2">
                                {lang("save")}
                                <FaSave />
                            </button>
                        </div>
                        <div className="my-4 md:hidden">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>

                                <input type="text" className="w-full py-2 pl-10 pr-4 text-zinc-700 bg-white border rounded-md dark:bg-dark dark:text-zinc-300 dark:border-zinc-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Search" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function ModalAssign(props) {
    const context = useContext(MyContext)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(JSON.parse(JSON.stringify(context.dataDocumentation.assigns)))
    const [keyword, setKeyword] = useState(null)
    const [member, setMember] = useState(null)
    const [datatimeout, setDatatimeout] = useState(null)

    const handlerSubmitEmail = async (e) => {
        e.preventDefault()
        setLoading(true)
        let dataFinal = {
            add: [],
            delete: []
        }

        context.dataDocumentation.assigns.forEach((val, key) => {
            const findData = data.find(res => {
                return res.uid == val.uid
            })

            if (!findData) {
                dataFinal.delete.push(val.id)
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

        const getXA = JSON.parse(localStorage.getItem("XA"))
        if (dataFinal.add.length > 0) {
            const result = await DocumentationRepository.postTeamDocumentation({ data: dataFinal.add, xa: getXA, projectID: context.dataDocumentation.project_id, id: context.dataDocumentation.id })
        }

        if (dataFinal.delete.length > 0) {
            const deleteData = await DocumentationRepository.deleteTeam({ xa: JSON.parse(localStorage.getItem("XA")), id: context.dataDocumentation.id, data: dataFinal.delete })
            console.log(deleteData);
        }
        // if(result.status == 0){
        //     Swal.fire({
        //         icon:"success",
        //         title:"Successfully Added",
        //         timer:1500,
        //         showConfirmButton:false
        //     })
        // }
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
                    const filter = res.uid_docs.username.includes(value)
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
            console.log("sini bang??", result)
            setMember(result.data)
            setKeyword(result.data)
        }
        if (!member) {
            getMember()
        }
    }, [member])

    return (
        <div className={`bg-white space-y-1 rounded-md shadow-xl absolute w-96 py-2 ${props.open ? "visible opacity-100" : "invisible opacity-0"}`}>
            <div className="p-2">
                <h1 className="font-bold">Share this Documentation</h1>
                <p className="text-zinc-500 text-sm">Member with access:</p>
            </div>
            <div className="mb-5 max-h-40 overflow-auto">
                {
                    data ?
                        data.length > 0 ?
                            data.map((item, key) => {
                                return (
                                    <div key={key} className={`relative group hover:bg-blue-100 px-3 py-2 flex items-center gap-3 cursor-pointer w-full`}>
                                        <span className="w-8 h-8 border rounded-full relative bg-blue-500 border-blue-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{item.uid_docs.username.charAt(0)}</span>
                                        <div className="text-start">
                                            <h1 className="text-sm font-bold">{item.uid_docs.username}</h1>
                                            <p className="text-xs">{item.uid_docs.fullname}</p>
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
                                            <span className="w-8 h-8 border rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{item.uid_docs.username.charAt(0)}</span>
                                            <div className="text-start">
                                                <h1 className="text-sm font-bold">{item.uid_docs.username}</h1>
                                                <p className="text-xs">{item.uid_docs.fullname}</p>
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