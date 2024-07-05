import { useContext, useEffect, useRef, useState } from "react";
import { FaBuilding, FaPlus, FaSuitcase } from "react-icons/fa";
import { MyContext } from "../../context/MyProvider";
import ProjectRepository from "../../repositories/ProjectRepository";
import MomRepository from "../../repositories/MomRepository";

export default function ParticipantsMOM2() {
    const context = useContext(MyContext)
    const [member, setMember] = useState(null)
    const data = context.dataDocumentation

    useEffect(() => {
        async function getData(){
            const result = await ProjectRepository.getTeam({xa:JSON.parse(localStorage.getItem("XA")), type:1, id:context.dataDocumentation.project_id})
            // console.log(data, result);
            setMember(result.data.data)
        }

        if(!member){
            getData()
        }
    }, [])


    const handlerCreate = async () => {
        let obj = {
            name:null,
            position:null,
            company:null,
            mom_id:context.dataDocumentation.id
        }
        data.participants.push(obj)
        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div className="pb-10">
        <div className="flex items-center gap-3 mb-2 group">
            <h2 className="font-semibold text-zinc-800 dark:text-white">Participants</h2>
            <button onClick={() => handlerCreate()}>
                <FaPlus className="text-zinc-500 text-sm group-hover:visible invisible transition-all duration-300 opacity-0 group-hover:opacity-100"/>
            </button>
        </div>

        <div className="space-y-1">
            {
                data.participants.map((item, key) => {
                    return (
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-zinc-500">
                                {key + 1}.
                            </h1>
                            <CardParticipant member={member} urutan={key} item={item} key={key}/>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}


function CardParticipant({item, member, urutan}){
    const [data, setData] = useState(null)
    const dropRef = useRef(null)
    const [open, setOpen] = useState(false)
    const dropRef2 = useRef(null)
    const [open2, setOpen2] = useState(false)
    const context = useContext(MyContext)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
            setOpen2(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerChange = (value, target) => {
        data[target] = value
        context.setDataDocumentation(context.dataDocumentation)
    }
    
    const handlerOpen = () => {
        setOpen(true)
        setData(JSON.parse(JSON.stringify(item)))
    }

    const handlerKey = async (e, index, target) => {
        
        if(e.key == "Enter"){
            e.preventDefault()
            context.dataDocumentation.participants[index].name = e.target.innerHTML
            await handlerAddParticipants(index, context.dataDocumentation.participants[index])
        }
        
        if(e.key == "@"){
            setOpen2(true)
        }
    }

    const handlerAddParticipants = async (index, value) => {
        const result = await MomRepository.postParticipant({xa:JSON.parse(localStorage.getItem("XA")), data:value})
        console.log(result);
        if(result.data.type == "success"){
            context.dataDocumentation.participants[index] = result.data.data
            if(index == context.dataDocumentation.participants.length - 1){
                let obj = {
                    name:null,
                    position:null,
                    company:null,
                    mom_id:context.dataDocumentation.id
                }
                await context.dataDocumentation.participants.splice(index + 1, 0, obj)
                context.setDataDocumentation(context.dataDocumentation)
            }else{
                context.setDataDocumentation(context.dataDocumentation)
            }
        }
    }
    
    const handlerChooseEmail = async (value, index) => {
        let newArr = {
            mom_id:context.dataDocumentation.id,
            email:value.uid_docs.email,
            name:value.uid_docs.fullname,
            position:null,
            company:null,
            uid:value.uid
        }

        await handlerAddParticipants(index, newArr)
        context.dataDocumentation.participants[index] = newArr
        setOpen2(false)
    }

    const handlerDeleteParticipants = async () => {
        const result = await MomRepository.deleteParticipant({xa:JSON.parse(localStorage.getItem("XA")), id:item.id})
        console.log(result);
        if(result.data.type == "success"){
            const filterData = context.dataDocumentation.participants.filter(res => {
                return res.id != item.id
            })
            context.dataDocumentation.participants = filterData
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        const result = await MomRepository.putParticipant({xa:JSON.parse(localStorage.getItem("XA")), data:data, id:data.id})
        console.log(result);
        if(result.data.type == "success"){
            context.dataDocumentation.participants[urutan] = result.data.data
            context.setDataDocumentation(context.dataDocumentation)
            setOpen(false)
        }
    }

    return (
        <div ref={dropRef} className="relative">
            {
                item.name ?
                    <div>
                        <button className={`flex items-center justify-center gap-2 text-sm p-1 ${open ? "border border-blue-500 rounded-md":""}`} onClick={() => handlerOpen()}>
                            {item.name}
                            {item.company ? 
                                <div className="bg-blue-100 text-blue-800 rounded-md p-1 flex items-center gap-2">
                                    <FaBuilding className="w-4 h-4 text-blue-500 dark:text-blue-300"/>
                                    {item.company}
                                </div> 
                            :""}
                            {item.position ? 
                                <div className="bg-yellow-100 text-yellow-800 rounded-md p-1 flex items-center gap-2">
                                    <FaSuitcase className="w-4 h-4 text-yellow-500 dark:text-yellow-300"/>
                                    {item.position}
                                </div> 
                            :""}

                        </button>
                        {
                            open ?
                                <form onSubmit={(e) => handlerSubmit(e)} className={`bg-white rounded-md w-56 p-2 absolute z-20 top-full shadow-md overflow-hidden space-y-1 mt-1`}>
                                    <h1 className="text-sm font-bold">Detail:</h1>
                                    <input id={`inputNameParticipant-${data.id}`} type="text" className="w-full outline-none text-sm placeholder:text-zinc-500 bg-zinc-100 p-2 hover:bg-zinc-200 focus:border-2 focus:border-blue-200 focus:bg-white" onChange={(e) => handlerChange(e.target.value, "name")} placeholder="Enter your name" required autoFocus value={data.name}/>
                                    <input type="text" className="w-full outline-none text-sm placeholder:text-zinc-500 bg-zinc-100 p-2 hover:bg-zinc-200 focus:border-2 focus:border-blue-200 focus:bg-white" onChange={(e) => handlerChange(e.target.value, "company")} placeholder="Enter your company" value={data.company}/>
                                    <input type="text" className="w-full outline-none text-sm placeholder:text-zinc-500 bg-zinc-100 p-2 hover:bg-zinc-200 focus:border-2 focus:border-blue-200 focus:bg-white" onChange={(e) => handlerChange(e.target.value, "position")} placeholder="Enter your position" value={data.position}/>
                                    <button type="submit" className="w-full p-2 text-center font-bold uppercase tracking-wider bg-blue-400 text-xs text-white">Saved</button>
                                    <button type="button" onClick={() => handlerDeleteParticipants()} className="w-full p-2 text-center font-bold uppercase tracking-wider bg-red-400 text-xs text-white">Delete</button>
                                </form>
                            :""
                        }

                    </div>
                    :
                    <>
                        <h1 id={`participant-${urutan}`} className="px-2 editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={e => handlerKey(e, urutan, "name")} maxLength={10} data-placeholder="Type @ mention a person to add them as an attendee" contentEditable dangerouslySetInnerHTML={{__html:item.name}}></h1>
                        <div className={`${open2 ? "":"hidden"} absolute top-full w-fit bg-white shadow-xl py-1 z-20`}>
                            <h1 className="p-2 font-bold text-xs text-zinc-500 dark:text-zinc-300 border-b">Mention</h1>
                            {
                                member ? member.filter(res => {
                                    const findOne = context.dataDocumentation.participants.find(opt => {
                                        if(opt.hasOwnProperty("uid")){
                                            return opt.uid == res.uid
                                        }
                                    })

                                    if(!findOne)
                                    return res
                                }).map((user, key) => {
                                    return (
                                        <button key={key} onClick={() => handlerChooseEmail(user, urutan)} className="hover:bg-zinc-100 w-full text-start flex items-center p-2 gap-2">
                                            <span className="w-8 h-8 flex items-center justify-center bg-black font-semibold rounded-full text-white uppercase">{user.uid_docs.email.charAt(0)}</span>
                                            <h1 className="text-sm font-semibold">{user.uid_docs.email}</h1>
                                        </button>
                                    )
                                })
                                :""
                            }
                        </div>
                    </>
            }
        </div>
    )
}