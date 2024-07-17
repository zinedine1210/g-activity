import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout2 from "../../../components/Layouts/Layout2";
import Forum from "../../../components/Workspaces/Forum";
import General from "../../../components/Workspaces/General";
import ListProject from "../../../components/Workspaces/ListProject";
import Members from "../../../components/Workspaces/Members";
import { mutate } from "swr"
import { useRouter } from "next/router";
import ModalProject from "../../../components/Projects/ModalProject";
import WorkspacesRepository from "../../../repositories/WorkspacesRepository";
import { useDetailWorkspace } from "../../../utils/swr";
import Swal from "sweetalert2";
import Link from "next/link";
import { HiKey, HiLockClosed, HiOutlineOfficeBuilding, HiUserGroup } from "react-icons/hi";
import { MyContext } from "../../../context/MyProvider";
import { FaChevronRight, FaProjectDiagram } from "react-icons/fa";

function DetailWorkspaces(props) {
  const router = useRouter()
  const { id } = router.query;
  const { profileData } = props
  const { query } = props
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState(null)
  const workspace = useDetailWorkspace(query.id, JSON.parse(localStorage.getItem("XA")))
  // console.log(workspace);
  const context = useContext(MyContext)
  
  console.log("id query", id)

  useEffect(() => {
    console.log("ini pasti sekali")
    async function getWorkspaceTeam(){
      const result = await WorkspacesRepository.getTeam({type:1, id:query.id, xa:JSON.parse(localStorage.getItem("XA"))})
      console.log("result teeam", result)
      setMember(result?.data)
    }

    getWorkspaceTeam()
    
  }, [id])
  
  const dataWorkspace = workspace?.data?.data
  const workspaceOwner = dataWorkspace?.is_owner !== 0
  const {t} = useTranslation("common")
  const [active, setActive] = useState(query.tab ?? 1)

  const handleTab = async title => {
    setActive(title)
    router.push({
      pathname: router.pushname,
      query: { ...router.query, tab: title }
    }, undefined, { shallow: true })
  }

  const handlerDelete = () => {
    Swal.fire({
      title: "Are you sure delete this workspace?",
      text: `To confirm, type "${dataWorkspace?.name}" in the box below`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        if(login == dataWorkspace?.name){
          try{
            const result = await WorkspacesRepository.deleteWorkspace({id:query.id, xa:JSON.parse(localStorage.getItem("XA"))})
            console.log(result);
            if(!result.status == 0 || !result.message == "Data has been deleted"){
              return Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text:"Please try again later",
                position: "top-right",
                timer: 3000
              })
            }
            return query.id
  
          }catch(e){
            Swal.showValidationMessage(`
              Request failed: ${e}
            `);
          }
        }else{
          Swal.showValidationMessage(`
            Confirmation text is incorrect
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        mutate([1, JSON.parse(localStorage.getItem("XA"))], cache => {
          console.log(cache)
          const filterOne = cache.data.filter(res => {
            return res.id != result.value
          })
          cache.data = filterOne
          return cache
        }, false)
        Swal.fire({
          icon: "info",
          title: "Successfully removed",
          position: "top-right",
          timer: 3000
        })
        router.push("/usr/workspaces")
      }
    });
  }


  return (
    <Layout2 title={`${dataWorkspace?.name ?? "Workspace Detail"}`} profileData={profileData}>
      <section className="min-h-screen contain px-2 md:px-20 pt-32">
        {/* breadcrumb */}
        <div className="flex items-center gap-4 mb-3 dark:text-white text-zinc-500">
          <Link href={"/usr/workspaces"}>
            <button type="button" className="flex items-center gap-2 text-lg hover:text-blue-500 duration-300 ease-in-out">
              <HiOutlineOfficeBuilding className="text-xl" />
              <h1>All Workspace</h1>
            </button>
          </Link>
          <FaChevronRight className="text-zinc-400"/>
          <h1 className="text-lg font-bold">{dataWorkspace?.name ?? "---"}</h1>
        </div>
        <div className="border-b-2 pb-5">
          <div className="flex items-center gap-5 relative">
            <FaProjectDiagram className="w-20 h-20"/>
            <div>
              <h1 className="uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-300">Workspace Information</h1>
              <p className="text-xl md:text-3xl font-bold capitalize">{dataWorkspace?.name ?? "----"}</p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm">{dataWorkspace?.description ? dataWorkspace.description : <span className="text-red-500">This workspace doesn't have any description</span>}</p>
            </div>
          </div>
          <div className="flex items-center gap-10 mt-2">
            <span className="justify-center flex items-center text-sm md:text-base gap-1 capitalize">
              <HiLockClosed className="text-xl text-blue-500"/>
              Workspace {dataWorkspace?.privacy == 1 ? "Public":"Private"}
            </span>
            <span className="flex items-center text-sm md:text-base gap-2">
              <HiUserGroup className="text-xl text-blue-500"/>
              {member ? member.length : "--"} Member
            </span>
            {
              workspaceOwner && (
                <span className="flex items-center text-sm md:text-base gap-2">
                  <HiKey className="text-xl text-blue-500"/>
                  Owner
                </span>
              )
            }
          </div>
        </div>
        {
          !workspaceOwner && (
            <div className="bg-yellow-200 w-full py-2 px-10">
              <h1 className="font-semibold">Access restrictions because you are not the owner of this workspace</h1>
            </div>
          )
        }
        {
          dataWorkspace ? (
            <>
              <div className="flex items-center gap-2 mt-5 w-full overflow-x-auto">
                  <button className={`${active == 1 ? "border-b-2 border-primary pb-2":"pb-2.5"} px-3 text-sm md:text-base`} onClick={() => handleTab(1)}>
                      Project
                  </button>
                  <button className={`${active == 2 ? "border-b-2 border-primary pb-2":"pb-2.5"} px-3 text-sm md:text-base`} onClick={() => handleTab(2)}>
                      General
                  </button>
                  <button className={`${active == 4 ? "border-b-2 border-primary pb-2":"pb-2.5"} px-3 text-sm md:text-base`} onClick={() => handleTab(4)}>
                      Members
                  </button>
                  {
                    // pembatasan akses
                    workspaceOwner && (
                    <>
                      <button className={`${active == 6 ? "border-b-2 border-primary pb-2":"pb-2.5"} px-3 text-sm md:text-base`} onClick={() => handleTab(6)}>
                          Delete
                      </button>
                    </>
                    )
                  }
                  {/* <button className={`${active == 5 ? "border-b-2 border-primary pb-2":"pb-2.5"} px-3 text-sm md:text-base`} onClick={() => handleTab(5)}>
                      Forum
                  </button> */}
              </div>

              {
                active == 1?
                <ListProject workspace={workspace} profileData={profileData}/>
                :""
              }
              {
                active == 2?
                <General setActive={() => context.setDataDocumentation(context.dataDocumentation)} data={dataWorkspace}/>
                :""
              }
              {
                active == 4?
                <Members data={dataWorkspace} members={member} setMember={val => setMember(val)} profileData={profileData} />
                :""
              }
              {
                active == 5?
                <Forum />
                :""
              }

                <ModalProject data={dataWorkspace} profileData={profileData} members={member}/>

              
              {
                active == 6 && (
                  <div className="py-10">
                    {
                      workspaceOwner ? 
                      <>
                        <h1 className="text-xl font-bold text-red-500">Delete "{dataWorkspace.name}"</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-10">Remove the Workspace and all its data from our servers</p>

                        <div className="border-4 border-orange-400 bg-orange-50 p-2 md:p-8 rounded-xl relative">
                          <span className="text-orange-500 text-5xl md:text-[100px] border-4 border-orange-500 bg-orange-50 font-extrabold absolute top-1/2 -translate-y-1/2 right-10 w-20 md:w-44 h-20 md:h-44 rounded-full justify-center flex items-center">!</span>
                          <h1 className="font-extrabold text-orange-400">IF YOU DELETE THIS WORKSPACE THE FOLLOWING DATA WILL BE PERMANENTLY DELETED:</h1>
                          <ul className="font-semibold mx-5">
                            <li>Project</li>
                            <li>Documentation</li>
                            <li>Note</li>
                            <li>Minute of Meeting</li>
                            <li>Forum</li>
                          </ul>
                        </div>
                        <button disabled={loading} type="button" className="disabled:border-zinc-500 disabled:text-zinc-500 border-2 border-red-500 px-2 py-1 rounded-md font-semibold mt-20 text-red-500" onClick={() => handlerDelete()}>Delete Forever</button>
                      </>
                      :"You dont have access to this tab"
                    }
                  </div>
                )
              }
            </>
          )
          :
          <div className="py-5">
            <div className="w-full grid grid-cols-2 lg:grid-cols-12 gap-2 mb-5">
              <div className="w-full h-10 skeleton"></div>
              <div className="w-full h-10 skeleton"></div>
              <div className="w-full h-10 skeleton"></div>
              <div className="w-full h-10 skeleton"></div>
            </div>
            <h1 className="w-96 h-8 skeleton mb-3"></h1>

            <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-5 mt-5">
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
              <div className="w-full h-24 skeleton"></div>
            </div>
          </div>
        }

      </section>
    </Layout2>
  )
}


export async function getServerSideProps({ locale, query }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      query: query
      // Will be passed to the page component as props
    }
  };
}

export default DetailWorkspaces