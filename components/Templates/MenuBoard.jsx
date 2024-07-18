import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext, urlData } from "../../context/MyProvider";
import {FaSave, FaFilter, FaSort} from "react-icons/fa"
import { useProjects } from "../../utils/swr";
import TaskRepository from "../../repositories/TaskRepository";
import { Notify } from "../../utils/scriptApp"

export default function MenuBoard(props) {
    const {lang, editor} = props
    const projectRef = useRef(null)
    const [project, setProject] = useState(false)
    const {theme, setTheme} = useTheme()
    const router = useRouter()
    const defaultLocale = router.locale
    const context = useContext(MyContext)
    const [language, setLanguage] = useState(defaultLocale)
    const dataBoard = context.dataDocumentation;
    const dataProject = useProjects(1, JSON.parse(localStorage.getItem("XA")), dataBoard.project.workspace_id)
    const dataShareProjects = useProjects(2, JSON.parse(localStorage.getItem("XA")), dataBoard.project.workspace_id)
    // console.log("share", dataShareProjects)

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);
    
      const handleOutsideClick = (event) => {
        if (projectRef.current && !projectRef.current.contains(event.target)) {
            setProject(false);
        }
      };

    const settingsLanguage = (value) => {
        if(value == "id"){
            router.push(router.asPath, router.asPath, {locale : "id"})
            setLanguage("id")
        }else if(value == "en"){
            router.push(router.asPath, router.asPath, {locale : "en"})
            setLanguage("en")
        }
    }

    const handlerSave = async () => {
        const statusall = dataBoard.data
        const getxa = JSON.parse(localStorage.getItem("XA"))
        statusall.forEach(async (ele, index) => {
            const result = await TaskRepository.putStatusTask({
                xa: getxa,
                id: ele.id,
                data: ele
            })
            if(result.status == 0){
                console.log("Update status index : " + index + 1)
            }else{
                console.log("Error update on status index : " + index + 1)
            }
        });
        Notify("Updated successfully", "info")
    }

    
    const handlerLock = () => {
        dataBoard.project.privacy = dataBoard.project.privacy == -1 ? 1:-1
        context.setDataDocumentation(dataBoard)
    }

    const handlerPage = (pjk) => {
        context.setDataDocumentation(null)
        router.push(`/usr/board?id=${pjk.id}`)
    }

    // console.log(dataProject);
    if(dataProject)
  return (
    <nav className="w-full mt-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <div ref={projectRef}>
                        <button onClick={() => setProject(!project)} className={`rounded-md px-3 py-2 duration-300 flex items-center gap-3 border border-zinc-300 dark:hover:bg-dark hover:bg-zinc-100 focus:bg-zinc-200 dark:focus:bg-darkSecondary ${project ? "bg-zinc-200":""}`}>
                            <h1 className="text-sm">Projects</h1>
                            <svg className={`${project ? "rotate-180":""} w-3 h-3 transition-all duration-300 delay-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className={`absolute text-sm mt-2 bg-white dark:bg-dark w-96 shadow-xl rounded-md z-20 transition-all duration-300 ${project ? "block opacity-100":"hidden opacity-0"}`}>
                            <div className="w-full border-b py-1 px-2">
                                <h1 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">All project from this workspace</h1>
                                <p className="text-xs">Change project in one click</p>
                            </div>
                            <div>
                                {
                                    dataProject?.data?.data.map((pjk, key) => {
                                        return (
                                            <button className="w-full block text-start" onClick={() => handlerPage(pjk)} key={key}>
                                                <div className="flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-darkPrimary">
                                                    <span className="bg-black flex items-center justify-center rounded-md w-10 h-10 text-white font-bold text-xl uppercase">{pjk.name.charAt(0)}</span>
                                                    <div>
                                                        <h1 className="font-semibold capitalize">{pjk.name}</h1>
                                                        <p className="text-zinc-500 dark:text-zinc-300 text-sm font-semibold">Your own Project</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })
                                }
                                {
                                    dataShareProjects?.data?.data.map((pjk, key) => {
                                        return (
                                            <button className="w-full block text-start" onClick={() => handlerPage(pjk)} key={key}>
                                                <div className="flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-darkPrimary">
                                                    <span className="bg-black flex items-center justify-center rounded-md w-10 h-10 text-white font-bold text-xl uppercase">{pjk.name.charAt(0)}</span>
                                                    <div>
                                                        <h1 className="font-semibold capitalize">{pjk.name}</h1>
                                                        <p className="text-zinc-500 dark:text-zinc-300 text-sm font-semibold">Share Project</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <button onClick={() => alert("Action not found")} className={`rounded-md px-3 py-2 duration-300 flex items-center gap-3 border border-zinc-300 dark:hover:bg-dark hover:bg-zinc-100 focus:bg-zinc-200 dark:focus:bg-darkSecondary`}>
                        <h1 className="text-sm">Sortir</h1>
                        <FaSort className="text-xs"/>
                    </button>
                    <button onClick={() => alert("Action not found")} className={`rounded-md px-3 py-2 duration-300 flex items-center gap-3 border border-zinc-300 dark:hover:bg-dark hover:bg-zinc-100 focus:bg-zinc-200 dark:focus:bg-darkSecondary`}>
                        <h1 className="text-sm">Filter</h1>
                        <FaFilter className="text-xs"/>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3">

                <button onClick={() => handlerLock()} title="Setting Privacy" className="border border-zinc-300 px-3 py-2 rounded-md flex items-center gap-1.5 capitalize text-sm">
                    <svg fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${dataBoard.project.privacy == -1 ? "":"hidden"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <svg fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${dataBoard.project.privacy == 1 ? "":"hidden"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-zinc-500 font-bold">{dataBoard.project.privacy == -1 ? "Private":"Public"}</p>
                    
                </button>

                <button onClick={() => setTheme(theme == "light" ? "dark":"light")} className="border border-zinc-300 px-3 py-2 rounded-md flex items-center gap-1.5 capitalize text-sm">
                    <svg fill="none" stroke="currentColor" className={`${theme == "light" ? "block":"hidden"} w-5 h-5`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    <svg fill="none" stroke="currentColor" className={`${theme == "dark" ? "block":"hidden"} w-5 h-5`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                    <p className="text-zinc-500 font-bold dark:text-zinc-200">{theme}</p>
                </button>
                <div className="flex items-center relative gap-1 group cursor-pointer border border-zinc-300 px-3 py-2 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-sm">{language == "id" ? "Indonesia":"Inggris"}</h1>
                    <svg className="w-3 h-3 group-hover:rotate-180 transition-all duration-300 delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    <div className="bg-white z-20 rounded-md shadow-xl text-sm dark:bg-dark invisible group-hover:visible absolute w-44 hover:visible group-hover:translate-y-0 translate-y-3 transition-all top-full right-0 delay-300 opacity-0 group-hover:opacity-100">
                        <button className="hover:bg-blue-50 w-full block rounded-md py-2 dark:hover:bg-darkPrimary text-start px-4 cursor-pointer" onClick={() => settingsLanguage("id")}>Bahasa Indonesia</button>
                        <button className="hover:bg-blue-50 w-full block rounded-md py-2 dark:hover:bg-darkPrimary text-start px-4 cursor-pointer" onClick={() => settingsLanguage("en")}>Bahasa Inggris</button>
                    </div>
                </div>

                <button disabled={dataBoard ? false:true} onClick={() => handlerSave()} className="disabled:bg-zinc-500 hover:bg-blue-400 transition-all bg-primary rounded-md text-white px-3 py-2 font-semibold text-sm flex items-center gap-2">
                    {lang("save")}
                    <FaSave />
                </button>
            </div>
        </div>
    </nav>
  )
}
