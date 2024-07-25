import Layout2 from "../../../components/Layouts/Layout2";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "react-i18next";
import { MyContext } from "../../../context/MyProvider";
import { useContext, useState } from "react";
import CardWorkspace from "../../../components/Workspaces/CardWorkspace";
import { useWorkspaces } from "../../../utils/swr";
import CardApprove from "../../../components/Workspaces/CardApprove";
import { useRouter } from "next/router";
import NotFound from "@components/NotFound/NotFound";

function Workspace(props) {
    const { profileData } = props
    const router = useRouter()
    const { tab } = router.query
    const { t } = useTranslation("common")
    const context = useContext(MyContext)
    const [active, setActive] = useState(tab ?? "myWork")
    const dataMyWorkspace = useWorkspaces(1, JSON.parse(localStorage.getItem("XA")))
    const dataShareWorkspace = useWorkspaces(2, JSON.parse(localStorage.getItem("XA")))
    const dataInviteWorkspace = useWorkspaces(3, JSON.parse(localStorage.getItem("XA")))
   

    const handleTab = async title => {
        setActive(title)
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: title },
        }, undefined, { shallow: true });
    }

    // check permission view workspace
    if ((profileData['_bitws']['view'] & profileData['_feature']['workspace']) == 0) {
        return <NotFound />
    }

    return (
        <Layout2 title={"All workspace"} desc={"HALAMAN PROJECT"} profileData={profileData}>
            <section className="min-h-screen px-10 py-5">
                <h1 className="text-3xl font-bold">Workspaces</h1>
                <p className="text-zinc-500 mb-5 dark:text-zinc-200">Workspaces allow you to separate your work efficiently.</p>
                {
                    dataInviteWorkspace?.data?.data.length > 0 &&
                    <p>If you have a workspace invitation, <a href="#workspaceinvitation" className="text-blue-500 hover:underline">Click Here</a></p>
                }
                <div className="flex items-center justify-between gap-5 mt-5 bg-blue-100 dark:bg-blue-500 px-5 rounded-xl">
                    <div className="flex items-center gap-2">
                        {/* check permission add workspace */}
                        {
                            (profileData['_bitws']['add'] & profileData['_feature']['workspace']) ? (<button onClick={() => handleTab("myWork")} className={`${active == "myWork" ? "border-b-2 border-primary dark:border-white" : ""} hover:bg-blue-200 dark:hover:bg-blue-600 duration-300 transition-colors py-4 px-3 text-sm md:text-base`}>
                                Your Work
                            </button>) : null
                        }

                        <button onClick={() => handleTab("shareWithYou")} className={`${active == "shareWithYou" ? "border-b-2 border-primary dark:border-white" : ""} hover:bg-blue-200 dark:hover:bg-blue-600 duration-300 transition-colors py-4 px-3 text-sm md:text-base`}>
                            Joint Workspace
                        </button>
                    </div>
                    <div className="w-72 overflow-hidden py-3 px-10 relative">
                        <svg fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5 text-zinc-500 dark:text-white absolute top-1/2 left-2 -translate-y-1/2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input type="search" className="dark:placeholder:text-white w-full text-sm outline-none bg-inherit placeholder:text-zinc-500" placeholder="Search Workspace" />
                        <button className="absolute right-0 rounded-full hover:bg-blue-200 dark:hover:bg-blue-600 transition-all duration-300 px-8 font-semibold top-0 h-full flex items-center gap-2">
                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>
                {/* YOUR WORK */}
                {
                    active == "myWork" && <> {
                        // check permission add documentation
                        (profileData['_bitws']['add'] & profileData['_feature']['workspace']) ? <div className="py-5">
                            <h1 className="font-bold text-xl">Your Own Workspaces</h1>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5 mt-5`}>
                                <button className="h-56 border-2 border-dashed rounded-xl border-zinc-400 flex items-center justify-center p-5" onClick={() => context.setData({ ...context, activeWorkspace: true })}>
                                    <h1 className="font-semibold text-xl">Create a Workspace</h1>
                                </button>
                                {
                                    !dataMyWorkspace ?
                                        new Array(4).fill("mantap").map(() => {
                                            return (
                                                <div className="h-56 bg-zinc-200 w-full animate-pulse rounded-md"></div>
                                            )
                                        })
                                        :
                                        dataMyWorkspace?.data?.data.map((item, key) => {
                                            return (
                                                <CardWorkspace item={item} key={key} />
                                            )
                                        })
                                }
                            </div>
                        </div> : "You dont have access to this tab"
                    }
                    </>
                }




                {/* SHARE WITH YOU */}
                {
                    active == "shareWithYou" ?
                        <div className="py-5">
                            <h1 className="font-bold text-xl">This workspace is shared with you</h1>
                            <p className="text-sm"></p>
                            <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5`}>
                                {
                                    !dataShareWorkspace ?
                                        new Array(4).fill("mantap").map(() => {
                                            return (
                                                <div className="h-56 bg-zinc-200 w-full animate-pulse rounded-md"></div>
                                            )
                                        })
                                        :
                                        dataShareWorkspace?.data?.data.map((item, key) => {
                                            return (
                                                <CardWorkspace item={item} key={key} />
                                            )
                                        })
                                }
                            </div>
                        </div>
                        : ""
                }

                {
                    active == "inviteYou" ?
                        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5`}>
                            {
                                !dataInviteWorkspace ?
                                    new Array(4).fill("mantap").map(() => {
                                        return (
                                            <div className="h-56 bg-zinc-200 w-full animate-pulse rounded-md"></div>
                                        )
                                    })
                                    :
                                    dataInviteWorkspace?.data?.data.map((item, key) => {
                                        return (
                                            <CardApprove profileData={profileData} item={item} />
                                        )
                                    })
                            }
                        </div>
                        : ""
                }
                {
                    dataInviteWorkspace?.data?.data.length > 0 && (
                        <div className="bg-zinc-100 rounded-md py-5 mt-10 px-5" id="workspaceinvitation">
                            <header>
                                <h1 className="font-semibold text-xl">Workspace Invitation</h1>
                                <p>There are <span className="font-bold">{dataInviteWorkspace?.data?.data.length}</span> invitations for you to join the workspace</p>
                            </header>
                            <div>
                                <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5`}>
                                    {
                                        dataInviteWorkspace?.data?.data.map((item, key) => {
                                            return (
                                                <CardApprove profileData={profileData} item={item} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
        </Layout2>
    )
}


export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            // Will be passed to the page component as props
        }
    };
}

export default Workspace