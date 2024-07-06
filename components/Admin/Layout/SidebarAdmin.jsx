import Link from "next/link";
import { useRouter } from "next/router";
import { BsViewList } from "react-icons/bs";
import { FaGrinHearts, FaUser } from "react-icons/fa";

export default function SidebarAdmin() {
    const router = useRouter()
    const { pathname } = router
    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-300 rounded-3xl shadow-md overflow-y-hidden">
            <div className="flex-col flex h-full">
                <header className="py-8 px-5 w-full">
                    <h1 className="text-white text-2xl font-semibold ">HI, zinedine@gmail.com</h1>
                    <p className="text-white">Admin Panel</p>
                </header>
                <div className="w-full flex-1 overflow-y-auto space-y-2">
                    <Link href={"/admin"}>
                        <button className={`py-3 px-5 duration-300 ${pathname == "/admin" ? "bg-blue-400" : "hover:bg-blue-400"} w-full text-start flex items-center gap-3 text-white text-lg`}>
                            <FaGrinHearts className="text-2xl" />
                            <h1 className="font-semibold">Dashboard</h1>
                        </button>
                    </Link>
                    <Link href={"/admin/user"}>
                        <button className={`py-3 px-5 duration-300 ${pathname == "/admin/user" ? "bg-blue-600" : "hover:bg-blue-400"} w-full text-start flex items-center gap-3 text-white text-lg`}>
                            <FaUser className="text-2xl" />
                            <h1 className="font-semibold">User</h1>
                        </button>
                    </Link>
                </div>

                <footer className="p-5">
                    <div className="p-3 bg-blue-100 rounded-lg dark:bg-gray-800">
                        <h2 className="text-sm font-medium text-gray-800 dark:text-white">New feature availabel!</h2>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus harum officia eligendi velit.</p>

                        <img className="object-cover w-full h-32 mt-2 rounded-lg" src="https://images.unsplash.com/photo-1658953229664-e8d5ebd039ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&h=1374&q=80" alt="" />
                    </div>
                    <Link href={"/usr"}>
                        <button className={`py-3 px-5 duration-300hover:bg-blue-400 w-full text-start flex items-center gap-3 text-white text-lg`}>
                            <BsViewList className="text-2xl" />
                            <h1 className="font-semibold">Client Web</h1>
                        </button>
                    </Link>
                </footer>
            </div>

        </div>
    )
}
