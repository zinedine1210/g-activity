import { BsChat, BsSearch } from "react-icons/bs";
import { FaAddressBook, FaEllipsisV, FaUsers } from "react-icons/fa";
import DropdownChat from "./DropdownChat";
import { useRouter } from "next/router";
import { Notify } from "@utils/scriptApp";

export default function PanelList({
    profileData
}) {
    const router = useRouter()
    const { id } = router.query;

    let optionsChat = [
        {
            label: "All your contact",
            icon: <FaAddressBook className="text-zinc-600 text-lg"/>,
            action: (value) => {
                router.push("/usr/chat/contact")
            }
        },
        {
            label: "Refresh Room",
            icon: <BsChat className="text-zinc-600 text-lg"/>,
            action: (value) => {

            }
        },
        {
            label: "Create Group",
            icon: <FaUsers className="text-zinc-600 text-lg"/>,
            action: (value) => {
                Notify("Action not found", "info")
            }
        },
    ]
  return (
    <div className="w-full xl:w-1/4 h-screen overflow-y-hidden">
        <div className="flex-col flex h-full">
            <header className="w-full border-b-2 border-blue-500 shadow-md px-2 py-1">
                <div className="flex items-center gap-2">
                    <div className="relative w-full">
                        <BsSearch className="absolute top-1/2 -translate-y-1/2 left-3"/>
                        <input type="search" className="outline-none w-full py-3 pl-10 text-sm placeholder:text-zinc-500" placeholder="Search available chat" />
                    </div>
                    <div className="flex items-center gap-1">
                        <DropdownChat options={optionsChat} label={<FaEllipsisV className="text-blue-500"/>} />
                    </div>
                </div>
            </header>
            
            <div className="w-full flex-1 overflow-y-auto space-y-2">
                
            </div>

            <footer className="">
                <button className="px-5 hover:bg-blue-200 py-3 text-sm w-full duration-300 ease-in-out font-semibold border-t-2 flex items-center gap-2 justify-center">
                    New Room
                </button>
            </footer>
        </div>
    </div>
  )
}


