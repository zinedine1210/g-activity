import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "../../context/MyProvider"
import { useWorkspaces } from "../../utils/swr"
import {HiViewGrid} from "react-icons/hi"

export default function MenuWorkspaces(props) {
    const dataMyWorkspace = useWorkspaces(1, JSON.parse(localStorage.getItem("XA")))
    const dataShareWorkspace = useWorkspaces(2, JSON.parse(localStorage.getItem("XA")))
    const router = useRouter()
    const [open, setOpen] = useState(true)
    const dropRef = useRef(null)
    const context = useContext(MyContext)

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    const handlerRouter = (route) => {
        context.setData({...context, drawer:false})
        router.push(route)
    }
    
  return (
    <li ref={dropRef}>
        <div className={`${"/usr/workspaces" == router.asPath ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white dark:bg-darkSecondary":"hover:bg-blue-700 dark:hover:bg-dark"} flex items-center justify-between px-3`}>
            <div onClick={() => handlerRouter("/usr/workspaces")} className="flex py-2 items-center text-sm font-semibold text-white dark:text-white cursor-pointer">
                <HiViewGrid className="w-5 h-5 text-white transition duration-75 group-hover:text-zinc-900 dark:group-hover:text-white"/>
                <span className="ml-3">Workspaces</span>
            </div>
            <button onClick={() => setOpen(!open)} className="hover:bg-blue-200 group p-1 rounded-md transition-all duration-300">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className={`${open ? "rotate-180":""} w-4 h-4 transition-all duration-300 text-white group-hover:text-black`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </div>
        <ul className={`${open ? "":"hidden"}`}>
            <li className="text-sm font-bold text-white dark:text-zinc-300 mx-10 py-2 uppercase border-b">Your Work</li>
            {
                !dataMyWorkspace ?
                <div className="w-full bg-zinc-100 animate-pulse"></div>
                :
                dataMyWorkspace?.data?.data?.map((menu, key) => {
                    return (
                        <>
                            <li key={key} onClick={() => handlerRouter(`/usr/workspaces/${menu.name}?id=${menu.id}`)} className={`cursor-pointer px-10 py-2 text-sm text-zinc-200 font-semibold flex items-center gap-2 ${`/usr/workspaces/${menu.name}?id=${menu.id}` == router.asPath ? "text-black bg-blue-100 dark:bg-darkSecondary":"hover:bg-zinc-100 hover:text-black dark:hover:text-white dark:hover:bg-dark"}`}>
                                <span className="w-2 h-2 rounded-full bg-green-400 block"></span>
                                {menu.name}
                            </li>
                        </>
                    )
                })
            }

            <li className="text-sm font-bold text-white dark:text-zinc-300 mx-10 py-2 uppercase border-b">Share With You</li>
            {
                !dataShareWorkspace ?
                <div className="w-full bg-zinc-100 animate-pulse"></div>
                :
                dataShareWorkspace?.data?.data?.map((menu, key) => {
                    return (
                        <li key={key} onClick={() => handlerRouter(`/usr/workspaces/${menu.name}?id=${menu.id}`)} className={`cursor-pointer px-10 py-2 text-sm text-zinc-200 font-semibold flex items-center gap-2 ${`/usr/workspaces/${menu.name}?id=${menu.id}` == router.asPath ? "text-black bg-blue-100 dark:bg-darkSecondary":"hover:bg-zinc-100 hover:text-black dark:hover:bg-dark"}`}>
                            <span className="w-2 h-2 rounded-full bg-green-400 block"></span>
                            {menu.name}
                        </li>
                    )
                })
            }
        </ul>
    </li>
  )
}
