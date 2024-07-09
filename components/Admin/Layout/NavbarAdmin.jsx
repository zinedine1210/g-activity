import AuthRepository from "@repositories/AuthRepository";
import { Notify } from "@utils/scriptApp";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLanguage, FaMoon, FaSearch } from "react-icons/fa";

export default function NavbarAdmin() {
    const router = useRouter()
    const handlerLogout = async () => {
        const getXA = JSON.parse(localStorage.getItem("XA"))
        if (getXA) {
          const result = await AuthRepository.postLogout({ "XA": getXA })
          if (result.status == 0 || result.status == "Logged out") {
            localStorage.removeItem("XA")
            localStorage.removeItem("profileData")
            router.push("/")
            Notify("Logout", "info")
          }
        } else {
          router.push("/")
        }
      }

  return (
    <div className="w-full py-5 px-10">
        <div className="flex items-center justify-between">
            {/* content */}
            <div className="w-3/4">
                <div className="relative w-1/2">
                    <span className="inline-block absolute top-1/2 -translate-y-1/2"><FaSearch className="text-xl text-zinc-400"/></span>
                    <input type="search" className="outline-none bg-transparent text-black py-5 pl-10 pr-5 w-full" placeholder="Search here..." />
                </div>
            </div>

            {/* profile */}
            <div className="w-fit rounded-3xl bg-blue-500 py-4 px-8 flex items-center gap-6">
                <button className="text-xl"><FaMoon className="text-white" /></button>
                <button className="text-3xl"><FaLanguage className="text-white" /></button>

                <div className="relative group cursor-pointer">
                    <img className="object-cover w-10 h-10 rounded-full border-2 border-spacing-2 border-white" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100" alt="" />
                    <span className="absolute bottom-0 w-3 h-3 rounded-full bg-emerald-500 right-1 ring-1 ring-white"></span>

                    <div className="z-20 hover:visible hover:opacity-100 hover:translate-y-0 group-hover:visible invisible translate-y-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all backdrop-blur-md w-44 absolute top-full right-0 shadow-2xl rounded-xl overflow-hidden duration-300 ease-in-out">
                        <button className="w-full hover:bg-blue-200 text-start px-8 py-2 ease-in-out text-sm font-bold">Profile</button>
                        <Link href={"/usr"}>
                            <button className="w-full hover:bg-blue-200 text-start px-8 py-2 ease-in-out text-sm font-bold">Client Web</button>
                        </Link>
                        <button onClick={() => handlerLogout()} className="w-full hover:bg-blue-200 text-start px-8 py-2 ease-in-out text-sm font-bold">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
