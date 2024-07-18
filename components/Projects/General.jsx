import { useState } from "react";
import { FaSave } from "react-icons/fa";
import ProjectRepository from "../../repositories/ProjectRepository";
import Swal from "sweetalert2";
import { mutate } from "swr";
import { findIndex } from "lodash";

export default function General(props) {
    const [data, setData] = useState(JSON.parse(JSON.stringify(props.data)))
    const [loading, setLoading] = useState(false)
    const isOwner = props.data?.is_owner !== 0;
    const { profileData } = props

    const handlerChange = (value, target) => {
        data[target] = value
        setData(data)
    }

    const handlerSaved = async (e) => {
        e.preventDefault()
        setLoading(true)
        const result = await ProjectRepository.putProject({ xa: JSON.parse(localStorage.getItem("XA")), id: data.id, data: data })
        console.log(result);
        if (result.status == 0) {
            mutate(["projectsByID", result.data.id], cache => {
                const newData = JSON.parse(JSON.stringify(result.data))
                cache.data = newData
                return cache
            }, false)
            console.log(result.data.workspace_id);
            mutate(['projects', 1, result.data.workspace_id], cache => {
                const indexData = findIndex(cache.data, { id: result.data.id })
                cache.data[indexData] = result.data
                return cache
            }, false)

            props.setActive()
            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Changes saved successfully",
                timer: 1000,
                showConfirmButton: false
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again or refresh the page'
            })
        }
        setLoading(false)
    }
    return (
        <div>
            <h1 className="text-xl font-bold mb-10">General</h1>
            <form onSubmit={(e) => handlerSaved(e)} className="space-y-5">
                <div>
                    <h1 className="font-semibold">Project Name</h1>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm">Human-friendly label for your organization, shown in user interfaces</p>
                    <input disabled={!isOwner} type="text" defaultValue={data.name} onChange={(e) => handlerChange(e.target.value, "name")} placeholder="Project Name" className="mt-2 disabled:bg-zinc-200 block w-full md:w-1/2 placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" required />
                </div>
                <div>
                    <h1 className="font-semibold">Project Description (optional)</h1>
                    <textarea disabled={!isOwner} placeholder="Lorem..." defaultValue={data.description} onChange={(e) => handlerChange(e.target.value, "description")} className="mt-2 block disabled:bg-zinc-200 w-full md:w-1/2 placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white"></textarea>
                </div>
                <select disabled={!isOwner} name="privacy" id="privacy" defaultValue={data.privacy} onChange={(e) => handlerChange(Number(e.target.value), "privacy")} className="mt-2 block w-full md:w-1/2 disabled:bg-zinc-200 placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                    <option value={-1}>Private</option>
                    <option value={1}>Public</option>
                </select>
                <label className="flex items-center py-5 border w-full md:w-1/2 gap-5 p-5 rounded-xl cursor-pointer">
                    <input disabled={!isOwner} type="file" className="hidden" />
                    <div>
                        <h1 className="font-semibold">Change Project Logo</h1>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Add or change your Project logo or icon that appears on the team page and side navigation</p>
                    </div>
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </label>

                {
                    loading ?
                        <div role="status" className="w-full py-2">
                            <svg aria-hidden="true" className="w-6 h-6   text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <>
                            {
                                // check permission edit project
                                isOwner && (profileData['_bitws']['edit'] & profileData['_feature']['project']) ? (
                                    <button disabled={loading} className="disabled:bg-zinc-500 bg-blue-400 py-2 px-5 transition-all duration-300 ease-in-out hover:bg-blue-500 rounded-md text-white font-bold flex items-center justify-center gap-2">
                                        <FaSave />
                                        Save Changes
                                    </button>
                                ) : null
                            }
                        </>
                }
            </form>
        </div>
    )
}
