import SubmenuComponent from "@components/Templates/SubmenuComponent"
import { Notify } from "@utils/scriptApp"
import { MyContext } from "context/MyProvider"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { BsGrid, BsList, BsStar } from "react-icons/bs"
import { HiOutlineChartPie, HiOutlineChat, HiOutlineVideoCamera, HiUser, HiUsers } from "react-icons/hi"
import Swal from "sweetalert2"

export default function SidebarMenu({
    profileData
}) {
    const context = useContext(MyContext)
    const open = context.drawer
    const router = useRouter()
    const pathname = router.pathname
    const [active, setActive] = useState(null)

    const handleRouter = url => {
        router.push(url)
    }

    useEffect(() => {
        const drawerlocal = JSON.parse(localStorage.getItem("drawer"))
        // kalau reload
        if (open == null) {
            console.log("gada", drawerlocal)
            if (drawerlocal == undefined) {
                localStorage.setItem("drawer", true)
                context.setData({ ...context, drawer: true })
            } else {
                context.setData({ ...context, drawer: drawerlocal })
            }
        }
    }, [open])

    useEffect(() => {
        if (!active) {
            console.log(profileData)
            const bitws = profileData._bitws
            const featureaccess = profileData._feature
            let isdeny = false
            switch (router.pathname) {
                case "/admin/user":
                    isdeny = Number(featureaccess?._user & bitws["view"]) == 0 ? true : false
                    console.log(featureaccess?._user & bitws["view"])
                    if (isdeny) { // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/role":
                    isdeny = Number(featureaccess["_role"] & bitws["view"]) == 0 ? true : false
                    if (isdeny) { // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/feature":
                    isdeny = Number(featureaccess["_feature"] & bitws["view"]) == 0 ? true : false
                    if (isdeny) { // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/enum":
                    isdeny = Number(featureaccess["_enum"] & bitws["view"]) == 0 ? true : false
                    if (isdeny) { // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                default:
                    break;
            }
            setActive(true)
        }
    }, [active])


    const isThisPage = (path) => {
        const pathnamecut = pathname.substring(4)
        if (pathnamecut.includes(path)) {
            return true
        } else return false

    }

    let menus = {
        client: [
            {
                url: "/usr",
                featurename: "_dashboard",
                label: "Dashboard",
                icon: <HiOutlineChartPie className={`${isThisPage("/usr") ? open ? "text-white scale-150" : "text-white scale-100" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/usr"
            },
            {
                url: "/usr/workspaces",
                featurename: "workspace",
                label: "Workspaces",
                icon: <BsGrid className={`${isThisPage("/workspaces") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/workspaces"
            },
            {
                url: "/usr/videoCall",
                featurename: "meet",
                label: "Video Call",
                icon: <HiOutlineVideoCamera className={`${isThisPage("/videoCall") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/videoCall"
            },
            {
                url: "/usr/chat",
                featurename: "chat_room",
                label: "Chat",
                icon: <HiOutlineChat className={`${isThisPage("/chat") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/chat"
            }
        ],
        admin: [
            {
                url: "/admin/user",
                featurename: "_user",
                label: "Users",
                icon: <HiUser className={`${isThisPage("/user") ? open ? "text-white scale-150" : "text-white scale-100" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/user"
            },
            {
                url: "/admin/feature",
                featurename: "_feature",
                label: "Feature",
                icon: <BsStar className={`${isThisPage("/feature") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/feature"
            },
            {
                url: "/admin/role",
                featurename: "_role",
                label: "Role",
                icon: <HiUsers className={`${isThisPage("/role") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/role"
            },
            {
                url: "/admin/enum",
                featurename: "_enum",
                label: "Enum",
                icon: <BsList className={`${isThisPage("/enum") ? open ? "text-white scale-150" : "text-white scale-125" : open ? "text-zinc-500 scale-150" : "text-zinc-500 hover:text-blue-500 scale-125"} w-8 h-8 transition-all duration-200`} />,
                active: "/enum"
            }
        ]
    }

    const authorValidation = () => {
        const bitws = profileData._bitws
        const featureaccess = profileData._feature
        let isdeny = false
        const find = menus.client.find(res => pathname.includes(res.url)) ?? menus.admin.find(res => pathname.includes(res.url))

        isdeny = Number(featureaccess[find.featurename] & bitws["view"]) == 0 ? true:false

        if(isdeny){ // cek apakah dia memiliki akses ke menu ini pada view
            Swal.fire({
                title: "Unauthorize!!",
                text: "You don't have permission to access this page",
                icon: "info",
                showConfirmButton: false,
                timer: 2000,
                position: "top-right"
            })
            router.push("/usr")
        }
    }

    useEffect(() => {
        if(!active){
            authorValidation()
            setActive(true)
        }
    }, [active])

    const bitws = profileData?._bitws?.view
    const featureaccess = profileData?._feature

    if (open !== null)
        return (
            <div className="w-auto flex">
                <div className={`${open ? "w-72 max-w-72" : "w-20"} bg-zinc-100 transition-all duration-200 overflow-hidden h-screen`}>
                    <div className="flex-col flex h-full">

                        <header className={`w-full h-auto ${open ? "p-5" : "py-5"}`}>
                            <div className="flex items-center gap-2 w-full">
                                <img src="/images/logo/logo.png" alt="Logo gai" className={`${!open && "mx-auto"} w-12 h-12`} />
                                <div className={`${!open && "hidden"}`}>
                                    <h1 className=" font-bold text-xl">GAI Activity</h1>
                                    <p className="text-sm ">Your activity Menus</p>
                                </div>
                            </div>
                        </header>
                        <div className={`w-full flex-1 overflow-y-auto ${open && "pr-5 mt-5"}`}>
                            <h1 className={`${!open && "hidden"} px-5 font-bold pb-3 uppercase text-zinc-700`}>Menus</h1>
                            {
                                menus.client.map((men, index) => {
                                    return (
                                        <button key={index} onClick={() => handleRouter(men.url)} className={`${isThisPage(men.active) ? open ? "rounded-r-full bg-sky-500/20" : "" : open ? "hover:bg-zinc-200 rounded-r-full" : ""} duration-300 ease-in-out w-full px-5 py-1.5 text-center flex items-center gap-5 `}>
                                            <span className={`  flex items-center justify-center w-10 h-10 rounded-full p-3 -ml-1 ${isThisPage(men.active) ? "bg-blue-500" : ""}`}>{men.icon}</span>
                                            <h1 className={`${isThisPage(men.active) ? "text-black font-bold" : "text-zinc-600"} ${open ? "not-sr-only opacity-100 delay-100" : "sr-only opacity-0"} duration-200`}>{men.label}</h1>
                                        </button>
                                    )
                                })
                            }

                            <div className="w-full">
                                {
                                    menus?.admin?.filter(res => {
                                        if (Number(featureaccess?.[res.featurename] & bitws) == 1) {
                                            return true
                                        } else return false
                                    }).map((men, index) => {
                                        return (
                                            <>
                                                {
                                                    index == 0 && <h1 className={`${!open && "hidden"} px-5 font-bold py-3 uppercase text-zinc-700`}>Admin Panel</h1>
                                                }
                                                <button key={index} onClick={() => handleRouter(men.url)} className={`${isThisPage(men.active) ? open ? "rounded-r-full bg-sky-500/20" : "" : open ? "hover:bg-zinc-200 rounded-r-full" : ""} duration-300 ease-in-out w-full px-5 py-1.5 text-center flex items-center gap-5 `}>
                                                    <span className={`  flex items-center justify-center w-10 h-10 rounded-full p-3 -ml-1 ${isThisPage(men.active) ? "bg-blue-500" : ""}`}>{men.icon}</span>
                                                    <h1 className={`${isThisPage(men.active) ? "text-black font-bold" : "text-zinc-600"} ${open ? "not-sr-only opacity-100 delay-100" : "sr-only opacity-0"} duration-200`}>{men.label}</h1>
                                                </button>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <footer className="py-5">
                            {/* <div className="p-2">
                        <div className="p-3 bg-blue-100 rounded-lg dark:bg-gray-800">
                            <h2 className="text-sm font-medium text-gray-800 dark:text-white">New feature availabel!</h2>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus harum officia eligendi velit.</p>

                            <img className="object-cover w-full h-32 mt-2 rounded-lg" src="https://images.unsplash.com/photo-1658953229664-e8d5ebd039ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&h=1374&q=80" alt="" />
                        </div>
                    </div> */}
                            {/* <Link href={"/usr"}>
                        <button className={`py-3 px-5 duration-300 hover:bg-blue-400 w-full text-start flex items-center gap-3 text-white text-lg`}>
                            <BsViewList className="text-2xl" />
                            <h1 className="font-semibold">Client Web</h1>
                        </button>
                    </Link> */}
                        </footer>
                    </div>
                </div>

                <SubmenuComponent pathname={pathname} />
            </div>
        )
}
