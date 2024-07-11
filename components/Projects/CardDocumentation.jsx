import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaClipboard, FaEye, FaLink, FaTrash } from "react-icons/fa";
import { MyContext } from "../../context/MyProvider";
import { getTimeAgo } from "../../utils/function"
import { mutate } from "swr"
import DocumentationRepository from "../../repositories/DocumentationRepository";
import { hostName } from "../../repositories/Repository";
import Swal from "sweetalert2";


export default function CardDocumentation({ item, profileData }) {
    const [open, setOpen] = useState(false)
    const context = useContext(MyContext)
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
        navigator.clipboard.writeText(`${hostName}/usr/documentation?id=${item.id}`).then(() => {
            Swal.fire("Link copied to clipboard")
        })
        setOpen(false)
    }

    const handlerSalinan = async () => {
        delete item.id
        delete item.org_id


        const result = await DocumentationRepository.postDocumentation({ data: item, xa: JSON.parse(localStorage.getItem("XA")) })
        console.log(result);
        if (result.status == 0) {
            mutate(['documentation', 1, item.project_id], cache => {
                cache.data.push(result.data)
                return cache
            }, false)
            context.setDataDocumentation(context.dataDocumentation)
            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Successfully duplicated",
                timer: 1000,
                showConfirmButton: false
            })
            setOpen(false)
        }
    }

    const handlerDelete = () => {
        console.log("item", item)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await DocumentationRepository.deleteDocumentation({ id: item.id, xa: JSON.parse(localStorage.getItem('XA')) })
                console.log(result);
                if (result.status == 0) {
                    mutate(['documentation', 1, item.project_id], cache => {
                        const newData = cache.data.filter(res => {
                            return res.id != item.id
                        })
                        // console.log(newData, cache);
                        console.log(newData);

                        cache.data = newData
                        return cache
                    }, false)
                    context.setDataDocumentation(context.dataDocumentation)
                    Swal.fire({
                        icon: "success",
                        position: "top-end",
                        title: "Successfully removed",
                        timer: 1000,
                        showConfirmButton: false
                    })

                    setOpen(false)
                }
            }
        })
    }


    return (
        <div className="w-full relative h-36 group">
            <div className="overflow-hidden relative w-full shadow-lg dark:border dark:border-darkSecondary h-full p-2 rounded-lg">
                <div className="w-6 bg-gradient-to-b z-10 from-red-600 via-pink-600 to-red-800 group-hover:from-red-500 group-hover:via-pink-500 group-hover:to-red-700 h-full absolute top-0 left-0 bg-black">
                </div>
                <Link href={`/usr/documentation?id=${item.id}`}>
                    <div className="h-full">
                        <div className="relative">
                            <div className="flex items-center gap-1">
                                <span className="bg-pink-400 flex items-center w-10 h-10 rounded-md justify-center text-lg font-extrabold text-white z-10 font-mono">{item.hasOwnProperty("name") ? item.name.charAt(0) : "--"}</span>
                                <div>
                                    <h1 className="font-bold text-sm">{item.hasOwnProperty("name") ? item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name : <span className="text-red-500">Untitled Documentation</span>}</h1>
                                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300">Documentation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="absolute bottom-0 left-0 pl-8 border-t w-full pr-2 py-1 flex items-center justify-between">
                    <h1 className="text-xs text-zinc-500 dark:text-zinc-300">{item?._cd && getTimeAgo(item?._cd.epoch_time * 1000)}</h1>
                    <button className={`${open ? "bg-zinc-300 dark:bg-darkPrimary" : ""} dark:hover:bg-darkSecondary text-xs font-semibold py-1 px-2 hover:bg-zinc-300 rounded-md transition-all duration-300 flex items-center gap-2`} onClick={() => setOpen(!open)}>
                        Action
                        <FaChevronDown className={`w-2 ${open ? "rotate-180" : ""} transition-all duration-300`} />
                    </button>
                </div>
            </div>
            <div ref={dropdownRef} className="relative">
                <div className={`${open ? "block" : "hidden"} bg-white dark:bg-darkPrimary dark:bg-dark rounded-md shadow-lg absolute top-full right-0 z-20`}>
                    <ul className="text-sm">

                        <li>
                            <Link href={`/usr/documentation?id=${item.id}`}>
                                <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2">
                                    <FaEye className="text-zinc-500" />
                                    Open
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2" onClick={() => handlerSalinan()}>
                                <FaClipboard className="text-zinc-500" />
                                Duplicate
                            </button>
                        </li>
                        <li>
                            <button className="hover:bg-zinc-100 w-full py-2 text-start dark:hover:bg-darkSecondary px-3 font-semibold flex items-center gap-2" onClick={() => handlerLink()}>
                                <FaLink className="text-zinc-500" />
                                Dapatkan Link
                            </button>
                        </li>
                        <li className="border-t pt-2">
                            <button className="hover:bg-red-100 w-full py-2 text-start px-3 font-semibold flex items-center gap-2" onClick={() => handlerDelete()}>
                                <FaTrash className="text-red-500" />
                                Hapus
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
