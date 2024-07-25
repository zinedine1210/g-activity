import { mutate } from "swr"
import { MyContext, urlData } from "../../context/MyProvider";
import { generateId } from "../../utils/function";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import MyProjectApplication from "./MyProjectApplication";
import DocumentationRepository from "../../repositories/DocumentationRepository";
import NoteRepository from "../../repositories/NoteRepository";
import Swal from "sweetalert2";
import { FaSync } from "react-icons/fa";
import ShareProjectApplication from "./ShareProjectApplication";
import MomRepository from "../../repositories/MomRepository";


export default function Application({ data, t, profileData }) {
    const router = useRouter()
    const context = useContext(MyContext)
    const [active, setActive] = useState("myProject")
    const [loading, setLoading] = useState(false)

    const handlerCreateNote = async () => {
        setLoading(true)
        let obj = {
            workspace_id: data.workspace_id,
            project_id: data.id,
            privacy: -1,
            title: "Untitled Note",
            content: ""
        }

        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await NoteRepository.postNote({ xa: getXA, data: obj })
        console.log("post result note", result);
        if (result.status == 0) {
            mutate(["notes", 1, data.id], cache => {
                cache.data.push(result.data)
                return cache
            }, false)
            console.log("context", context)
            result.data.assigns = []
            context.dataDocumentation = result.data
            context.setDataDocumentation(context.dataDocumentation)
            Swal.fire({
                icon: "success",
                title: "Successfully created",
                text: "You will direct to the note page",
                timer: 1500,
                showConfirmButton: false
            })

            router.push(`/usr/note?id=${result.data.id}`)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again or refresh the page'
            })
        }
        setLoading(false)
    }

    const handlerCreateMOM = async () => {
        setLoading(true)
        let obj = {
            title: "Untitled MOM",
            place: null,
            address: null,
            action_list: [{
                checked: 1,
                value: "action 1"
            }, {
                checked: 0,
                value: "action 2"
            }],
            agenda: [
                "Agenda 1",
                "Agenda 2",
                "Agenda 3"
            ],
            mom_date: null,
            start_time: null,
            end_time: null,
            conclusion: null,
            workspace_id: data.workspace_id,
            project_id: data.id,
            privacy: -1
        }

        const result = await MomRepository.postMom({ xa: JSON.parse(localStorage.getItem("XA")), data: obj })
        if (result.status == 0) {
            if (!result.data.header) {
                result.data.header = [
                    {
                        "name": "Meeting Result",
                        "id": "1678516541022736888695",
                        "align": "start",
                        "type": "freeText"
                    },
                    {
                        "name": "Target Date",
                        "id": "1678516541022488185986",
                        "align": "start",
                        "type": "datetime"
                    },
                    {
                        "name": "PIC",
                        "id": "1678516541022295981233",
                        "align": "start",
                        "type": "mention"
                    },
                    {
                        "name": "Stated By",
                        "id": "1678516541022063365596",
                        "align": "start",
                        "type": "mention"
                    }
                ]
            }

            const mutateCache = async () => {
                await mutate(["mom", 1, data.id], cache => {
                    console.log("cache yaitu", cache);
                    cache.data.push(result.data);
                    return cache;
                }, false);
            };

            await mutateCache();
            result.data.assigns = []
            context.dataDocumentation = result.data
            context.setDataDocumentation(context.dataDocumentation)
            Swal.fire({
                icon: "success",
                title: "Successfully created",
                text: "You will direct to the documentation page",
                timer: 1500,
                showConfirmButton: false
            })

            router.push(`/usr/mom?id=${result.data.id}`)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again or refresh the page'
            })
        }
        setLoading(false)
    }

    const handlerCreateDocumentation = async () => {
        setLoading(true)
        let obj = {
            workspace_id: data.workspace_id,
            project_id: data.id,
            privacy: -1,
            name: "Untitled Documentation"
        }

        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await DocumentationRepository.postDocumentation({ xa: getXA, data: obj })
        console.log(result);
        if (result.status == 0) {
            mutate(["documentation", 1, data.id], cache => {
                cache.data.push(result.data)
                return cache
            }, false)
            result.data.assigns = []
            console.log("set new context")
            context.dataDocumentation = result.data
            context.dataDocumentation.pages = []
            context.setData({ ...context, active: null, activeDocumentation: false, dataDocumentation: context.dataDocumentation })
            // context.setDataDocumentation(context.dataDocumentation)
            console.log("final new data context", context)
            Swal.fire({
                icon: "success",
                title: "Successfully created",
                text: "You will direct to the documentation page",
                timer: 1500,
                showConfirmButton: false
            })

            router.push(`/usr/documentation?id=${result.data.id}`)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again or refresh the page'
            })
        }
        setLoading(false)
    }

    const handlerCreateErrorKnowledge = async () => {
        let obj = {
            "id": generateId(),
            "name": null,
            "privacy": "public",
            "pin": true,
            "projectID": data.id,
            "date": new Date()
        }

        await fetch(`${urlData}/errorKnowledge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(res => {
            console.log(res);
            alert("Success");
            router.push(`/usr/errorKnowledge?id=${obj.id}`)

            // if(res.ok){
            //     return alert("Success")
            // }else{
            //     return alert("Failed")
            // }
        })
        mutate(`${urlData}/errorKnowledge?projectID=${data.id}`)
    }

    const handlerRefresh = () => {
        mutate(['documentation', 1, data.id])
        mutate(['notes', 1, data.id])
    }

    return (
        <>
            <h1 className="mb-10 font-bold text-xl capitalize">{t("startNew")}</h1>

            <div className="flex items-center gap-2 mb-5">
                <button onClick={() => setActive("myProject")} className={`${active == "myProject" ? "border-b-2 border-primary" : ""} pb-2 px-3`}>
                    Your Work
                </button>
                <button onClick={() => setActive("shareProject")} className={`${active == "shareProject" ? "border-b-2 border-primary" : ""} pb-2 px-3`}>
                    Share With You
                </button>
            </div>
            {/* APPLICATION CREATE BUTTON */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-10">
                {   // check permission add documentation
                    (profileData['_bitws']['add'] & profileData['_feature']['ga_documentation']) ? (<div className="w-full h-20 flex">
                        <div className="w-3/4 border-l-2 rounded-l-xl border-y-2 p-4 flex items-center">
                            <div>
                                <h1 className="font-semibold text-sm uppercase">Documentation</h1>
                                <p className="text-zinc-500 text-xs">Create a website documentation</p>
                            </div>
                        </div>
                        {
                            loading ?
                                <button disabled={true} className="w-1/4 rounded-r-xl from-zinc-500 via-zinc-600 to-zinc-800 transition-all duration-300 ease-in-out hover:from-zinc-400 hover:via-zinc-500 hover:to-zinc-700 bg-gradient-to-br flex items-center justify-center">
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                                :
                                <button onClick={() => handlerCreateDocumentation()} className="w-1/4 rounded-r-xl from-red-500 via-pink-600 to-red-800 transition-all duration-300 ease-in-out hover:from-red-400 hover:via-pink-500 hover:to-red-700 bg-gradient-to-br flex items-center justify-center">
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>

                        }
                    </div>) : null
                }
                {   // check permission add mom
                    (profileData['_bitws']['add'] & profileData['_feature']['ga_mom']) ? (<div className="w-full h-20 flex">
                        <div className="w-3/4 border-l-2 rounded-l-xl border-y-2 p-4 flex items-center">
                            <div>
                                <h1 className="font-semibold text-sm uppercase">Minute of Meeting</h1>
                                <p className="text-zinc-500 text-xs">Create a MOM</p>
                            </div>
                        </div>
                        {
                            loading ?
                                <button disabled={true} className="w-1/4 rounded-r-xl from-zinc-500 via-zinc-600 to-zinc-800 transition-all duration-300 ease-in-out hover:from-zinc-400 hover:via-zinc-500 hover:to-zinc-700 bg-gradient-to-br flex items-center justify-center">
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                                :
                                <button onClick={() => handlerCreateMOM()} className="w-1/4 rounded-r-xl from-green-500 via-lime-600 to-green-800 transition-all duration-300 ease-in-out hover:from-green-400 hover:via-lime-500 hover:to-green-700 bg-gradient-to-br flex items-center justify-center">
                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>

                        }
                    </div>): null
                }


                {   // check permission add note
                    (profileData['_bitws']['add'] & profileData['_feature']['ga_note']) ? (
                        <div className="w-full h-20 flex">
                            <div className="w-3/4 border-l-2 rounded-l-xl border-y-2 p-4 flex items-center">
                                <div>
                                    <h1 className="font-semibold text-sm uppercase">Note</h1>
                                    <p className="text-zinc-500 text-xs">Create a note</p>
                                </div>
                            </div>
                            {
                                loading ?
                                    <button onClick={() => handlerCreateNote()} className="w-1/4 rounded-r-xl from-zinc-500 via-zinc-600 to-zinc-800 transition-all duration-300 ease-in-out hover:from-zinc-400 hover:via-zinc-500 hover:to-zinc-700 bg-gradient-to-br flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                    :
                                    <button onClick={() => handlerCreateNote()} className="w-1/4 rounded-r-xl from-blue-500 via-cyan-600 to-blue-800 transition-all duration-300 ease-in-out hover:from-blue-400 hover:via-cyan-500 hover:to-blue-700 bg-gradient-to-br flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                            }
                        </div>
                    ) : null
                }


                {/* <div className="w-full h-20 flex">
                    <div className="w-3/4 border-l-2 rounded-l-xl border-y-2 p-4 flex items-center">
                        <div>
                            <h1 className="font-semibold text-sm uppercase">Error Knowledge</h1>
                            <p className="text-zinc-500 text-xs">Create a Error Knowledge</p>
                        </div>
                    </div>
                    {
                        loading ?
                            <button onClick={() => handlerCreateNote()} className="w-1/4 rounded-r-xl from-zinc-500 via-zinc-600 to-zinc-800 transition-all duration-300 ease-in-out hover:from-zinc-400 hover:via-zinc-500 hover:to-zinc-700 bg-gradient-to-br flex items-center justify-center">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            :
                            <button onClick={() => handlerCreateErrorKnowledge()} className="w-1/4 rounded-r-xl from-orange-500 via-amber-600 to-orange-800 transition-all duration-300 ease-in-out hover:from-orange-400 hover:via-amber-500 hover:to-orange-700 bg-gradient-to-br flex items-center justify-center">
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                    }
                </div> */}
            </div>

            {/* APPLICATION */}
            <div className="border-2 w-full rounded-full overflow-hidden py-2 px-10 relative">
                <svg fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5 absolute top-0 left-3 translate-y-1/2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="search" className="w-full text-sm outline-none bg-inherit" placeholder="Search Project" />
                <button className="absolute right-0 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all duration-300 px-8 font-semibold top-0 h-full flex items-center gap-2">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                    Filter
                </button>
            </div>

            <div className="flex items-center justify-between mt-5 mb-8">
                <h1 className="">{t("otherRecent")}</h1>
                <button title="Refresh Application" onClick={() => handlerRefresh()} className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300 shadow-md">
                    <FaSync className="text-lg" />
                </button>
            </div>
            {
                active == "myProject" ?
                    <MyProjectApplication data={data} profileData={profileData} />
                    : ""
            }

            {
                active == "shareProject" ?
                    <ShareProjectApplication data={data} profileData={profileData} />
                    : ""
            }
        </>
    )
}
