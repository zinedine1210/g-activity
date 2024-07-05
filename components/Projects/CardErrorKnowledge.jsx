import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaClipboard, FaEye, FaLink, FaTrash } from "react-icons/fa";
import { domainWebsite, urlData } from "../../context/MyProvider";
import { generateId, getTimeAgo } from "../../utils/function"
import { mutate } from "swr"

export default function CardErrorKnowledge({item, profileData}) {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);

    const handlerLink = () => {
        navigator.clipboard.writeText(`${domainWebsite}/usr/errorKnowledge?id=${item.id}`).then(() => {
            alert("Link copied to clipboard")
        })
        setOpen(false)
    }

    const handlerSalinan = async () => {
        console.log(item);
        let obj = JSON.parse(JSON.stringify(item))
        obj.id = generateId()
        obj.date = new Date()

        await fetch(`${urlData}/errorKnowledge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(res => {
            console.log(res);
            mutate(`${urlData}/errorKnowledge?projectID=${item.projectID}`)
            setOpen(false)
            alert("Success");
        })

    }

    const handlerDelete = async () => {
        await fetch(`${urlData}/errorKnowledge/${item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            mutate(`${urlData}/errorKnowledge?projectID=${item.projectID}`)
            setOpen(false)
            alert("Success");
        })
    }


  return (
    <div className="w-full relative shadow-lg h-36 group">
        <div className="overflow-hidden relative w-full h-full p-2 rounded-lg">
            <div className="w-6 bg-gradient-to-b z-10 from-orange-600 via-amber-600 to-orange-800 group-hover:from-orange-500 group-hover:via-amber-500 group-hover:to-orange-700 h-full absolute top-0 left-0 bg-black">
            </div>
            <Link href={`/usr/errorKnowledge?id=${item.id}`} target="_blank">
                <div className="h-full">
                    <div className="relative">
                        <div className="flex items-center gap-1">
                            <span className="bg-amber-400 flex items-center w-10 h-10 rounded-md justify-center text-lg font-extrabold text-white z-10 font-mono">{item.name ? item.name.charAt(0) :"--"}</span>
                            <div>
                                <h1 className="font-bold text-sm">{item.name ? item.name.length > 20 ? item.name.substring(0, 20)+"...":item.name:<span className="text-red-500">Untitled MOM</span>}</h1>
                                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300">Error Knowledge</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="absolute bottom-0 left-0 pl-8 border-t w-full pr-2 py-1 flex items-center justify-between">
                <h1 className="text-xs text-zinc-500 dark:text-zinc-300">{getTimeAgo(item.date)}</h1>
                <button className={`${open ? "bg-zinc-300 dark:bg-darkPrimary":""} dark:hover:bg-darkSecondary text-xs font-semibold py-1 px-2 hover:bg-zinc-300 rounded-md transition-all duration-300 flex items-center gap-2`} onClick={() => setOpen(!open)}>
                    Action
                    <FaChevronDown className={`w-2 ${open ? "rotate-180":""} transition-all duration-300`}/>
                </button>
            </div>
        </div>
        <div ref={dropdownRef} className="relative">
            <div className={`${open ? "block":"hidden"} bg-white dark:bg-darkPrimary rounded-md shadow-lg absolute top-full right-0 z-20`}>
                <ul className="text-sm">
                    
                    <li>
                        <Link href={`/usr/mom?id=${item.id}`} target="_blank">
                            <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2">
                                <FaEye className="text-zinc-500"/>
                                Open
                            </button>
                        </Link>
                    </li>
                    <li>
                        <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2" onClick={() => handlerSalinan()}>
                            <FaClipboard className="text-zinc-500"/>
                            Duplicate
                        </button>
                    </li>
                    <li>
                        <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2" onClick={() => handlerLink()}>
                            <FaLink className="text-zinc-500"/>
                            Dapatkan Link
                        </button>
                    </li>
                    <li className="border-t pt-2">
                        <button className="hover:bg-red-100 w-full py-2 text-start px-3 font-semibold flex items-center gap-2" onClick={() => handlerDelete()}>
                            <FaTrash className="text-red-500"/>
                            Hapus
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
