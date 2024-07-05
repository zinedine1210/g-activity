import { useContext, useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { MyContext } from "../../../context/MyProvider";
import ProjectRepository from "../../../repositories/ProjectRepository";

export default function AssignedTask(props) {
    const {item} = props
    const menuRef = useRef(null)
    const [menu, setMenu] = useState(false)
    const context = useContext(MyContext)


    const handleOutsideClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenu(false);
        }
    };

    useEffect(() => {
        if(!item.hasOwnProperty("uid")){
            item.uid = []
            context.setDataDocumentation(context.dataDocumentation)
        }


        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        async function getDataMember(){
            const getXA = JSON.parse(localStorage.getItem("XA"))
            const result = await ProjectRepository.getTeam({id:context.dataDocumentation.project.id, type:1, xa:getXA})
            console.log("getteam",result);
            context.dataDocumentation.project.members = result.data.data
            context.setDataDocumentation(context.dataDocumentation)
        }

        if(!context.dataDocumentation.hasOwnProperty("members")){
            getDataMember()
        }
    }, [])

    const handlerAddAssign = (value) => {
        item.uid.push(value)
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
                const filter = item.uid.filter(res => {
                    return res.uid != value.uid
                })
                let data = []
                filter.forEach(val => {
                    data.push(val)
                });
            
                item.uid = data
                setMenu(true)
            }
        })
    }

    if(context.dataDocumentation.project.hasOwnProperty("members"))
  return (
    <div className="flex items-center">
        <div className="flex -space-x-3">
            {
                item.hasOwnProperty("uid") ? item.uid.map((item, key) => {
                    return (
                        <span key={key} className="ring-2 ring-offset-2 ring-blue-400 ring-offset-gray-100 w-12 h-12 rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-white uppercase group text-xl">
                            <span onClick={() => handlerDeleteAssign(item)} className="bg-red-500 transition-all duration-300 text-white rounded-full w-5 h-5 absolute -top-2 flex items-center justify-center right-0 hover:bg-red-800 cursor-pointer z-20 border-2 border-white group-hover:visible invisible">
                                <svg fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                            {item.uid_docs.username.charAt(0)}
                        </span>
                    )
                })
                :"Loading"
            }

            <div ref={menuRef} className="relative">
                <span onClick={() => setMenu(true)} className={`${item.hasOwnProperty("uid") ? item.uid.length == context.dataDocumentation.project.members.length ? "hidden":"":""} ring-2 ring-offset-2 flex items-center justify-center relative hover:text-primary hover:border-primary transition-all cursor-pointer w-12 h-12 font-semibold border-2 border-dashed rounded-full bg-zinc-50 text-zinc-800 border-zinc-300`}><FaUserPlus /></span>
                <div className={`bg-white space-y-1 rounded-md shadow-xl absolute w-fit p-2 ${menu ? "visible opacity-100":"invisible opacity-0"}`}>
                    {
                        item.hasOwnProperty("uid") ? context.dataDocumentation.project.members.filter(res => {
                            const find = item.uid.find(opt => {
                                return res.uid == opt.uid
                            })

                            if(!find)
                            return res
                        }).map((member, key) => {
                            return (
                                <button onClick={() => handlerAddAssign(member)} key={key} className={`disabled:bg-zinc-100 hover:bg-zinc-100 px-3 py-2 flex items-center gap-3 cursor-pointer w-full`}>
                                    <span className="w-8 h-8 border rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase group">{member.uid_docs?.username.charAt(0)}</span>
                                    <div className="text-start">
                                        <h1 className="text-sm font-bold">{member.uid_docs?.username}</h1>
                                        <p className="text-xs">{member.uid_docs?.fullname}</p>
                                    </div>
                                </button>
                            )
                        })
                        :""
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
