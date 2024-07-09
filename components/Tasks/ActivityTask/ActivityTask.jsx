import { useContext, useState, useRef } from "react";
import { FaDotCircle, FaHistory } from "react-icons/fa";
import { MyContext } from "../../../context/MyProvider";
import TipTapTask from "../ModalTask/TipTapTask";
import CardAttachments from "./CardAttachments";
import CardComments from "./CardComments";
import { mutate } from "swr"
import { getTimeAgo, getTimeDate } from "../../../utils/function";
import { useActivity } from "../../../utils/swr";
import TaskRepository from "../../../repositories/TaskRepository";

export default function ActivityTask(props) {
  const activity = useActivity(JSON.parse(localStorage.getItem("XA")), props.item.id)
  console.log(activity)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState("")
  const context = useContext(MyContext)
  const editorRef = useRef(null);
  console.log(activity);

  const handlerEnter = (value) => {
    setData(value)
  }

  const handlerCreateComment = async () => {
    let obj = {
      type: "comments",
      content: data,
      task_id: props.item.id
    }

    const result = await TaskRepository.postActivityTask({ xa: JSON.parse(localStorage.getItem("XA")), data: obj })
    if (result.status == 0) {
      const newData = JSON.parse(JSON.stringify(result.data))
      newData._cb_docs = { username: context.dataDocumentation.profileData.username }
      newData._cd = { epoch_time: new Date().getTime() }
      setData("")
      editorRef.current.clearEditor();
      mutate(['activity', props.item.id], cache => {
        cache.data.unshift(newData)
        return cache
      }, false)

      context.setDataDocumentation(context.dataDocumentation)
    }
  }
  if (activity)

    return (
      <>
        <div className="mt-5 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-3 font-bold text-lg text-zinc-500 dark:text-zinc-300"><FaHistory /> Activity</h1>
            <button className={`px-2 py-1 rounded-md font-semibold transition-all duration-300 bg-zinc-200 text-zinc-500`}>Show Details</button>
          </div>
        </div>

        <div className="relative hover:pt-20 transition-all duration-300 group h-full">
          <div className="absolute top-0 left-0 w-full border-b-2 py-2 invisible group-hover:visible bg-white flex items-center gap-4">
            <span className="flex items-center justify-center text-white bg-red-500 w-10 h-10 rounded-full shadow-md font-bold uppercase">{context.dataDocumentation.profileData.username.charAt(0)}</span>
            <div className="w-full relative">
              <TipTapTask ref={editorRef}  value={data} style="text-sm pl-3 pr-8 py-2" handlerEnter={(value) => handlerEnter(value)} />
              <button className="absolute top-1/2 text-sm font-semibold right-1 hover:bg-zinc-200 bg-zinc-100 p-1 rounded-md -translate-y-1/2" onClick={() => handlerCreateComment()}>Submit</button>
            </div>
          </div>
          <div className="space-y-5">
            {
              activity?.data?.data.length > 0 ? activity?.data?.data.map((item, key) => {
                if (item.type == "comments") {
                  return (
                    <CardComments item={item} key={key} />
                  )
                }
                if (item.type == "attach") {
                  return (
                    <CardAttachments item={item} key={key} />
                  )
                }
                if (item.type == "Task") {
                  return (
                    <div className="flex gap-3 border-b pb-2">
                      <span className="flex items-center justify-center text-white bg-red-500 w-10 h-10 rounded-full shadow-md font-bold uppercase">{item._cb_docs.username.charAt(0)}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-sm"><span className="font-bold">{item._cb_docs.fullname}</span> created a <span className="font-bold bg-zinc-300 py-0.5 px-2 rounded-md text-xs uppercase">Task</span></h1>
                          <FaDotCircle className="w-2 h-2 text-zinc-500" />
                          <span className="text-xs text-zinc-500">{getTimeAgo(item._cd.epoch_time * 1000)} {getTimeDate(item._cd.epoch_time * 1000)}</span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-300 font-semibold">Title Task: <span className="text-black">{item.content}</span></p>
                      </div>
                    </div>

                  )
                }
              })
                : ""
            }
          </div>
        </div>
      </>
    )
}
