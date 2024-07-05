import { useContext, useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { MyContext, urlData } from "../../context/MyProvider";
import { useProject } from "../../utils/swr";
import useSWR from "swr"
import { fetcherData } from "../../utils/function";
import Swal from "sweetalert2";

export default function AssignLogs(props) {
    const {item, handlerChange} = props
    const menuRef = useRef(null)
    const [menu, setMenu] = useState(false)
    const context = useContext(MyContext)
    const dataProject = useSWR(`${urlData}/projects?id=${context.dataDocumentation.projectID}`, fetcherData)
    // const dataProject = useProject(context.dataDocumentation.projectID)

    const handleOutsideClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerAddAssign = (value) => {
        item.push(value)

        handlerChange(item)
        setMenu(false)
    }

    const handlerDeleteAssign = (value) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const filter = item.filter(res => {
                    return res.email != value.email
                })
                let data = []
                filter.forEach(val => {
                    data.push(val)
                });
        
                handlerChange(data)
                setMenu(true)
            }
        })
    }

    if(!dataProject.isLoading)
  return (
    <div className="flex items-center">
        <div className="flex -space-x-3">
            {
                item.map((item, key) => {
                    return (
                        <span key={key} className="w-12 h-12 border rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">
                            <span onClick={() => handlerDeleteAssign(item)} className="bg-red-500 transition-all duration-300 text-white rounded-full w-5 h-5 absolute -top-1 flex items-center justify-center right-1 hover:bg-red-800 cursor-pointer z-20 border-2 border-white group-hover:visible invisible">
                                <svg fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                            {item.email.charAt(0)}
                        </span>
                    )
                })
            }

            <div ref={menuRef} className="relative">
                <span onClick={() => setMenu(true)} className="flex items-center justify-center relative hover:text-primary hover:border-primary transition-all cursor-pointer w-12 h-12 font-semibold border-2 border-dashed rounded-full bg-zinc-50 text-zinc-800 border-zinc-300"><FaUserPlus /></span>
                <div className={`bg-white space-y-1 rounded-md shadow-xl absolute w-fit p-2 ${menu ? "visible opacity-100":"invisible opacity-0"}`}>
                    {
                        dataProject.data[0].members.map((member, key) => {
                            const choose = item.find(res => {
                                return res.email == member.email
                            })
                            return (
                                <button disabled={choose ? true:false} onClick={() => handlerAddAssign(member)} key={key} className={`disabled:bg-zinc-100 hover:bg-zinc-100 px-3 py-2 flex items-center gap-3 cursor-pointer w-full`}>
                                    <span className="w-8 h-8 border rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{member.email.charAt(0)}</span>
                                    <h1>{member.email}</h1>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
