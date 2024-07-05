import { useContext, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { MyContext } from "../../../context/MyProvider"

export default function Mention({data, record}) {
    const context = useContext(MyContext)
    const dropRef = useRef(null)
    const [open, setOpen] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerChange = async (value) => {
        data.push(value)
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerCheck = value => {
        // console.log(value);
        if(value.includes("@")){
            setOpen(true)
        }else{
            setOpen(false)
        }
    }
    

    const handlerKey = (e, type, urutan) => {
        // console.log(e.key);
        if(e.key == "Enter"){
            // console.log(e.target.value);
            const find = context.dataDocumentation.participants.find(res => {
                return res.name == e.target.value
            })

            if(!find){
                return Swal.fire({
                    title:"Participant not found",
                    timer:1000,
                    icon:"warning"
                })
            }
            let obj = {
                email:e.target.value,
                jabatan:null, 
                company:null
            }
            handlerChange(obj)
        }
        if(e.key == "ArrowUp"){
            if(urutan > 0){
                document.getElementById(`user-${record.id}-${urutan - 1}`).focus()
            }
        }
        if(e.key == "ArrowDown"){
            if(urutan + 1 >= data.length){
                document.getElementById(`mentionPoint-${record.id}`).focus()
            }else{
                document.getElementById(`user-${record.id}-${urutan + 1}`).focus()
            }
        }
        if(e.key == "Backspace"){
            if(type == "button"){
                data.splice(urutan, 1)
                if(urutan >= data.value.length){
                    document.getElementById(`mentionPoint-${record.id}`).focus()
                }else{
                    document.getElementById(`user-${record.id}-${urutan}`).focus()
                }
            }else{
                if(e.target.value == ""){
                    data.splice(urutan - 1, 1)
                }
            }
        }
        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div className="flex items-center gap-1 flex-wrap w-full">
        {
            data.map((user, key) => {
                // cek apakah terdapat dalam participants
                // const find = context.dataDocumentation.participants.find(res => {
                //     return res.email == user.email
                // })

                return (
                    <button id={`user-${record.id}-${key}`} onKeyDown={e => handlerKey(e, "button", key)} className={"text-start outline-none focus:bg-red-500 w-fit block px-2 py-1 bg-blue-500 rounded-md text-white"}>@{user.name.length > 10 ? user.name.substring(0, 10)+"...":user.name}</button>
                )
            })
        }
        
        <div ref={dropRef}>
            <input type="text" autoComplete="off" className="bg-inherit outline-none px-2 py-1 text-base text-zinc-600 dark:text-zinc-300" id={`mentionPoint-${record.id}`} onKeyDown={e => handlerKey(e, null, data.length)} placeholder={"Type @ to mention"} onChange={e => handlerCheck(e.target.value)}/>
            <div className={`${open ? "":"hidden"} top-full w-fit bg-white shadow-xl py-1 z-20`}>
                {
                    context.dataDocumentation.participants.filter(res => {
                        if(res.name)
                        return res
                    }).length > 0 ? context.dataDocumentation.participants.filter(res => {
                        const findData = data.find(opt => {
                            return res.uid == opt.uid
                        })
                        if(res.name && !findData)
                        return res
                    }).map((user, key) => {
                        return (
                            <button key={key} onClick={() => handlerChange(user)} className="hover:bg-zinc-100 w-full text-start flex items-center p-2 gap-2">
                                <span className="w-10 h-10 flex items-center text-xl justify-center bg-black font-semibold rounded-full text-white uppercase">{user.name.charAt(0)}</span>
                                <div>
                                    <h1 className="text-sm font-semibold">{user.name}</h1>  
                                    <div className="flex items-center gap-2">
                                        {
                                            user.company ?
                                                <span className="bg-yellow-200 rounded-md px-1 py-0.5 text-xs">{user.company}</span>
                                            :""
                                        }
                                        {
                                            user.position ?
                                                <span className="bg-green-200 rounded-md px-1 py-0.5 text-xs">{user.position}</span>
                                            :""
                                        }
                                    </div>
                                </div>
                            </button>
                        )
                    })
                    :
                    <p className="p-2 text-red-500 dark:text-red-300">Not Available</p>
                }
            </div>
        </div>
    </div>
  )
}
