import { useContext, useEffect } from "react";
import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { FaChevronRight } from "react-icons/fa";
import Layout from "../../../components/Layouts/Layout";
import CardAddList from "../../../components/Tasks/CardAddList";
import CardStatus from "../../../components/Tasks/CardStatus";
import ModalTask from "../../../components/Tasks/ModalTask/ModalTask";
import { MyContext } from "../../../context/MyProvider";
import ProjectRepository from "../../../repositories/ProjectRepository";
import TaskRepository from "../../../repositories/TaskRepository";
import MenuBoard from "../../../components/Templates/MenuBoard";
import Link from "next/link";
import Swal from "sweetalert2";
import NotFound from "@components/NotFound/NotFound";

function BoardEditor(props) {
  const { t } = useTranslation()
  const { profileData } = props
  // const status = useStatus(JSON.parse(localStorage.getItem("XA")), id)
  const context = useContext(MyContext)
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log("use effect taskboard active??")
    async function getData() {
      const result = await ProjectRepository.getProjectByID({ xa: JSON.parse(localStorage.getItem("XA")), id: id })
      const status = await TaskRepository.getStatusTask({ xa: JSON.parse(localStorage.getItem("XA")), id: id })
      if (status.status == 0) {
        const tasks = await TaskRepository.getTask({ xa: JSON.parse(localStorage.getItem("XA")), id: id })
        console.log(result, status, tasks);

        // IF error
        let newArr = []
        status.data.forEach((val, key) => {
          let filter = null
          if (tasks?.data) {
            filter = tasks?.data ? tasks.data.filter(res => {
              return res.status_id == val.id
            }) : []
          } else {
            Swal.fire({
              title: "Something went wrong",
              text: "Can't get task on status",
              icon: "error"
            })
            filter = []
          }
          val.tasks = filter
          newArr.push(val)
        });
        const sequence = newArr.sort((a, b) => {
          return a.sequence - b.sequence
        })
        let obj = {
          project: result.data,
          profileData,
          data: sequence
        }
        context.setDataDocumentation(obj)
      }
    }


    context.setDataDocumentation(null);
    if (id) {
      getData()
    }
  }, [id])

  // check permission view task
  if ((profileData['_bitws']['view'] & profileData['_feature']['ga_task']) == 0) {
    return <NotFound />
  }

  if (context.dataDocumentation) {
    // Board mode
    // if(context.dataDocumentation.project.typeBoard == "board")
    // return "Home"
    return (
      <Layout title={context?.dataDocumentation?.project?.name ?? "Board"} desc="HALAMAN BOARD">
        <section className="w-full relative h-screen overflow-y-hidden">
          <div className="relative w-full h-full">
            <div className="border-b h-fit p-5 w-full">
              <div>
                <div className="flex items-center gap-3">
                  <Link href={`/usr/workspaces/project/${context.dataDocumentation?.project?.name}?id=${context.dataDocumentation?.project?.id}`}>
                    <h1 className="text-zinc-500 hover:text-blue-500 dark:text-zinc-400 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span>Project Detail</h1>
                  </Link>
                  <FaChevronRight className="text-zinc-500 text-sm" />
                  <h1 className="font-semibold text-zinc-500 dark:text-zinc-400">Kanban Board Project</h1>
                </div>
                <p className="text-2xl font-bold capitalize">{context.dataDocumentation?.project?.name}</p>
              </div>
              {
                context.dataDocumentation?.project?.workspace_id && <MenuBoard lang={t} profileData={profileData} />
              }
            </div>

            <div className="flex gap-5 p-5 h-5/6 overflow-x-auto w-screen bg-zinc-100">
              {
                context.dataDocumentation?.data?.map((list, idx) => {
                  return (
                    <CardStatus item={list} project={context.dataDocumentation.project} key={idx} profileData={profileData} />
                  )
                })
              }
              <CardAddList project={context.dataDocumentation.project} profileData={profileData} />
            </div>
          </div>
        </section>
        <ModalTask profileData={profileData} />
      </Layout>
    )
  }
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

export default BoardEditor