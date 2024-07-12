import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { mutate } from "swr"
import { MyContext } from "../../context/MyProvider"
import ProjectRepository from "../../repositories/ProjectRepository"
import SelectMultiple from "../Input/SelectMultiple"

export default function ModalProject(props) {
    const [data, setData] = useState({})
    const [option, setOption] = useState([])
    const context = useContext(MyContext)
    const [loading, setLoading] = useState(false)
    const profileData = props.profileData

    const handlerChange = (value, target) => {
        data[target] = value
        setData(data)
    }

    useEffect(() => {
        if (option.length == 0) {
            if (props.members) {
                props.members.forEach((val) => {
                    if (profileData.id !== val?.uid && val.status != -1) {
                        option.push({ label: val.uid_docs?.username ?? val?.email, value: val })
                    }
                });
            }
        }
    }, [props.members])

    const handlerDefault = () => {
        setData({})
        // setOption([])
        context.setData({ ...context, activeProject: false })
    }

    const handlerSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        data.workspace_id = props.data.id
        data.description = ""
        if (!data.hasOwnProperty("members")) {
            data.members = []
        }
        let newData = []
        data.members.forEach(val => {
            newData.unshift(val.uid)
        })

        // kalo bukan ownernya
        if (props.data?.is_owner == 0) {
            newData.unshift(props.data?._cb)
        }
        const joinData = newData ? newData.join(",") : null
        data.assigned = joinData
        data.privacy = Number(data.privacy)
        delete data.members

        // console.log(data)

        const result = await ProjectRepository.postProject({ data: data, xa: JSON.parse(localStorage.getItem("XA")) })
        if (result?.type == "success" || result.status == 0 || result.message == "Data added") {
            // console.log(result);
            mutate(["projects", 1, props.data.id], cache => {
                cache.data.push(result.data)
                return cache
            }, false)

            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Successfully created",
                timer: 1000,
                showConfirmButton: false
            })
            // handlerCreateBoard(result.data.id)
            setLoading(false)
            handlerDefault()
        }
    }


    if (context.activeProject) {
        return (
            <div className="fixed top-0 left-0 flex justify-center right-0 z-50 bg-black bg-opacity-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full md:h-full">
                <div className="relative w-full h-full max-w-2xl md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-darkSecondary flex items-center">
                        <div className="p-6 w-full relative">
                            <button type="button" className="absolute top-2 right-2" onClick={() => context.setData({ ...context, activeProject: false })}>
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h1 className="font-bold text-xl">Need More Projects?</h1>
                            <p className="text-zinc-600 dark:text-zinc-300">This team only comes with 1 project, but getting more is easy.</p>
                            <form onSubmit={e => handlerSubmit(e)} className="w-full mt-10 space-y-5">
                                <div>
                                    <h1 className="font-semibold">Project Name</h1>
                                    <input type="text" required value={data.name} name="name" onChange={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                </div>
                                <div>
                                    <h1 className="font-semibold">Privacy</h1>
                                    <select name="privacy" defaultValue={data.privacy} required onChange={e => handlerChange(e.target.value, e.target.name)} id="privacy" className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                                        <option value="" selected disabled>----Please select an option----</option>
                                        <option value={-1}>Private</option>
                                        <option value={1}>Public</option>
                                    </select>
                                </div>
                                <div>
                                    <h1 className="font-semibold">Teams</h1>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-sm">Who is involved in this project? Including the owner</p>
                                    <SelectMultiple name={"members"} options={option} create={true} change={(value, target) => handlerChange(value, target)} />
                                </div>
                                {
                                    loading ?
                                        <div role="status" className="w-full py-2">
                                            <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                            <button type="submit" className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                                                Create Project
                                            </button>
                                        </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}