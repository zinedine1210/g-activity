import { useContext, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { mutate } from "swr"
import { MyContext } from "../../context/MyProvider"
import WorkspacesRepository from "../../repositories/WorkspacesRepository"
import { useEnum, useFindMembers } from "../../utils/swr"

export default function ModalWorkspace(props) {
    const [keyword, setKeyword] = useState("")
    const [datatimeout, setDatatimeout] = useState(null)
    const dataMemberKeyword = useFindMembers({data:{keyword:keyword}, xa:JSON.parse(localStorage.getItem("XA"))})
    // console.log(dataMemberKeyword)
    const dataEnumWorkspaceType = useEnum("workspaceType", JSON.parse(localStorage.getItem("XA")))
    const context = useContext(MyContext)
    const [data, setData] = useState({})
    const [a, setA] = useState(false)
    const [step, setStep] = useState(1)
    const dropRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

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

    const handlerKeyword = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            setKeyword(value)
        }, 1000);
        setDatatimeout(getdatatimeout)
    }

    
    const handlerChange = (value, target) => {
        data[target] = value
        setData(data)
    }

    const handlerKey = (e, idx) => {

        if(e.key == "ArrowDown"){
            if(idx == dataMemberKeyword.data.data.length){
                return alert("Invalid")
            }
            document.getElementById(`username-${idx ? idx + 1 : 1}`).focus()
        }

        if(e.key == "ArrowUp"){
            if(idx == 1){
                return alert("Invalid")
            }
            document.getElementById(`username-${idx - 1}`).focus()
        }
    }
    
    
    const handlerSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await WorkspacesRepository.postWorkspace({xa:getXA, data:data})
        console.log(result);
        if(result.status == 0 || result.message == "Data added"){
            data.id = result.data.id
            data.members = []
            data.newData = result.data
            setStep(2)
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again or refresh the page'
            })
        }
        setLoading(false)
    }

    const handlerAddEmail = (value) => {
        data.members.push(value)
        setData(data)
        setA(!a)
    }

    const handlerDeleteEmail = (value) => {
        const filter = data.members.filter(res => {
            return res.id != value.id
        })
        data.members = filter
        setData(data)
        setA(!a)
    }

    const handlerSubmitEmail = async (e, skip) => {
        e.preventDefault()
        setLoading(true)
        let dataFinal = []
        if(!skip){
            data.members.forEach(val => {
                if(val.username){
                    dataFinal.push(val.username)
                }
            })
        }else{
            data.members = dataFinal
        }
        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await WorkspacesRepository.postTeamWorkspace({data:dataFinal, xa:getXA, workspaceID:data.id})
        console.log(result);
        if(result.status == 0 || result?.data?.data?.type == "success"){
            Swal.fire({
                icon:"success",
                title:"Successfully Added",
                text:"The workspace will be added to your page",
                timer:1500,
                showConfirmButton:false
            })
        }

        
        handlerDefault()
        mutate([1, JSON.parse(localStorage.getItem("XA"))], cache => {
            // console.log(cache)
            cache.data.push(data.newData)
            return cache
        }, false)
        setLoading(false)
    }

    const handlerDefault = () => {
        setStep(1)
        setData({})
        context.setData({...context, activeWorkspace:false})
    }

    return (
        <div className="fixed top-0 left-0 flex justify-center right-0 z-50 bg-black bg-opacity-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-darkSecondary flex items-center">
                    {
                        step == 1?
                        <div className="p-6 w-full relative">
                            <button type="button" className="absolute top-2 right-2" onClick={() => context.setData({...context, activeWorkspace:false})}>
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h1 className="font-bold text-xl">Let's build a Workspace</h1>
                            <p className="text-zinc-600 dark:text-zinc-300">Boost your productivity by making it easier for everyone to access boards in one location.</p>
                            <form onSubmit={(e) => handlerSubmit(e)} className="w-full mt-10 space-y-5">
                                <div>
                                    <h1 className="font-semibold">Workspace Name</h1>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-sm">This is the name of your company, team or organization.</p>
                                    <input type="text" id="name" value={data.name} name="name" onChange={(e) => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" required />
                                </div>
                                <div>
                                    <h1 className="font-semibold">Website (optional)</h1>
                                    <input type="url" placeholder="Type in https://...." id="website" value={data.website} name="website" onChange={(e) => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" />
                                </div>
                                <div>
                                    <h1 className="font-semibold">Workspace Type</h1>
                                    <select name="type" id="type" required onChange={(e) => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 text-sm rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                                    <option value="" selected disabled>----Please select an option----</option>
                                    {
                                        dataEnumWorkspaceType ? dataEnumWorkspaceType.data.map((opt, key) => {
                                            return (
                                                <option key={key} value={opt.id}>{opt.code}</option> 
                                            )
                                        })
                                        :""
                                    }
                                    </select>
                                </div>
                                <div>
                                    <h1 className="font-semibold">Privacy</h1>
                                    <select name="privacy" required id="privacy" onChange={(e) => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 text-sm rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                                        <option value="" selected disabled>----Please select an option----</option>
                                        <option value={-1}>Private</option>
                                        <option value={1}>Public</option>
                                    </select>
                                </div>
                                <div>
                                    <h1 className="font-semibold">Workspace Description (optional)</h1>
                                    <textarea placeholder="Lorem..." name="description" value={data.description} onChange={(e) => handlerChange(e.target.value, e.target.name)} className="mt-2 h-32 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white"></textarea>
                                </div>
                                {
                                    loading ?
                                    <div role="status" className="w-full py-2">
                                        <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    <div className="mt-4 flex items-center gap-2">
                                        <button type="button" onClick={() => handlerDefault()} className="px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md sm:mt-0 w-1/3 sm:mx-2 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 w-2/3 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                                            Continue
                                        </button>
                                    </div>
                                }
                            </form>
                        </div>
                        :""
                    }
                    {
                        step == 2?
                        <div className="p-6 w-full relative">
                            <h1 className="font-bold text-xl">Invite your team</h1>
                            <p className="text-zinc-600 dark:text-zinc-300"><span className="font-semibold">GActivity</span> makes teamwork your best work. Invite your new team members to get going!</p>
                            
                            <form className="mt-10 space-y-3" onSubmit={(e) => handlerSubmitEmail(e)}>
                                {
                                    data.members.length > 0 ? data.members.map((item, key) => {
                                        return (
                                            <div key={key} className="block relative border-2 dark:border-zinc-500 dark:bg-darkPrimary border-blue-500 p-2 rounded-md bg-blue-100">
                                                <h1>{item.username}</h1>
                                                <div className="absolute top-1/2 right-0 -translate-y-1/2 px-2">
                                                    <button type="button" onClick={() => handlerDeleteEmail(item)} className="bg-red-500 rounded-full flex items-center justify-center text-white">
                                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <h1 className="w-full text-center uppercase text-red-500 font-bold">
                                        Please Select Member 
                                    </h1>
                                }

                                <div className="flex items-center gap-2">
                                    <div ref={dropRef} className="relative w-full">
                                        <button type="button" onClick={() => setOpen(!open)} className="mt-2 flex items-center rounded py-1.5 px-2 text-sm text-blue-600 transition-colors duration-300 hover:text-blue-400 focus:outline-none dark:text-blue-400 dark:hover:text-blue-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>

                                            <span className="mx-2">{open ? "Done":"Add Another"}</span>
                                        </button>

                                        <div className={`${open ? "":"hidden"} shadow-md p-5 bg-white dark:bg-dark rounded-xl absolute z-20 w-full`}>
                                            <h1 className="font-semibold text-zinc-500 mb-3">This action will send them an email for approval</h1>
                                            {/* <p className="text-zinc-500 mb-3">This action will send them an email for approval</p> */}
                                            <input type="text" onKeyDown={e => handlerKey(e)} onChange={(e) => handlerKeyword(e.target.value)} className={`outline-none p-2 border-2 dark:border-zinc-800 border-blue-300 w-full`} placeholder="Search Member from username" />
                                            {/* {console.log(dataMemberKeyword)} */}
                                            <div className="h-full max-h-72 overflow-y-scroll">
                                                {
                                                    dataMemberKeyword ?
                                                    dataMemberKeyword.data?.data?.length > 0 ?
                                                    dataMemberKeyword.data.data.filter(res => {
                                                        const find = data.members.find(opt => {
                                                            return opt.id == res.id
                                                        })

                                                        if(!find){
                                                            return res
                                                        }
                                                    }).map((opt, key) => {
                                                        return (
                                                            <button id={`username-${key + 1}`} type="button" onKeyDown={e => handlerKey(e, key + 1)} key={key} onClick={() => handlerAddEmail(opt)} className="outline-none disabled:bg-zinc-200 focus:bg-blue-100 hover:bg-blue-100 py-4 border-b px-3 transition-all duration-300 w-full text-start flex items-center gap-2 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary">
                                                                <span className="flex items-center justify-center text-white bg-black rounded-full w-10 h-10 uppercase font-bold">
                                                                    {opt.username.charAt(0)}
                                                                </span>
                                                                <div>
                                                                    <h1>{opt?.fullname}</h1>
                                                                    <p className="font-bold text-sm">{opt?.username}</p>
                                                                </div>
                                                            </button>
                                                        )
                                                    })
                                                    :
                                                    <div className="text-center font-bold text-red-500 p-5">
                                                        <h1>Not Available</h1>
                                                    </div>
                                                    :
                                                    <div className="text-center font-bold p-5">
                                                        <div className="bg-blue-200 mx-auto w-8 h-8 rounded-full animate-pulse">

                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    loading ?
                                    <div role="status" className="w-full py-2">
                                        <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    <div className="mt-4 flex items-center gap-2">
                                        <button type="button" onClick={(e) => handlerSubmitEmail(e, true)} className="px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md sm:mt-0 w-1/3 sm:mx-2 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40">
                                            Skip
                                        </button>
                                        <button type="submit" className="px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 w-2/3 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                                            Send Invites
                                        </button>
                                    </div>
                                }
                            </form>
                        </div>
                        :""
                    }
                </div>
            </div>
        </div>
    )
}
