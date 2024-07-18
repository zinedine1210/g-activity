import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import Layout2 from "../../../../components/Layouts/Layout2";
import { mutate } from "swr"
import { useContext, useEffect, useState } from "react";
import { FaChevronRight, FaClock, FaCog, FaComment, FaFirstdraft, FaProjectDiagram, FaTable, FaTasks, FaThumbtack, FaTrash, FaUsers } from "react-icons/fa";
import Application from "../../../../components/Projects/Application";
import Link from "next/link";
import Members from "../../../../components/Projects/Members";
import General from "../../../../components/Projects/General"
import { useDetailProject } from "../../../../utils/swr";
import ProjectRepository from "../../../../repositories/ProjectRepository";
import { useRouter } from "next/router";
import { HiLockClosed, HiOutlineOfficeBuilding, HiUserGroup } from "react-icons/hi"
import Swal from "sweetalert2";
import { MyContext } from "../../../../context/MyProvider";
import NotFound from "@components/NotFound/NotFound";

function Project(props) {
  const router = useRouter()
  const { profileData, query } = props
  const [active, setActive] = useState(query.tab ?? 1)
  const dataProject = useDetailProject(JSON.parse(localStorage.getItem("XA")), query.id)
  const [member, setMember] = useState(null)
  const context = useContext(MyContext)

  console.log("profileData di project", profileData)

  useEffect(() => {
    async function getMemberProject() {
      const getXA = JSON.parse(localStorage.getItem("XA"))
      const result = await ProjectRepository.getTeam({ id: query.id, type: 1, xa: getXA })
      console.log(result)
      setMember(result.data)
    }

    if (!member) {
      getMemberProject()
    }
  }, [])

  const handlerDelete = () => {
    Swal.fire({
      title: "Are you sure delete this project?",
      text: `To confirm, type "${dataDataProject?.name}" in the box below`,
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
        if (login == dataDataProject?.name) {
          try {
            const result = await ProjectRepository.deleteProject({ xa: JSON.parse(localStorage.getItem("XA")), id: query.id })
            // console.log(result);
            if (!result.status == 0) {
              return Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again later",
                position: "top-right",
                timer: 3000
              })
            }
            return query.id

          } catch (e) {
            Swal.showValidationMessage(`
              Request failed: ${e}
            `);
          }
        } else {
          Swal.showValidationMessage(`
            Confirmation text is incorrect
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(['projects', 1, dataDataProject.workspace_id], cache => {
          const newArr = cache.data.filter(res => {
            return res.id != result.value
          })
          cache.data = newArr
          return cache
        }, false)
        Swal.fire({
          icon: "info",
          title: "Successfully removed",
          position: "top-right",
          timer: 3000
        })
        router.push(`/usr/workspaces/Untitled?id=${dataDataProject.workspace_id}`)
      }
    });
  }

  const { t } = useTranslation("common")

  const dataDataProject = dataProject?.data?.data;

  const handleTab = async title => {
    setActive(title)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: title }
    }, undefined, { shallow: true })
  }

  let projectOwner = dataProject?.data?.data?.is_owner !== 0;

  // check permission view project
  if ((profileData['_bitws']['view'] & profileData['_feature']['project']) == 0) {
    return <NotFound />
  }

  return (
    <Layout2 title={`${dataDataProject?.name ?? "Project Detail"}`} profileData={profileData}>
      <section className="min-h-screen contain px-2 md:px-20 pt-32">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-4 mb-3 dark:text-white text-zinc-500">
          <Link href={"/usr/workspaces"}>
            <button type="button" className="flex items-center gap-2 text-lg hover:text-blue-500 duration-300 ease-in-out">
              <HiOutlineOfficeBuilding className="text-xl" />
              <h1>All Workspace</h1>
            </button>
          </Link>
          <FaChevronRight className="text-zinc-400" />
          <Link href={`/usr/workspaces/U?id=${dataDataProject?.workspace_id}&tab=1&tabProject=myProject`}>
            <button type="button" className="flex items-center gap-2 text-lg hover:text-blue-500 duration-300 ease-in-out">
              <FaProjectDiagram className="text-xl" />
              <h1>This Workspace</h1>
            </button>
          </Link>
          <FaChevronRight className="text-zinc-400" />
          <h1 className="text-lg font-bold">{dataDataProject?.name ?? "---"}</h1>
        </div>
        {/* INFORMATION */}
        <div className="border-b-2 pb-5">
          <div className="flex items-center gap-5 relative">
            <div className="uppercase w-16 md:w-24 h-16 md:h-24 bg-black dark:bg-zinc-800 text-white font-extrabold text-3xl md:text-5xl rounded-xl flex items-center justify-center">
              {dataDataProject?.name.charAt(0) ?? "-"}
            </div>
            <div>
              <h1 className="uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-300">{t("project")}</h1>
              <p className="text-xl md:text-3xl font-bold capitalize">{dataDataProject?.name ?? "----"}</p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm">{dataDataProject?.description ? dataDataProject.description : <span className="text-red-500">This workspace doesn't have any description</span>}</p>
            </div>
          </div>
          <div className="flex items-center gap-10 mt-2">
            <span className="justify-center flex items-center text-sm md:text-base gap-1 capitalize">
              <HiLockClosed className="text-xl text-blue-500" />
              Workspace {dataDataProject?.privacy == 1 ? "Public" : "Private" ?? "----"}
            </span>
            <span className="flex items-center text-sm md:text-base gap-2">
              <HiUserGroup className="text-xl text-blue-500" />
              {member ? member?.length + 1 : "--"} Member
            </span>
          </div>
        </div>
        {/* ALERT PERMISSION */}
        {
          !projectOwner && (
            <div className="bg-yellow-200 w-full py-2 px-10">
              <h1 className="font-semibold">Access restrictions because you are not the owner of this project</h1>
            </div>
          )
        }

        {
          dataProject ? (
            <div className="md:flex gap-5 mt-5">
              {/* SIDEMENU */}
              <div className="w-full md:w-1/5 h-full bg-white dark:bg-dark p-3 shadow-md rounded-md space-y-1">
                <button onClick={() => handleTab(1)} className={`${active == 1 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                  <FaClock className="w-5 h-5 text-zinc-500" />
                  Recent
                </button>
                {
                  (profileData['_bitws']['view'] & profileData['_feature']['ga_task']) ? <Link href={`/usr/board?id=${dataDataProject?.id}`}>
                    <button className={`rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                      <FaTable className="w-5 h-5 text-zinc-500" />
                      Task Board
                    </button>
                  </Link> : null
                }

                <button onClick={() => handleTab(3)} className={`${active == 3 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                  <FaCog className="w-5 h-5 text-zinc-500" />
                  General
                </button>
                {/* <button onClick={() => handleTab(4)} className={`${active == 4 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                  <FaFirstdraft className="w-5 h-5 text-zinc-500" />
                  Draft
                </button> */}
                <button onClick={() => handleTab(5)} className={`${active == 5 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                  <FaUsers className="w-5 h-5 text-zinc-500" />
                  Members
                </button>
                {/* <button onClick={() => handleTab(6)} className={`${active == 6 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                  <FaComment className="w-5 h-5 text-zinc-500" />
                  Forum
                </button> */}
                {
                  projectOwner && (profileData['_bitws']['delete'] & profileData['_feature']['project']) ? (
                    <button onClick={() => handleTab(7)} className={`${active == 7 ? "bg-zinc-200 dark:bg-darkSecondary" : "dark:hover:bg-darkSecondary hover:bg-zinc-100"} rounded-md w-full py-2 px-6 text-center font-semibold flex items-center gap-4 transition-all`}>
                      <FaTrash className="w-5 h-5 text-red-500" />
                      Delete
                    </button>
                  ) : null
                }
              </div>

              {/* TABS */}
              <div className="mt-10 md:mt-0 w-full md:w-4/5">
                {
                  active == 1 ?
                    <Application data={dataDataProject} t={t} profileData={profileData} />
                    : ""
                }
                {
                  active == 3 ?
                    <General setActive={() => context.setDataDocumentation(context.dataDocumentation)} data={dataDataProject} profileData={profileData} />
                    : ""
                }
                {
                  active == 4 ?
                    "Draft No Work"
                    : ""
                }
                {
                  active == 5 ?
                    <Members data={dataDataProject} setMember={value => setMember(value)} member={member} />
                    : ""
                }
                {
                  active == 7 &&
                  <>
                    {
                      // check permission delete project
                      projectOwner && (profileData['_bitws']['delete'] & profileData['_feature']['project']) ?
                        <button onClick={() => handlerDelete()} className="border-2 border-red-500 text-sm text-red-500 p-2 rounded-md uppercase font-bold">
                          Hapus Project
                        </button>
                        : "You dont have access to this tab"
                    }
                  </>
                }
              </div>
            </div>
          )
            :
            <div className="py-5">
              <div className="flex gap-5">
                <div className="w-full md:w-1/5 skeleton h-96"></div>
                <div className="w-full">
                  <h1 className="skeleton w-56 h-8"></h1>
                  <div className="grid grid-cols-6 w-1/2 mb-3 gap-2 mt-10">
                    <div className="skeleton w-full h-10"></div>
                    <div className="skeleton w-full h-10"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-2">
                    <div className="w-full h-24 skeleton"></div>
                    <div className="w-full h-24 skeleton"></div>
                    <div className="w-full h-24 skeleton"></div>
                    <div className="w-full h-24 skeleton"></div>
                  </div>

                  <div className="w-full h-10 skeleton my-5"></div>
                  <div className="flex items-center justify-between my-3">
                    <h1 className="w-56 h-5 skeleton"></h1>
                    <span className="block w-10 h-10 rounded-full bg-zinc-400 dark:bg-zinc-200 animate-pulse"></span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-5 w-full gap-2">
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                    <div className="w-full h-32 skeleton"></div>
                  </div>
                </div>
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
      query
      // Will be passed to the page component as props
    }
  };
}

export default Project