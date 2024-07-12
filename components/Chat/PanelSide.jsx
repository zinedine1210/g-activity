import Drawer from "@components/Layouts/Drawer";
import { MyContext } from "context/MyProvider";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BsChatFill } from "react-icons/bs";
import { FaAddressBook } from "react-icons/fa";

export default function PanelSide({
    profileData
}) {
    const context = useContext(MyContext)
    const router = useRouter()
  return (
    <>
        <Drawer profileData={profileData}/>
        <div className="w-20 bg-gradient-to-br from-blue-500 to-blue-200 h-screen overflow-y-auto p-3 space-y-4">
            <button onClick={() => context.setData({ ...context, drawer: true })} className="w-full h-14 flex items-center justify-center bg-white text-blue-500 rounded-xl shadow-xl text-center duration-300 ease-in-out hover:scale-110">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            </button>
            <hr />
            <button onClick={() => router.push({ pathname: `/usr/chat`, query: router.query }, undefined, { shallow: true })} className="w-full h-14 flex items-center justify-center bg-white text-blue-500 rounded-xl shadow-xl text-center duration-300 ease-in-out hover:scale-110">
                <BsChatFill className="text-2xl" />
            </button>
            <button onClick={() => router.push({ pathname: `/usr/chat/contact`, query: router.query }, undefined, { shallow: true })} className="w-full h-14 flex items-center justify-center bg-white text-blue-500 rounded-xl shadow-xl text-center duration-300 ease-in-out hover:scale-110">
                <FaAddressBook className="text-2xl" />
            </button>
        </div>
    </>
  )
}
