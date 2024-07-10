import { useRouter } from "next/router"
import { useContext } from "react";
import { MyContext } from "../../context/MyProvider";
import MenuWorkspaces from "./MenuWorkspaces";
import { useTheme } from "next-themes";
import { FaGreaterThan, FaRocketchat, FaVideo } from "react-icons/fa";
import LibraryGPTMenu from "./LibraryGPTMenu";
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";
import { BsChat } from "react-icons/bs";


export default function Drawer(props) {
    const router = useRouter()
    const {theme, setTheme} = useTheme()
    const context = useContext(MyContext)

    const handlerRouter = (route) => {
        context.setData({...context, drawer:false})
        router.push(route)
    }

    const handlerLogout = () => {
        localStorage.removeItem("role")

        router.push("/")
    }

    const isAdmin = () => {
        const prof = props.profileData._feature
        return prof?._role
        ?? false
    }
  return (
    <div id="drawer-navigation" className={`${context.drawer ? "translate-x-0":"-translate-x-96"} duration-300 transition-all shadow-xl fixed z-40 h-screen overflow-y-auto bg-gradient-to-br from-blue-600 via-blue-500 to-blue-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-400 w-72 dark:bg-darkPrimary grid grid-cols-1 content-between`}>
        <div className="">
            <div className="py-5 mb-5 px-4 border-b">
                <h5 className="text-base font-bold uppercase text-white dark:text-white">Your Activity Menus</h5>
                <button onClick={() => context.setData({...context, drawer:false})} type="button" className="text-white duration-300 bg-blue-600 dark:bg-black hover:bg-blue-400 hover:text-zinc-900 rounded-lg text-sm p-1 absolute top-0 translate-y-1/2 right-2 inline-flex items-center dark:hover:bg-darkSecondary dark:hover:text-white" >
                    <HiChevronLeft className="text-xl"/>
                </button>
            </div>
            <ul>
                <li onClick={() => handlerRouter("/usr")} className={`${"/usr" == router.asPath ? "bg-gradient-to-r dark:from-zinc-500 dark:to-zinc-600 from-blue-400 to-blue-500 dark:bg-darkSecondary":""} flex items-center px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-dark cursor-pointer`}>
                    <svg aria-hidden="true" className="w-5 h-5 text-white transition duration-75 group-hover:text-white dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                    <span className="ml-3">Dashboard</span>
                </li>
                <MenuWorkspaces profileData={props.profileData}/>
                <li onClick={() => handlerRouter("/usr/videoCall")} className={`${"/usr/videoCall" == router.asPath ? "bg-gradient-to-r dark:from-zinc-500 dark:to-zinc-600 from-blue-400 to-blue-500 dark:bg-darkSecondary":""} flex items-center px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-dark cursor-pointer`}>
                    <FaVideo className="w-5 h-5 text-white transition duration-75 group-hover:text-white dark:group-hover:text-white"/>
                    <span className="ml-3">Video Call</span>
                </li>
                <li onClick={() => handlerRouter("/usr/chat")} className={`${"/usr/chat" == router.asPath ? "bg-gradient-to-r dark:from-zinc-500 dark:to-zinc-600 from-blue-400 to-blue-500 dark:bg-darkSecondary":""} flex items-center px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-dark cursor-pointer`}>
                    <BsChat className="w-5 h-5 text-white transition duration-75 group-hover:text-white dark:group-hover:text-white"/>
                    <span className="ml-3">Chat</span>
                </li>
                {/* <LibraryGPTMenu /> */}
            </ul>
        </div>
        <div className="">
            <div className="md:hidden">
                <div className="flex items-center p-2 mt-12 space-x-4 justify-self-end">
                    <span className="flex items-center justify-center text-xl uppercase w-12 h-12 rounded-lg bg-zinc-600">
                        {props.profileData.hasOwnProperty("username") ? props.profileData.username.charAt(0):""}
                    </span>
                    <div>
                        <h2 className="text-base font-semibold">{props.profileData.hasOwnProperty("username") ? props.profileData.username.length > 15 ? props.profileData.username.substring(0, 15)+"..." : props.profileData.username :""}</h2>
                        <span className="flex items-center space-x-1">
                            <a rel="noopener noreferrer" href="#" className="text-xs hover:underline">View profile</a>
                        </span>
                    </div>
                </div>
                <button className="text-white dark:text-white hover:bg-blue-800 dark:hover:bg-dark cursor-pointer flex p-3 items-center gap-3 justify-between w-full" onClick={() => setTheme(theme == "light" ? "dark":"light")}>
                    <h1 className="font-bold">Theme</h1>

                    <div className="flex items-center justify-center gap-3 relative">
                        <svg className={`w-6 h-6 cursor-pointer peer ${theme == "light" ? "opacity-100 visible":"invisible opacity-0"} rotate-180 transition-all duration-500 ease-in-out`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
            
                        {/* <!-- moon icon --> */}
                        <svg className={`fill-white w-6 h-6 absolute cursor-pointer ${theme == "dark" ? "opacity-100 visible":"invisible opacity-0"} transition-all duration-500 ease-in-out`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                    </div>
                </button>
            </div>
            <div className="hidden xl:block py-2">
                {
                    isAdmin() && (
                        <Link href={`/admin`}>
                            <button className="text-white py-3 hover:bg-blue-500 px-5 rounded-md w-full flex items-center gap-2 text-center"><FaGreaterThan/> Admin Panel</button>
                        </Link>

                    )
                }
            </div>
        </div>
    </div>
  )
}
