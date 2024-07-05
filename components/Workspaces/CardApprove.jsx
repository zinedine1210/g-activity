import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { mutate } from "swr"
import { MyContext } from "../../context/MyProvider"
import AuthRepository from "../../repositories/AuthRepository"
import WorkspacesRepository from "../../repositories/WorkspacesRepository"

export default function CardApprove({item, profileData}) {
    const [type, setType] = useState(null)
    const context = useContext(MyContext)

    useEffect(() => {
        if(!type){
            AuthRepository.getEnum({type:"workspaceType", xa:JSON.parse(localStorage.getItem("XA"))}).then(res => {
                const findOne = res.find(res => {
                    return res.id == item.type
                })
                setType(findOne)
            })
        }

        if(!item.hasOwnProperty("countMembers")){
            const getXA = JSON.parse(localStorage.getItem("XA"))
            WorkspacesRepository.getTeam({xa:getXA, type:1, id:item.id}).then(res => {
                item.countMembers = res.data
            })
        }
    }, [])

    const handlerApprove = async () => {
        // console.log(item, profileData);
        if(item.hasOwnProperty("countMembers") || item.countMembers == undefined){
            const find = item.countMembers.find(res => {
                return res.uid == profileData.id
            })
            
            const result = await WorkspacesRepository.acceptInvitation({xa:JSON.parse(localStorage.getItem("XA")), id:find.id, workspace_id:item.id})
            console.log(result);
            if(result?.type == "success" || result.status !== -1){
                const newData = JSON.parse(JSON.stringify(item))
                delete newData.countMembers

                mutate([2, JSON.parse(localStorage.getItem("XA"))], cache => {
                    cache.data.push(newData)
                    return cache
                }, false)

                mutate([3, JSON.parse(localStorage.getItem("XA"))], cache => {
                    const deleteFind = cache.data.filter(res => {
                        return res.id != item.id
                    })
                    cache.data = deleteFind
                    return cache
                }, false)

                context.setDataDocumentation(context.dataDocumentation)
                Swal.fire({
                    icon:"success",
                    title:"Successfully Approved",
                    text:"The workspace will be added to your page",
                    timer:1500,
                    showConfirmButton:false
                })
            }else{
                alert("Something went wrong")
            }
        }
    }
  return (
    <div className="rounded-xl shadow-lg  h-56 overflow-hidden relative">
        <div className="h-2/6 from-zinc-500 via-zinc-500 to-zinc-800 bg-gradient-to-br relative p-2">
            <h1 className="text-sm text-white font-semibold first-letter:uppercase">{type ? type.code :"----"}</h1>
            <span className="w-14 h-14 flex items-center justify-center text-white bg-zinc-500 rounded-full font-semibold text-2xl absolute right-4 -bottom-6 font-mono">{item.org_id.charAt(0)}</span>
        </div>
        <div className="h-3/6 p-2">
            <h1 className="font-semibold text-base">{item.name}</h1>
            <p className="text-xs text-zinc-600">{item.description}</p>
            <button type="button" onClick={() => handlerApprove()} className="text-white py-1 px-2 hover:bg-blue-600 my-2 transition-all duration-300 ease-in-out bg-blue-500 rounded-md text-sm font-bold uppercase">
                Approve
            </button>
        </div>
        <div className="h-1/6 p-2 flex items-center justify-between border-t">
            <div className="flex items-center gap-2">
                <span className="justify-center text-xs font-semibold flex items-center gap-1 capitalize">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 bg-zinc-200 dark:bg-zinc-500 p-1 rounded-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {item.privacy == 1 ? "Public":"Private"}
                </span>
            </div>
            <div className="flex items-center justify-end gap-2">
                {
                    item.hasOwnProperty("countMembers") && item.countMembers !== undefined ? 
                    <button className="flex items-center justify-center gap-1 text-sm font-semibold">
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {item.countMembers.length}
                    </button>
                    :""
                }
            </div>
        </div>
    </div>
  )
}
