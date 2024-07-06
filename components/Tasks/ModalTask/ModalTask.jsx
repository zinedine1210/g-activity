import { useContext } from "react"
import { MyContext, urlData } from "../../../context/MyProvider"
import { FaAlignJustify, FaAngleDoubleRight, FaBars, FaCheck, FaChevronLeft, FaChevronRight, FaRegClock, FaUserCheck, FaUserPlus } from "react-icons/fa"
import LabelTask from "./LabelTask"
import { findIndex } from "lodash"
import AttachmentsTask from "./AttachmentsTask"
import ActivityTask from "../ActivityTask/ActivityTask"
import DescriptionTask from "../ActivityTask/DescriptionTask"
import AssignedTask from "./AssignedTask"
import TaskRepository from "../../../repositories/TaskRepository"
import Swal from "sweetalert2"

export default function ModalTask() {
    const context = useContext(MyContext)
    const item = context.activeTask

    const handlerPrevious = () => {
        const getIndex = findIndex(item.status.tasks, { id: item.task.id })
        if (getIndex != 0) {
            const obj = JSON.parse(JSON.stringify(item.status.tasks[getIndex - 1]))
            // console.log(newData);

            let newData = {
                task: obj,
                status: item.status
            }

            context.setData({ ...context, activeTask: newData })
        }
    }

    const handlerNext = () => {
        const getIndex = findIndex(item.status.tasks, { id: item.task.id })
        // console.log(getIndex);
        const obj = JSON.parse(JSON.stringify(item.status.tasks[getIndex + 1]))
        // console.log(newData);

        let newData = {
            task: obj,
            status: item.status
        }

        context.setData({ ...context, activeTask: newData })
    }

    const handlerAllSave = async () => {
        console.log(item);
        const data = JSON.parse(JSON.stringify(item.task))
        delete data.is_owner
        delete data.id
        delete data.workspace_id
        delete data._cb
        delete data._cd
        delete data.project_id
        console.log(data);

        const result = await TaskRepository.putTask({ id: item.task.id, data: data, xa: JSON.parse(localStorage.getItem("XA")) })
        console.log(result);
        if (result.status == 0) {
            const indexStatus = findIndex(context.dataDocumentation.data, { id: item.status.id })
            const indexTask = findIndex(context.dataDocumentation.data[indexStatus].tasks, { id: item.task.id })
            context.dataDocumentation.data[indexStatus].tasks[indexTask] = item.task
            context.setDataDocumentation(context.dataDocumentation)
            context.setData({ ...context, activeTask: null })
            Swal.fire({
                icon: "success",
                position: "top-end",
                title: "Changes saved successfully",
                timer: 1000,
                showConfirmButton: false
            })
        }
    }

    const handlerChange = (value, target) => {
        item.task[target] = value
        context.setData({ ...context, activeTask: item })
    }


    return (
        <div className={`${item && item.status.tasks ? "opacity-100 visible" : "opacity-0 invisible"} fixed top-0 left-0 flex justify-center right-0 z-50 bg-black bg-opacity-20 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}>
            <div className="relative w-full h-full md:h-auto">
                <div className={`${item && item.status.tasks ? "translate-y-0 opacity-100" : "-translate-y-56 opacity-0"} transition-all duration-500 relative rounded-lg shadow dark:bg-darkSecondary bg-white flex items-center ${item && item.task.is_owner ? "ring-4 ring-offset-4 ring-[#CBF0F8] ring-offset-transparent" : ""}`}>
                    {
                        item && item.status.tasks ?
                            <div className="p-6 w-full relative">
                                <div className="flex items-center gap-2 justify-between pb-3 border-b">
                                    <div className="flex items-center gap-2">
                                        <button className="hover:bg-blue-50 transition-all duration-300 p-2 rounded-md border disabled:bg-zinc-100" disabled={findIndex(item.status.tasks, { id: item.task.id }) == 0 ? true : false} onClick={() => handlerPrevious()}>
                                            <FaChevronLeft />
                                        </button>
                                        <button className="hover:bg-blue-50 transition-all duration-300 p-2 rounded-md border disabled:bg-zinc-100" disabled={findIndex(item.status.tasks, { id: item.task.id }) == item.status.tasks.length - 1 ? true : false} onClick={() => handlerNext()}>
                                            <FaChevronRight />
                                        </button>
                                        <h1 className="text-sm text-zinc-500"><span className="text-3xl font-bold">{findIndex(item.status.tasks, { id: item.task.id }) + 1}</span> of {item.status.tasks.length}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="hover:bg-red-200 transition-all duration-300 p-2 rounded-md border" onClick={() => context.setData({ ...context, activeTask: null })}>
                                            <svg fill="none" stroke="currentColor" strokeWidth={3.5} className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <button className="hover:bg-green-200 transition-all duration-300 p-2 rounded-md border" onClick={() => handlerAllSave()}>
                                            <FaCheck />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-1/2 px-5 border-r">
                                        <div className="mt-5">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4" defaultChecked={item.task.resolve ? true : false} onChange={(e) => handlerChange(e.target.checked ? 1 : 0, "resolve")} />
                                                <h1 className="editable-text text-xl text-zinc-500 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "title")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Title of Task"}>{item.task.title}</h1>
                                            </div>

                                            <LabelTask item={item.task} />
                                        </div>

                                        <div className="mt-5">
                                            <h1 className="flex items-center gap-3 font-bold text-sm text-zinc-500 dark:text-zinc-300 mb-5"><FaAlignJustify /> Description</h1>
                                            <DescriptionTask item={item.task} />
                                        </div>

                                        <div className="mt-5">
                                            <h1 className="flex items-center gap-3 font-bold text-sm text-zinc-500 dark:text-zinc-300 mb-5"><FaRegClock /> Date</h1>
                                            <div className="flex items-center gap-5">
                                                <div>
                                                    <h1 className="text-zinc-500 dark:text-zinc-300 text-xs">Start Date</h1>
                                                    <input type="date" className="focus:outline-none border p-1" defaultValue={item.hasOwnProperty("start_date") ? item.start_date : null} onChange={(e) => handlerChange(e.target.value + " 00:00:00", "start_date")} />
                                                </div>
                                                <div>
                                                    <h1 className="text-zinc-500 dark:text-zinc-300 text-xs">Due Date</h1>
                                                    <input type="date" defaultValue={item.hasOwnProperty("start_date") ? item.start_date : null} className="focus:outline-none border p-1" onChange={(e) => handlerChange(e.target.value + " 00:00:00", "due_task")} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <h1 className="flex items-center gap-3 font-bold text-sm text-zinc-500 dark:text-zinc-300 mb-5"><FaUserCheck /> Assigned</h1>
                                            <AssignedTask item={item.task} />
                                        </div>

                                        <div className="mt-5">
                                            <AttachmentsTask />
                                        </div>
                                    </div>
                                    <div className="w-1/2 px-5">
                                        <ActivityTask item={item.task} />
                                    </div>
                                </div>

                            </div>
                            : ""
                    }
                </div>
            </div>
        </div>
    )
}
