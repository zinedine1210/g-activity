import { useState } from "react";
import { FaBars, FaDownload, FaGripHorizontal, FaLink } from "react-icons/fa";


export default function AttachmentsTask() {
    const [active, setActive] = useState(1)
    const [view, setView] = useState(2)
  return (
    <>
        <h1 className="flex items-center gap-3 font-bold text-sm text-zinc-500 dark:text-zinc-300 mb-5"><FaLink /> Attachments</h1>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-base">
                <h1 className="font-bold">Show:</h1>
                <button onClick={() => setActive(1)} className={`px-2 py-1 rounded-md font-semibold transition-all duration-300 ${active == 1 ? "bg-zinc-500 text-white":" text-zinc-600"}`}>All</button>
                <button onClick={() => setActive(2)} className={`px-2 py-1 rounded-md font-semibold transition-all duration-300 ${active == 2 ? "bg-zinc-500 text-white":" text-zinc-600"}`}>Media</button>
                <button onClick={() => setActive(3)} className={`px-2 py-1 rounded-md font-semibold transition-all duration-300 ${active == 3 ? "bg-zinc-500 text-white":" text-zinc-600"}`}>Tautan</button>
                <button onClick={() => setActive(4)} className={`px-2 py-1 rounded-md font-semibold transition-all duration-300 ${active == 4 ? "bg-zinc-500 text-white":" text-zinc-600"}`}>Document</button>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setView(1)} className={`${view == 1 ? "bg-zinc-500 text-white":"bg-zinc-200 text-zinc-600"} px-2 py-1 rounded-md font-semibold transition-all duration-300`}>
                    <FaBars className="w-5 h-5"/>
                </button>
                <button onClick={() => setView(2)} className={`${view == 2 ? "bg-zinc-500 text-white":"bg-zinc-200 text-zinc-600"} px-2 py-1 rounded-md font-semibold transition-all duration-300`}>
                    <FaGripHorizontal className="w-5 h-5"/>
                </button>
                <button className={`text-sm bg-zinc-200 px-2 py-1 rounded-md font-semibold transition-all duration-300 flex items-center text-zinc-500 gap-2`}>
                    <FaDownload />
                    Download All
                </button>
            </div>
        </div>

        {
            view == 1 ?
            <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-black h-12 w-20">
                        </div>
                        <h1>Coba.jpg</h1>
                    </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-black h-12 w-20">
                        </div>
                        <h1>Coba.jpg</h1>
                    </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-black h-12 w-20">
                        </div>
                        <h1>Coba.jpg</h1>
                    </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-black h-12 w-20">
                        </div>
                        <h1>Coba.jpg</h1>
                    </div>
                </div>
            </div>
            :
            <div className="grid grid-cols-5 gap-3 mt-5">
                <div className="w-full h-32 bg-black text-white font-bold flex items-center justify-center">
                    File
                </div>
                <div className="w-full h-32 bg-black text-white font-bold flex items-center justify-center">
                    File
                </div>
                <div className="w-full h-32 bg-black text-white font-bold flex items-center justify-center">
                    File
                </div>
                <div className="w-full h-32 bg-black text-white font-bold flex items-center justify-center">
                    File
                </div>
            </div>
        }

    </>
  )
}
