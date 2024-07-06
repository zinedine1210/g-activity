import { useContext, useEffect, useRef, useState } from "react";
import { MyContext, urlData } from "../../context/MyProvider";
import { FaBuilding, FaPlus, FaSuitcase } from "react-icons/fa"
import { useProject } from "../../utils/swr";
import useSWR from "swr"
import { fetcherData } from "../../utils/function";
import ProjectRepository from "../../repositories/ProjectRepository";
import MomRepository from "../../repositories/MomRepository";

export default function ParticipantsMOM() {
    const context = useContext(MyContext)
    const [member, setMember] = useState(null)
    // const dataProject = useProject(context.dataDocumentation.projectID)
    // const dataProject = useSWR(`${urlData}/projects?id=${context.dataDocumentation.projectID}`, fetcherData)
    // console.log(dataProject.data);
    const [open, setOpen] = useState(false)
    const data = context.dataDocumentation

    useEffect(() => {
        async function getData() {
            const result = await ProjectRepository.getTeam({ xa: JSON.parse(localStorage.getItem("XA")), type: 1, id: context.dataDocumentation.project_id })
            // console.log(data, result);
            setMember(result.data)
        }

        if (!member) {
            getData()
        }
    }, [])

    const handlerCreate = async () => {
        let obj = {
            name: null,
            position: null,
            company: null,
            mom_id: context.dataDocumentation.id
        }
        data.participants.push(obj)
        context.setDataDocumentation(context.dataDocumentation)
    }


    if (member)
        return (
            <div className="pb-10">
                <div className="flex items-center gap-3 mb-2 group">
                    <h2 className="font-semibold text-zinc-800 dark:text-white">Participants</h2>
                    <button onClick={() => setOpen(true)}>
                        <FaPlus className="text-zinc-500 text-sm group-hover:visible invisible transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    </button>
                </div>

                <div className="space-y-1">
                    {
                        data.participants.map((text, key) => {
                            return (
                                <CardParticipant member={member} data={data} urutan={key} item={text} key={key} />
                            )
                        })
                    }
                </div>
            </div>
        )
}



function CardParticipant({ item, urutan, member, data }) {
    const [open, setOpen] = useState(false)
    const dropRef = useRef(null)
    const [open2, setOpen2] = useState(false)
    const dropRef2 = useRef(null)
    const [open3, setOpen3] = useState(false)
    const dropRef3 = useRef(null)
    const context = useContext(MyContext)

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
        if (dropRef2.current && !dropRef2.current.contains(event.target)) {
            setOpen2(false);
        }
        if (dropRef3.current && !dropRef3.current.contains(event.target)) {
            setOpen3(false);
        }
    };

    const handlerChange = async (value, target, index) => {
        data.participants[index][target] = value
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerKey = async (e, index, target) => {

        if (e.key == "Enter") {
            e.preventDefault()
            await handlerChange(e.target.innerHTML, target, index)
            await handlerAddParticipants(index, data.participants[index])
        }

        if (e.key == "Backspace" && data.participants[index].name == null && e.target.innerHTML == "") {
            // console.log(data.participants[index]);
            if (data.participants[index].hasOwnProperty("id")) {
                const deleteResult = await MomRepository.deleteParticipant({ xa: JSON.parse(localStorage.getItem("XA")), id: data.participants[index].id })
                console.log(deleteResult);
                if (deleteresult.status == 0) {
                    await data.participants.splice(index, 1)
                    context.setDataDocumentation(context.dataDocumentation)
                }
            } else {
                await data.participants.splice(index, 1)
                context.setDataDocumentation(context.dataDocumentation)
            }
        }

        if (e.key == "@") {
            setOpen(true)
        }
    }

    const handlerAddParticipants = async (index, value) => {
        const result = await MomRepository.postParticipant({ xa: JSON.parse(localStorage.getItem("XA")), data: value })
        console.log(result);
        if (result.status == 0) {
            data.participants[index] = result.data
            if (index == data.participants.length - 1) {
                let obj = {
                    name: null,
                    position: null,
                    company: null,
                    mom_id: context.dataDocumentation.id
                }
                await data.participants.splice(index + 1, 0, obj)
                context.setDataDocumentation(context.dataDocumentation)
            } else {
                context.setDataDocumentation(context.dataDocumentation)
            }
        }
    }

    const handlerChooseEmail = async (value, index) => {
        let newArr = {
            mom_id: context.dataDocumentation.id,
            email: value.uid_docs.email,
            name: value.uid_docs.fullname,
            position: null,
            company: null,
            uid: value.uid
        }

        await handlerAddParticipants(index, newArr)
        data.participants[index] = newArr
        setOpen(false)
    }

    const handlerDeleteParticipants = async (urutan, target) => {
        await handlerChange(null, target, urutan)
        const result = await MomRepository.putParticipant({ xa: JSON.parse(localStorage.getItem("XA")), id: data.participants[urutan].id, data: data.participants[urutan] })
        console.log(result);
        if (result.status == 0) {
            document.getElementById(`participant-${urutan}`).focus()
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handlerChangeProperty = async (e, target) => {
        if (e.key == "Enter") {
            handlerChange(e.target.value, target, urutan)
            const result = await MomRepository.putParticipant({ xa: JSON.parse(localStorage.getItem("XA")), id: data.participants[urutan].id, data: data.participants[urutan] })
            if (result.status == 0) {
                data.participants[urutan] = result.data
                setOpen2(false)
                setOpen3(false)
            }
        }
    }

    return (
        <div className="flex items-center gap-1 group relative" ref={dropRef}>
            <span className="font-bold tabular-nums text-zinc-500 dark:text-zinc-300">{urutan + 1}.</span>
            <div className="flex items-center gap-2">
                {
                    item.name ?
                        <div className="hover:bg-zinc-100 flex items-center gap-2 group py-1 transition-all duration-300 px-2">
                            <h1 className="font-semibold text-sm">{item.name}</h1>
                            <button onClick={() => handlerDeleteParticipants(urutan, "name")} className="group-hover:visible opacity-0 group-hover:opacity-100 invisible hover:bg-red-200 p-1">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        :
                        <h1 id={`participant-${urutan}`} className="px-2 editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={e => handlerKey(e, urutan, "name")} maxLength={10} data-placeholder="Type @ mention a person to add them as an attendee" contentEditable dangerouslySetInnerHTML={{ __html: item.name }}></h1>
                }
            </div>

            <div className={`${open ? "" : "hidden"} absolute top-full w-fit bg-white shadow-xl py-1 z-20`}>
                <h1 className="p-2 font-bold text-xs text-zinc-500 dark:text-zinc-300 border-b">Mention</h1>
                {
                    member.filter(res => {
                        const findOne = data.participants.find(opt => {
                            if (opt.hasOwnProperty("uid")) {
                                return opt.uid == res.uid
                            }
                        })

                        if (!findOne)
                            return res
                    }).map((user, key) => {
                        return (
                            <button key={key} onClick={() => handlerChooseEmail(user, urutan)} className="hover:bg-zinc-100 w-full text-start flex items-center p-2 gap-2">
                                <span className="w-8 h-8 flex items-center justify-center bg-black font-semibold rounded-full text-white uppercase">{user.uid_docs.email.charAt(0)}</span>
                                <h1 className="text-sm font-semibold">{user.uid_docs.email}</h1>
                            </button>
                        )
                    })
                }
            </div>
            <div ref={dropRef2}>
                {
                    item.company ?
                        <div className="bg-blue-100 flex items-center gap-2 group py-1 transition-all duration-300 px-2">
                            <FaBuilding className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
                            <h1 className="text-sm">{item.company}</h1>
                            <button onClick={() => handlerDeleteParticipants(urutan, "company")} className="group-hover:visible opacity-0 group-hover:opacity-100 invisible hover:bg-red-200 p-1">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        :
                        <button onClick={() => setOpen2(true)} title="Company name" className={`${open2 ? "visible bg-zinc-200" : "invisible group-hover:visible"} bg-zinc-100 transition-all duration-300 hover:bg-zinc-200 p-2 focus:bg-zinc-300`}>
                            <FaBuilding className="w-3 h-3" />
                        </button>

                }
                <div className={`absolute bg-white w-56 rounded-md shadow-xl z-20 transition-all duration-300 ${open2 ? "visible opacity-100" : "invisible opacity-0"}`}>
                    <input type="text" onKeyDown={(e) => handlerChangeProperty(e, "company")} className="w-full focus:border-2 focus:border-blue-300 outline-none border rounded-md p-2 text-sm" placeholder={"Enter your Company here"} />
                </div>
            </div>
            <div ref={dropRef3}>
                {
                    item.position ?
                        <div className="bg-yellow-100 flex items-center gap-2 group py-1 transition-all duration-300 px-2">
                            <FaSuitcase className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
                            <h1 className="text-sm">{item.position}</h1>
                            <button onClick={() => handlerDeleteParticipants(urutan, "position")} className="group-hover:visible opacity-0 group-hover:opacity-100 invisible hover:bg-red-200 p-1">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        :
                        <button onClick={() => setOpen3(true)} title="Position in Company" className={`${open3 ? "visible bg-zinc-200" : "invisible group-hover:visible"} bg-zinc-100 transition-all duration-300 hover:bg-zinc-200 p-2 focus:bg-zinc-300`}>
                            <FaSuitcase className="w-3 h-3" />
                        </button>

                }
                <div className={`absolute bg-white w-56 rounded-md shadow-xl z-20 transition-all duration-300 ${open3 ? "visible opacity-100" : "invisible opacity-0"}`}>
                    <input type="text" onKeyDown={(e) => handlerChangeProperty(e, "position")} className="w-full focus:border-2 focus:border-blue-300 outline-none border rounded-md p-2 text-sm" placeholder={"Enter here"} />
                </div>
            </div>
        </div>
    )
}