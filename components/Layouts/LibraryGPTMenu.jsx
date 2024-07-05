import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "../../context/MyProvider"
import { useWorkspaces } from "../../utils/swr"
import { FaRocketchat, FaSlackHash } from "react-icons/fa"

export default function LibraryGPTMenu(props) {
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
        <div className={`${"/usr/workspaces/gpt" == router.asPath ? "bg-blue-100 dark:bg-darkSecondary":"hover:bg-zinc-100 dark:hover:bg-dark"} flex items-center justify-between px-3`}>
            <div onClick={() => handlerRouter("/usr/workspaces")} className="flex py-2 items-center text-sm font-normal text-zinc-900 dark:text-white cursor-pointer">
                <FaSlackHash className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"/>
                <span className="ml-3">Library GPT</span>
            </div>
            <button onClick={() => setOpen(!open)} className="hover:bg-blue-200 p-1 rounded-md transition-all duration-300">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className={`${open ? "rotate-180":""} w-4 h-4 transition-all duration-300`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </div>
        <ul className={`${open ? "":"hidden"}`}>
            <li className={`px-10 flex items-center py-2 text-sm font-normal text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-dark cursor-pointer`}>PDF</li>
            <li className={`px-10 flex items-center py-2 text-sm font-normal text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-dark cursor-pointer`}>Website</li>
        </ul>
    </li>
  )
}
