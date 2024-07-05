import { useContext, useEffect, useRef, useState } from "react";
import { FaCaretDown, FaClone, FaEllipsisV, FaPlus, FaTasks, FaTrash } from "react-icons/fa";
import { MyContext } from "../../context/MyProvider";
import { generateId } from "../../utils/function";
import { handlerAddErrorLogs, handlerDeleteErrorLogs } from "../../utils/repositories";
import AssignLogs from "./AssignLogs";
import ComboErrorKnowledge from "./ComboErrorKnowledge";
import DateErrorKnowledge from "./DateErrorKnowledge";

export default function CardLogs({log}) {
    const context = useContext(MyContext)
    const [open, setOpen] = useState(false)
    const dropRef = useRef(null)
    const [menu, setMenu] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerChange = (value, target) => {
        log[target] = value
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerKey = e => {
        console.log(e.key);
    }

    let objErrorKnowledge = [
        {
            value:"resolved",
            color:"#34eb5c"
        },
        {
            value:"open",
            color:"#ebd534"
        },
        {
            value:"progress",
            color:"#3446eb"
        }
    ]

    let objSeverity = [
        {
            value:"high",
            color:"#a10aff"
        },
        {
            value:"medium",
            color:"#00ab91"
        },
        {
            value:"low",
            color:"#f74402"
        }
    ]

    let objErrorStatus = [
        {
            value:"problem",
            color:"#79d600"
        },
        {
            value:"incident",
            color:"#595959"
        }
    ]

    let objCategory = ["Backend", "Frontend", "Dev Ops", "Mobile"]

    const handlerInsertErrorLogs = async () => {
        let obj = {
            "description": null,
            "errorStatus": "problem",
            "id": generateId(),
            "errorKnowledgeID": log.errorKnowledgeID,
            "caused": null,
            "solution": null,
            "solutionDate": {
              "date": null,
              "dateLocale": null
            },
            "category": "backend",
            "location": null,
            "problemDate": {
              "date": null,
              "dateLocale": null
            },
            "assignedTo": [],
            "attachment": [],
            "create": new Date(),
            "severity": "low",
            "status": "open",
            "urutan": log.urutan + 1
        }
        const data = await handlerAddErrorLogs(obj)
        context.dataDocumentation.errorLogs.push(data)
        context.setDataDocumentation(context.dataDocumentation)
    }
    
    const handlerDuplicateLogs = async () => {
        const duplicateData = JSON.parse(JSON.stringify(log))
        duplicateData.id = generateId()
        duplicateData.create = new Date()
        duplicateData.urutan = log.urutan + 1
        const data = await handlerAddErrorLogs(duplicateData)
        context.dataDocumentation.errorLogs.push(data)
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDeleteLogs = async () => {
        await handlerDeleteErrorLogs(log)
        const newData = context.dataDocumentation.errorLogs.filter(res => {
            return res.id != log.id
        })
        context.dataDocumentation.errorLogs = newData
        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div draggable className={`${open || menu ? "bg-yellow-50 border-2 border-yellow-100":"hover:bg-yellow-50 hover:border-2 hover:border-yellow-100"} p-1 rounded-md transition-colors duration-300`}>
        <div className='flex gap-2 justify-between items-center'>
            <div className="flex gap-1 items-center">
                <div ref={dropRef} className="relative">
                    <button className={`${menu ? "bg-blue-100":"hover:bg-blue-100"} rounded-md transition-all duration-300 flex items-center justify-center w-7 h-7`} onClick={() => setMenu(!menu)}>
                        <FaEllipsisV/>
                    </button>

                    <div className={`${menu ? "":"hidden"} z-20 absolute bg-white rounded-md shadow-lg overflow-hidden w-56 mt-1`}>
                        <h1 className="p-2 text-sm font-bold border-b">Action</h1>
                        <button onClick={() => handlerInsertErrorLogs()} className="p-2 text-sm hover:bg-blue-100 transition-all duration-300 capitalize w-full text-start flex items-center gap-2"><FaPlus className="text-zinc-500 dark:text-zinc-300"/> Insert New Error Logs</button>
                        <button onClick={() => handlerDuplicateLogs()} className="p-2 text-sm hover:bg-blue-100 transition-all duration-300 capitalize w-full text-start flex items-center gap-2"><FaClone className="text-zinc-500 dark:text-zinc-300"/> Duplicate</button>
                        <button onClick={() => handlerAddTask()} className="p-2 text-sm hover:bg-blue-100 transition-all duration-300 capitalize w-full text-start flex items-center gap-2"><FaTasks className="text-zinc-500 dark:text-zinc-300"/> Add as a Task</button>
                        <button onClick={() => handlerDeleteLogs()} className="p-2 text-sm hover:bg-red-100 transition-all duration-300 capitalize w-full text-start flex items-center gap-2"><FaTrash className="text-red-500 dark:text-red-100"/> Delete</button>
                    </div>
                </div>
                <button className={`${open ? "bg-blue-100":"hover:bg-blue-100"} rounded-md transition-all duration-300 flex items-center justify-center w-7 h-7`} onClick={() => setOpen(!open)}>
                    <FaCaretDown className={`${open ? "rotate-180":""} transition-all duration-300`}/>
                </button>

                <h1 className="font-semibold">{log.description ? log.description.length > 70 ? log.description.substring(0, 70)+"...":log.description:<span className="text-red-500">Nothing Preview Description</span>}</h1>
            </div>

            <div className="flex items-center h-full gap-1">
                <ComboErrorKnowledge title="Status" value={log.status} handlerChange={value => handlerChange(value, "status")} option={objErrorKnowledge}/>
                <ComboErrorKnowledge title="Severity" value={log.severity} handlerChange={value => handlerChange(value, "severity")} option={objSeverity}/>
                <ComboErrorKnowledge title="Error Status" value={log.errorStatus} handlerChange={value => handlerChange(value, "errorStatus")} option={objErrorStatus}/>
            </div>
        </div>

        <div className={`${open ? "":"hidden"} my-1 rounded-md border-x border-t border-blue-300`}>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Description</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <h1 className="editable-text text-base px-2" role={"textbox"} onKeyDown={(e) => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent, "description")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Type Description of Incident or Problem"} dangerouslySetInnerHTML={{__html:log.description}}></h1>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Date</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <DateErrorKnowledge title="Solution Date" value={log.problemDate} handlerChange={value => handlerChange(value, "problemDate")} />
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Caused</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <h1 className="editable-text text-base px-2" role={"textbox"} onKeyDown={(e) => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent, "caused")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Type Provide a detailed explanation of the known error's causes and how it was discovered"} dangerouslySetInnerHTML={{__html:log.caused}}></h1>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Category</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <select id="countries" className="outline-none bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => handlerChange(e.target.value, "category")}>
                        <option selected={log.category ? false:true} disabled>Select Category</option>
                        {
                            objCategory.map((opt, key) => {
                                return <option selected={opt == log.category} value={opt} key={key}>{opt}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Location</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <h1 className="editable-text text-base px-2" role={"textbox"} onKeyDown={(e) => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent, "location")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Type Location of Problem or Incident"} dangerouslySetInnerHTML={{__html:log.location}}></h1>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Solution</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <h1 className="editable-text text-base px-2" role={"textbox"} onKeyDown={(e) => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent, "solution")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Describe how the known error can be resolved"} dangerouslySetInnerHTML={{__html:log.solution}}></h1>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Solution Date</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <DateErrorKnowledge title="Solution Date" value={log.solutionDate} handlerChange={value => handlerChange(value, "solutionDate")} />
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Assign To</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <AssignLogs item={log.assignedTo} handlerChange={value => handlerChange(value, "assignedTo")}/>
                </div>
            </div>
            <div className="flex items-center border-b border-blue-300 bg-blue-100">
                <div className="w-1/4 p-2 self-start">
                    <h1 className="font-bold">Attachment</h1>
                </div>
                <div className="w-3/4 bg-white p-2 border-l border-blue-300">
                    <div className="grid gap-1 grid-cols-3">
                        <div className="bg-black p-2 text-white flex items-center justify-center">
                            File
                        </div>
                        <div className="border-2 border-dashed p-2 flex items-center justify-center">
                            Upload File
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
