import { findIndex } from "lodash";
import { useContext, useEffect, useRef, useState } from "react"
import { FaEllipsisH } from "react-icons/fa";
import { HiOutlineChat, HiOutlineClock } from "react-icons/hi"
import Swal from "sweetalert2";
import { MyContext } from "../../context/MyProvider"
import TaskRepository from "../../repositories/TaskRepository";

export default function CardTask({ item, project, hide, status }) {
  const context = useContext(MyContext)
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropRef.current && !dropRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const handlerActiveTask = () => {
    let obj = JSON.parse(JSON.stringify(item))

    let data = {
      task: obj,
      status: status
    }

    context.setData({ ...context, activeTask: data })
  }

  const handlerResolveTask = async (e) => {
    e.stopPropagation()
    item.done = !item.done
    context.setDataDocumentation(context.dataDocumentation)

    setOpen(false)
  }

  const handlerDeleteTask = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        e.stopPropagation()
        const result = await TaskRepository.deleteTask({ id: item.id, xa: JSON.parse(localStorage.getItem("XA")) })
        console.log(result);
        if (result.status == 0) {
          const newArr = status.tasks.filter(res => {
            return res.id != item.id
          })

          status.tasks = newArr
          context.setDataDocumentation(context.dataDocumentation)
        }

        setOpen(false)
      }
    })
  }

  const handlerChangePosition = async (drop, drag) => {
    const dataStatus = JSON.parse(JSON.stringify(status.tasks))
    const dragIndex = findIndex(dataStatus, { id: drag.id })
    const dropIndex = findIndex(dataStatus, { id: drop.id })

    dataStatus.splice(dragIndex, 1)
    dataStatus.splice(dropIndex, 0, drag)

    dataStatus.forEach((val, key) => {
      val.sequence = key + 1
    });

    console.log(dataStatus);

    status.tasks = dataStatus
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handlerChangeStatus = async (drop, drag) => {
    const dropStatus = JSON.parse(JSON.stringify(status.tasks))
    const dropIndex = findIndex(dropStatus, { id: drop.id })
    dropStatus.splice(dropIndex + 1, 0, drag)

    const dragStatus = context.dataDocumentation.data.find(res => res.id == drag.status_id)
    drag.status_id = drop.status_id
    const dragIndex = findIndex(dragStatus.tasks, { id: drag.id })
    dragStatus.tasks.splice(dragIndex, 1)

    dragStatus.tasks.forEach((val, key) => {
      val.sequence = key + 1
    })

    dragStatus.tasks = dragStatus.tasks

    dropStatus.forEach((val, key) => {
      val.sequence = key + 1
    });

    status.tasks = dropStatus
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handleDrop = (e, dropStatus, type) => {
    e.stopPropagation()
    e.preventDefault()

    const dragStatus = JSON.parse(e.dataTransfer.getData("json"))
    document.getElementById(dropStatus.id).style.border = "none"
    document.getElementById(dragStatus.id).style.border = "none"
    document.getElementById(dragStatus.status_id).style.border = "none"

    if (!dragStatus.hasOwnProperty("status_id") || !dropStatus.hasOwnProperty("status_id")) {
      return Swal.fire("Invalid, you can't drop data here")
    }

    if (dropStatus.status_id == dragStatus.status_id) {
      handlerChangePosition(dropStatus, dragStatus)
    } else {
      handlerChangeStatus(dropStatus, dragStatus)
    }

    context.setData({ ...context, dataTask: null })
  }

  const handleDragStart = (e, task) => {
    console.log("task start");
    e.stopPropagation()
    context.setData({ ...context, activeDrag: "task" })
    e.dataTransfer.setData('json', JSON.stringify(task))
  }

  const handlerDragOver = (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    const dropzone = document.getElementById(id)
    if (!dropzone.contains(e.relatedTarget)) {
      dropzone.style.border = "none"
    }
    else {
      if (context.activeDrag == "task") {
        dropzone.style.border = "3px solid blue"
      } else {
        dropzone.style.border = "3px solid red"
      }
    }
  }

  const handlerDragLeave = (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    const dropzone = document.getElementById(id)
    if (!dropzone.contains(e.relatedTarget)) {
      dropzone.style.border = "none"
    }
    else {
      if (context.activeDrag == "task") {
        dropzone.style.border = "3px solid blue"
      } else {
        dropzone.style.border = "3px solid red"
      }
    }
  }

  const handlerOption = e => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }

  function calculateTimeDifference(startDate, endDate) {
    // Konversi tanggal ke objek Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Hitung perbedaan dalam milidetik
    const differenceInMilliseconds = end - start;

    // Hitung perbedaan dalam hari dan jam
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    if (differenceInHours > 24) {
      return differenceInDays + "d"
    } else {
      return differenceInHours + "h"
    }
  }

  return (
    <div id={item.id} className={`-z-20 h-full w-full border-l-8 ${item.is_owner ? "border-green-500" : "border-red-500"} bg-white dark:bg-dark rounded-md shadow-md p-3 ${item.done == true ? hide ? "" : "hidden" : ""}`} onDragOver={e => e.preventDefault()} draggable onDragEnter={e => handlerDragOver(e, item.id)} onDragLeave={e => handlerDragLeave(e, item.id)} onDragStart={(e) => handleDragStart(e, item)} onDrop={(e) => handleDrop(e, item, 'task')}>
      <div className="flex justify-between group">
        <div className="flex gap-3 cursor-pointer" onClick={() => handlerActiveTask()}>
          <input type="checkbox" className="w-6 h-6 rounded-md outline-none border-none" checked={item.done} onChange={e => handlerResolveTask(e)} />
          <div className="w-full pb-2">
            <h1 className="text-base">{item.title}</h1>
            {
              item?.label && (
                <div className="flex flex-wrap items-center gap-x-1">
                  {
                    item.label.map((lab, key) => {
                      return <span key={key} style={{ backgroundColor: lab.color + "50" }} className="text-xs py-1 px-2 block rounded-md tracking-wider mt-2 text-black">{lab?.value}</span>
                    })
                  }
                </div>
              )
            }
          </div>
        </div>
        <div ref={dropRef}>
          <button onClick={(e) => handlerOption(e)} className={`${open ? "opacity-100 visible" : "group-hover:visible invisible"} dark:bg-darkPrimary transition-all duration-300 bg-zinc-200 p-2 opacity-0 group-hover:opacity-100 focus:bg-zinc-500 dark:focus:bg-darkSecondary focus:text-white rounded-md`}>
            <FaEllipsisH className="w-3 h-3" />
          </button>

          <div className={`absolute text-sm backdrop-blur-xl w-56 shadow-xl rounded-md z-20 transition-all duration-300 right-0 ${open ? "block opacity-100" : "hidden opacity-0"}`}>
            <div className="space-y-1">
              <button className="block w-full text-start hover:bg-blue-200 p-3 dark:hover:bg-darkPrimary">Move Task...</button>
              <button className="block w-full text-start hover:bg-blue-200 p-3 dark:hover:bg-darkPrimary">Copy Task...</button>
              <button className="block w-full text-start hover:bg-blue-200 p-3 dark:hover:bg-darkPrimary" onClick={e => handlerResolveTask(e)}>Resolve Task...</button>
              <button className="block w-full text-start hover:bg-blue-200 p-3 dark:hover:bg-darkPrimary text-red-500" onClick={(e) => handlerDeleteTask(e)}>Delete Task...</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pt-2 border-t flex items-center justify-between">
        <div className="flex -space-x-3 rtl:space-x-reverse">
          {
            item.assign ? item.assign.map((asg, key) => {
              return (
                <div title={asg.username} className="flex items-center justify-center text-white uppercase font-bold w-7 h-7 border bg-zinc-500 border-zinc-300 rounded-full dark:border-gray-800" key={key}>
                  {asg.username.charAt(0)}
                </div>
              )
            })
              : <h1 className="text-red-500 text-xs">None have been assigned yet</h1>
          }
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <HiOutlineChat className="text-zinc-500 text-xl" />
            {item.count_comment}
          </div>
          {
            item?.start_date && item?.due_task && (
              <div className="flex items-center gap-1 text-sm">
                <HiOutlineClock className="text-zinc-500 text-xl" />
                {calculateTimeDifference(item.start_date, item.due_task)}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
