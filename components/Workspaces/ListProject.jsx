import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import { useProjects } from "../../utils/swr";
import { useRouter } from "next/router";

export default function ListProject(props) {
    const router = useRouter()
    const { tabProject } = router.query;
    const [owner, setOwner] = useState(true)
    const [active, setActive] = useState(tabProject ?? "myProject")
    const context = useContext(MyContext)
    const dataMyProjects = useProjects(1, JSON.parse(localStorage.getItem("XA")), props.workspace.data.data.id)
    const dataShareProjects = useProjects(2, JSON.parse(localStorage.getItem("XA")), props.workspace.data.data.id)
    const { id } = router.query;
    const { profileData } = props
    console.log("id", id)
    // console.log(dataMyProjects)

    useEffect(() => {
        console.log("props.workspace.data", props.workspace)
        // cek apakah pemilik
        if (props.workspace.data.data.is_owner !== 0) {
            setOwner(true)
        } else {
            setOwner(false)
            setActive("shareProject")
            router.push({
                pathname: router.pathname,
                query: { ...router.query, tabProject: "shareProject" }
            }, undefined, { shallow: true })
        }
    }, [id])

    const handleTab = async title => {
        setActive(title)
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tabProject: title }
        }, undefined, { shallow: true })
    }

    return (
        <div className="py-10">
            <h1 className="font-bold text-base md:text-xl mb-5">Project you belong to</h1>

            <div className="flex items-center justify-between gap-5 mb-5 bg-blue-100 dark:bg-blue-500 px-5 rounded-xl">
                <div className="flex items-center gap-2">
                    {
                        owner && (profileData['_bitws']['add'] & profileData['_feature']['project']) ? <button onClick={() => handleTab("myProject")} className={`${active == "myProject" ? "border-b-2 border-primary dark:border-white" : ""} hover:bg-blue-200 dark:hover:bg-blue-600 duration-300 transition-colors py-4 px-3 text-sm md:text-base`}>
                            Your Project
                        </button> : null
                    }
                    <button onClick={() => handleTab("shareProject")} className={`${active == "shareProject" ? "border-b-2 border-primary dark:border-white" : ""} hover:bg-blue-200 dark:hover:bg-blue-600 duration-300 transition-colors py-4 px-3 text-sm md:text-base`}>
                        Joint Project
                    </button>
                </div>
                <div className="w-72 overflow-hidden py-3 px-10 relative">
                    <svg fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5 text-zinc-500 dark:text-white absolute top-1/2 left-2 -translate-y-1/2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input type="search" className="dark:placeholder:text-white w-full text-sm outline-none bg-inherit placeholder:text-zinc-500" placeholder="Search Project" />
                    <button className="absolute right-0 rounded-full hover:bg-blue-200 dark:hover:bg-blue-600 transition-all duration-300 px-8 font-semibold top-0 h-full flex items-center gap-2">
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                        Filter
                    </button>
                </div>
            </div>


            {
                active == "myProject" ?
                    <>
                        {
                            owner && (profileData['_bitws']['add'] & profileData['_feature']['project']) ? (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5'>
                                <div className="border-2 border-dashed rounded-xl cursor-pointer border-zinc-400 flex items-center justify-center p-5" onClick={() => context.setData({ ...context, activeProject: true })}>
                                    <h1 className="font-semibold text-xl">Create a Project</h1>
                                </div>
                                {
                                    dataMyProjects ?
                                        dataMyProjects?.data?.data.length > 0 ?
                                            dataMyProjects?.data?.data.map((item, key) => {
                                                return (
                                                    <Link href={`/usr/workspaces/project/${item.name}?id=${item.id}`} key={key}>
                                                        <div className="w-full bg-red-500 h-24 rounded-xl p-2 relative">
                                                            <h1 className="font-semibold text-white">{item.name}</h1>
                                                            <span className="flex items-center gap-1 absolute bottom-2 left-2 text-white text-sm">
                                                                <svg fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </Link>
                                                )
                                            })
                                            : ""
                                        : new Array(10).fill("loading").map((load) => {
                                            return (
                                                <div className="skeleton w-full h-24"></div>
                                            )
                                        })
                                }
                            </div>) : "You dont have access to this tab"
                        }
                    </> : ""
            }

            {
                active == "shareProject" ?
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5'>
                        {
                            dataShareProjects ?
                                dataShareProjects?.data?.data.length > 0 ?
                                    dataShareProjects?.data?.data.map((item, key) => {
                                        return (
                                            <Link href={`/usr/workspaces/project/${item.name}?id=${item.id}`} key={key}>
                                                <div className="w-full bg-red-500 h-24 rounded-xl p-2 relative">
                                                    <h1 className="font-semibold text-white">{item.name}</h1>
                                                    <span className="flex items-center gap-1 absolute bottom-2 left-2 text-white text-sm">
                                                        <svg fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                        </svg>
                                                        {/* {item.members.length} */}
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    })
                                    :
                                    <div className="py-5 w-full">
                                        <h1 className="text-xl font-bold text-red-500">No data available</h1>
                                        <p className>You must be invited to join a joint project</p>
                                    </div>
                                :
                                new Array(10).fill("loading").map((load) => {
                                    return (
                                        <div className="skeleton w-full h-24"></div>
                                    )
                                })
                        }
                    </div>
                    : ""
            }
        </div>
    )
}
