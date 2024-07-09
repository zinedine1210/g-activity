import { findIndex } from "lodash"
import { useContext, useEffect, useRef, useState } from "react"
import { FaEllipsisH } from "react-icons/fa"
import Swal from "sweetalert2"
import CollectionData from "@repositories/CollectionData"
import { MyContext } from "../../context/MyProvider"
import TaskRepository from "../../repositories/TaskRepository"
import CardAddTask from "./CardAddTask"
import CardTask from "./CardTask"

export default function CardStatus(props) {
    const [hide, setHide] = useState(true)
    const context = useContext(MyContext)
    const dropRef = useRef(null)
    const [open, setOpen] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        props.item.tasks.sort((a, b) => {
            return a.sequence - b.sequence
        })
        context.setDataDocumentation(context.dataDocumentation)

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerDeleteStatus = async () => {
        console.log("delete");
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
                const result = await TaskRepository.deleteStatus({xa:JSON.parse(localStorage.getItem("XA")), id:props.item.id})
                console.log(result);
                if(result.status == 0){
                    const newData = JSON.parse(JSON.stringify(context.dataDocumentation.data)).filter(res => {
                        return res.id != props.item.id
                    })
        
                    context.dataDocumentation.data = newData
                    context.setDataDocumentation(context.dataDocumentation)
                }
            }
        })
        console.log(context.dataDocumentation);
        setOpen(false)
    }

    const handleDragStart = (e, status) => {
        console.log("status start");
        context.setData({...context, activeDrag:"status"})
        e.dataTransfer.setData('json', JSON.stringify(status))
    }

    const handlerChangePosition = async (drag, drop) => {
        const arr = JSON.parse(JSON.stringify(context.dataDocumentation.data))
        const dragIndex = findIndex(arr, {id:drag.id})
        const dropIndex = findIndex(arr, {id:drop.id})
        
        arr.splice(dragIndex, 1)
        arr.splice(dropIndex, 0, drag)

        arr.forEach((val, key) => {
            val.sequence = key + 1
        });

        let getDataDrag = arr.find(res => res.id == drag.id)
        let getDataDrop = arr.find(res => res.id == drop.id)

        console.log("getDataDrag", getDataDrag)
        console.log("getDataDrop", getDataDrop)


        CollectionData.putData({ url: `task_status`, values: [getDataDrag, getDataDrop], id: '_repos_status' })
        context.dataDocumentation.data = arr
        context.setDataDocumentation(context.dataDocumentation)
        
    }

    const handlerChangeStatus = async (drop, drag) => {
        const arr = JSON.parse(JSON.stringify(context.dataDocumentation.data))
        const dropIndex = findIndex(arr, {id:drop.id})
        const dragStatusIndex = findIndex(arr, {id:drag.status_id})
        // console.log(dragStatusIndex);
        drag.status_id = drop.id
        arr[dropIndex].tasks.push(drag)

        const dragIndex = findIndex(arr[dragStatusIndex].tasks, {id:drag.id})
        arr[dragStatusIndex].tasks.splice(dragIndex, 1)
        
        arr[dragStatusIndex].tasks.forEach((val, key) => {
            val.sequence = key + 1
        })

        context.dataDocumentation.data = arr
        CollectionData.putData({ url: `task_status/_repos_task`, values: [drag], id: drop.id })
        context.setDataDocumentation(context.dataDocumentation)
      }
    
    const handleDrop = async (e, dropStatus, type) => {
        e.preventDefault()
        const dragStatus = JSON.parse(e.dataTransfer.getData("json"))
        document.getElementById(dropStatus.id).style.border = "none"
        document.getElementById(dragStatus.id).style.border = "none"
        if(!dragStatus.hasOwnProperty("status_id")){
            handlerChangePosition(dragStatus, dropStatus)
        }else{
            if(props.item.tasks.length > 0){
                return Swal.fire({
                    icon:"warning",
                    title:"Invalid",
                    timer:1000,
                    showConfirmButton:false
                })
            }
            handlerChangeStatus(dropStatus, dragStatus)
        }

        // document.getElementById(dragStatus.statusID).style.border = "none"
        context.setData({...context, activeDrag:null})
    }

    const handleDragEnter = (e, id) => {
        e.preventDefault()
        const dropzone = document.getElementById(id)
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.style.border = "none"
        }
        else {
            if(context.activeDrag == "status"){
                dropzone.style.border = "3px solid blue"
            }else{
                dropzone.style.border = "3px solid red"
            }
        }
    }

    
    const handlerDragLeave = (e, id) => {
        e.preventDefault()
        const dropzone = document.getElementById(id)
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.style.border = "none"
        }
        else {
            if(context.activeDrag == "status"){
                dropzone.style.border = "3px solid blue"
            }else{
                dropzone.style.border = "3px solid red"
            }
        }
    }


    const handlerResolveAllTask = async () => {
        props.item.tasks.forEach(val => {
            val.done = true
            handlerResolveTask(val)
            console.log(val);
        })
    }

    const handlerResolveTask = async (val) => {
        // console.log(val);
        // const result = await TaskRepository.putTask({id:val.id, data:val, xa:JSON.parse(localStorage.getItem("XA"))})
        // console.log(result);
    
        setOpen(false)
    }


    // if(props.item)
    // return (
    //     <button onClick={() => handlerCoba()}>
    //         Klik
    //     </button>
    // )
    return (
        <div id={props.item.id} className="statusZone flex flex-shrink-0 w-96 p-3 rounded-2xl bg-zinc-500/10 dark:bg-darkPrimary h-fit" onDragOver={e => e.preventDefault()} onDragEnter={e => handleDragEnter(e, props.item.id)} onDragLeave={e => handlerDragLeave(e, props.item.id)} draggable onDragStart={(e) => handleDragStart(e, props.item)} onDrop={(e) => handleDrop(e, props.item, 'status')} >
            <div className="relative w-full">
                <div className="header flex items-center justify-between group w-full mb-2">
                    <h1 className="text-sm font-bold uppercase">{props.item.title}</h1>
                    <div className="relative" ref={dropRef}>
                        <button onClick={() => setOpen(true)} className="group-hover:visible invisible transition-all duration-300 bg-zinc-200 dark:bg-dark p-2 opacity-0 group-hover:opacity-100 focus:bg-zinc-500 focus:text-white rounded-md">
                            <FaEllipsisH className="w-4 h-4"/>
                        </button>

                        <div className={`absolute text-sm bg-white dark:bg-dark w-56 shadow-xl rounded-md z-20 transition-all duration-300  ${open ? "block opacity-100":"hidden opacity-0"}`}>
                            <div className="py-4 px-3 space-y-3 border-b">
                                <div className="flex items-center justify-between">
                                    <h1>Total Task</h1>
                                    <span className="font-bold">{props.item.tasks.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-blue-500">
                                    <h1>Active Task</h1>
                                    <span className="font-bold">{props.item.tasks.filter(res => !res.done).length}</span>
                                </div>
                                {/* <div className="flex items-center justify-between text-green-500">
                                    <h1>Resolved Task</h1>
                                    <span className="font-bold">{props.item.tasks.filter(res => res.done).length}</span>
                                </div> */}
                                {/* <label className="flex items-center justify-between">
                                    <h1>Show Resolved Task</h1>
                                    <input type="checkbox" id="show" checked={hide} onChange={e => setHide(!hide)} className="w-4 h-4" />
                                </label> */}
                            </div>
                            <div className="space-y-1">
                                {/* <button className="block w-full text-start hover:bg-zinc-100 p-3 dark:hover:bg-darkPrimary">Move Status...</button>
                                <button className="block w-full text-start hover:bg-zinc-100 p-3 dark:hover:bg-darkPrimary">Copy Status...</button>
                                <button className="block w-full text-start hover:bg-zinc-100 p-3 dark:hover:bg-darkPrimary" onClick={() => handlerResolveAllTask()}>Resolve all Task...</button> */}
                                <button className="block w-full text-start hover:bg-zinc-100 p-3 dark:hover:bg-darkPrimary text-red-500" onClick={() => handlerDeleteStatus()}>Delete Status...</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {
                        props.item.tasks.map((task, idx2) => {
                            return (
                                <CardTask status={props.item} item={task} hide={hide} project={props.project} key={idx2}/>
                            )
                        })
                    }
                    <CardAddTask length={props.item.tasks.length} status={props.item}/>
                </div>
            </div>
        </div>
    )
}
