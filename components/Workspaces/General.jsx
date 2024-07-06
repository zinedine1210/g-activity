import { FaSave } from "react-icons/fa";
import { useEnum } from "../../utils/swr";
import { useState } from "react";
import WorkspacesRepository from "../../repositories/WorkspacesRepository";
import Swal from "sweetalert2";
import { mutate } from "swr";
import { findIndex } from "lodash";

export default function General(props) {
    const [data, setData] = useState(JSON.parse(JSON.stringify(props.data)))
    const dataEnumWorkspaceType = useEnum("workspaceType", JSON.parse(localStorage.getItem("XA")))
    const [loading, setLoading] = useState(false)
    const isOwner = props.data?.is_owner !== 0;

    const handlerChange = (value, target) => {
        if (isOwner) {
            data[target] = value
            setData(data)
        }
    }

    const handlerSaved = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(data);

        const result = await WorkspacesRepository.putWorkspace({ xa: JSON.parse(localStorage.getItem("XA")), id: data.id, data: data })
        console.log(result);

        if (result.status == 0 || result.message == "Data has change") {
            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Changes saved successfully",
                timer: 1000,
                showConfirmButton: false
            })
            mutate(['workspace', data.id], cache => {
                cache.data = result.data
                return cache
            }, false)

            mutate([1, JSON.parse(localStorage.getItem("XA"))], cache => {
                const indexData = findIndex(cache.data, { id: result.data.id })
                if (cache.data[indexData].hasOwnProperty("countMembers")) {
                    result.data['countMembers'] = cache.data[indexData].countMembers
                }
                cache.data[indexData] = result.data
                return cache
            }, false)
            props.setActive()
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
        <div className="py-10">
            <h1 className="text-xl font-bold mb-10">General</h1>
            <form onSubmit={(e) => handlerSaved(e)} className="space-y-5">
                <div>
                    <h1 className="font-semibold">Organization Name</h1>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm">Human-friendly label for your organization, shown in user interfaces</p>
                    <input disabled={!isOwner} type="text" defaultValue={data.name} onChange={(e) => handlerChange(e.target.value, "name")} placeholder="Workspace Name" className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 disabled:bg-zinc-200 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" required />
                </div>
                <div>
                    <h1 className="font-semibold">Website (optional)</h1>
                    <input disabled={!isOwner} type="url" defaultValue={data.website} onChange={(e) => handlerChange(e.target.value, "website")} placeholder="Type in https://..." className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 disabled:bg-zinc-200 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" />
                </div>
                {/* <div>
                <h1 className="font-semibold">Organization Address (optional)</h1>
                <textarea placeholder="" defaultValue={data.companyAddress} className="block  mt-2 w-1/2 placeholder-zinc-400/70 dark:placeholder-zinc-500 rounded-lg border border-zinc-200 bg-white px-4 h-32 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-blue-300"></textarea>
            </div> */}
                <div>
                    <h1 className="font-semibold">Workspace Description (optional)</h1>
                    <textarea placeholder="Lorem..." disabled={!isOwner} defaultValue={data.description} onChange={(e) => handlerChange(e.target.value, "description")} className="mt-2 block w-full md:w-1/2 h-56 placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 disabled:bg-zinc-200 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white"></textarea>
                </div>
                <div>
                    <h1 className="font-semibold">Workspace Type</h1>
                    <select disabled={!isOwner} name="workspaceType" id="workspaceType" defaultValue={data.type} onChange={(e) => handlerChange(e.target.value, "type")} className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 disabled:bg-zinc-200 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                        {
                            dataEnumWorkspaceType ? dataEnumWorkspaceType.data.map((opt, key) => {
                                return (
                                    <option key={key} value={opt.id}>{opt.code}</option>
                                )
                            })
                                : ""
                        }
                    </select>
                </div>
                <div>
                    <h1 className="font-semibold">Privacy</h1>
                    <select disabled={!isOwner} name="privacy" id="privacy" defaultValue={data.privacy} onChange={(e) => handlerChange(Number(e.target.value), "privacy")} className="mt-2 block w-full md:w-1/2 placeholder-zinc-400/70 disabled:bg-zinc-200 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                        <option value={-1}>Private</option>
                        <option value={1}>Public</option>
                    </select>
                </div>
                <label className="flex items-center py-5 border w-full md:w-1/2 gap-5 p-5 rounded-xl cursor-pointer">
                    <input disabled={!isOwner} type="file" className="hidden" />
                    <div>
                        <h1 className="font-semibold">Change Workspace Logo</h1>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm">Add or change your workspace logo or icon that appears on the team page and side navigation</p>
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
                                isOwner && (
                                    <button disabled={loading} className="disabled:bg-zinc-500 bg-blue-400 py-2 px-5 transition-all duration-300 ease-in-out hover:bg-blue-500 rounded-md text-white font-bold flex items-center justify-center gap-2 dark:bg-darkSecondary dark:hover:bg-darkPrimary">
                                        <FaSave />
                                        Save Changes
                                    </button>
                                )
                            }
                        </>
                }
            </form>
        </div>
    )
}
