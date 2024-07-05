import { FaLanguage, FaMoon, FaSearch } from "react-icons/fa";

export default function NavbarAdmin() {
  return (
    <div className="w-full py-5 px-10">
        <div className="flex items-center justify-between">
            {/* content */}
            <div className="w-3/4">
                <div className="relative w-1/2">
                    <span className="inline-block absolute top-1/2 -translate-y-1/2"><FaSearch className="text-2xl text-zinc-400"/></span>
                    <input type="search" className="outline-none bg-transparent text-black text-xl py-5 pl-10 pr-5 w-full" placeholder="Search here..." />
                </div>
            </div>

            {/* profile */}
            <div className="w-fit rounded-3xl bg-blue-500 py-4 px-10 flex items-center gap-10">
                <button className="text-2xl"><FaMoon className="text-white" /></button>
                <button className="text-4xl"><FaLanguage className="text-white" /></button>

                <div className="relative">
                    <img className="object-cover w-14 h-14 rounded-full border-2 border-spacing-2 border-white" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100" alt="" />
                    <span className="absolute bottom-0 w-3 h-3 rounded-full bg-emerald-500 right-1 ring-1 ring-white"></span>
                </div>
            </div>
        </div>
    </div>
  )
}
