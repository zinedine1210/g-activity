import { useContext, useState } from "react";
import TableUser from "./TableUser";
import { MyContext } from "../../../context/MyProvider";
import ModalUser from "./ModalUser";
import { BsPlus } from "react-icons/bs";

export default function MainUser() {
    const context = useContext(MyContext)
    const [keyword, setKeyword] = useState("")

  return (
    <div className="w-full">
        <div className={`my-5 w-full xl:w-full`}>
            <div className="xl:flex items-center justify-between mb-5">
                <input type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-search w-full xl:w-auto" placeholder="Search" />
                <div className="xl:flex items-center gap-2 mt-2 xl:mt-0 space-y-2 xl:space-y-0">
                    <button className="btn-secondary" onClick={() => context.setData({...context, dataUserAdmin:null})}>Refresh </button>
                    <button className="btn-primary" onClick={() => context.setData({...context, modal:{ name:"modalUser", type:"create", data:null}})}><BsPlus className="text-2xl" /></button>
                </div>
            </div>
            <div>
                <TableUser keyword={keyword} />
            </div>
            {
                context?.modal?.name == "modalUser" && <ModalUser />
            }
        </div>
    </div>
  )
}
