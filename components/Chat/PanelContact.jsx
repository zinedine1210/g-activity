import ChatCollection from "@repositories/ChatCollection";
import { Notify } from "@utils/scriptApp";
import { MyContext } from "context/MyProvider";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { BsChevronLeft, BsSearch } from "react-icons/bs";
import ModalContact from "./ModalContact";

export default function PanelContact() {
  const context = useContext(MyContext)
  const statename = "dataContact"
  const getAllContact = async () => {
    const getxa = JSON.parse(localStorage.getItem("XA"))
    const result = await ChatCollection.getContact({
        xa: getxa
    })
    if(result.status == 0){
        context.setData({ ...context, [statename]: result.data })
    }else Notify("Something went wrong when get contact", 'error')
  }

  useEffect(() => {
    if(!context[statename]) getAllContact()
  }, [context[statename]])

  const isActiveModal = context?.modal?.name == "newcontact"

  return (
    <div className="w-full xl:w-1/4 h-screen overflow-y-hidden">
        <div className="flex-col flex h-full">
            <header className="w-full border-b-2 border-blue-500 shadow-md px-2 py-1">
                <div className="flex items-center">
                    <div className="flex items-center gap-1">
                        <Link href={"/usr/chat"}>
                            <button className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
                                <BsChevronLeft />
                            </button>
                        </Link>
                    </div>
                    <div className="relative w-full">
                        <BsSearch className="absolute top-1/2 -translate-y-1/2 left-3"/>
                        <input type="search" className="outline-none w-full py-3 pl-10 text-sm placeholder:text-zinc-500" placeholder="Search Contact" />
                    </div>
                </div>
            </header>
            
            <div className="w-full flex-1 overflow-y-auto space-y-2 relative">
                {isActiveModal && <ModalContact statename={statename} />}
            </div>

            <footer>
                <button onClick={() => context.setData({...context, modal: { name: "newcontact", type: "create" }})} className="px-5 hover:bg-blue-200 py-3 text-sm w-full duration-300 ease-in-out font-semibold border-t-2 flex items-center justify-center gap-2">
                    New Contact
                </button>
            </footer>
        </div>
    </div>
  )
}
