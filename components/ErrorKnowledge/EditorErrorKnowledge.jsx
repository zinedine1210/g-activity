import { useContext } from "react"
import { FaPlus } from "react-icons/fa"
import { MyContext } from "../../context/MyProvider"
import { generateId } from "../../utils/function"
import { handlerAddErrorLogs } from "../../utils/repositories"
import ErrorLogs from "./ErrorLogs"

export default function EditorErrorKnowledge() {
    const context = useContext(MyContext)
    const data = context.dataDocumentation

    const handlerChange = (value, target) => {
      data[target] = value
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerInsertErrorLogs = async () => {
      let obj = {
          "description": null,
          "errorStatus": "problem",
          "id": generateId(),
          "errorKnowledgeID": context.dataDocumentation.id,
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
          "urutan": 1
      }
      const data = await handlerAddErrorLogs(obj)
      context.dataDocumentation.errorLogs.push(data)
      context.setDataDocumentation(context.dataDocumentation)
  }


  return (
    <div className="w-full">
        <h1 className="editable-text text-xl font-bold uppercase mb-10" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "name")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Give this Error Knowledge a Title"} dangerouslySetInnerHTML={{__html:data.name}}></h1>
        <div className="sm:flex sm:items-center sm:justify-between mb-2 group">
            <div>
                <div className="flex items-center gap-x-3">
                    <h2 className="text-lg font-medium text-zinc-800 dark:text-white">Error Logs</h2>

                    <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-zinc-800 dark:text-blue-400">{context.dataDocumentation.errorLogs ? context.dataDocumentation.errorLogs.length : 0} Records</span>
                </div>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">Systematic record of errors or problems that occur in a computer system or program.</p>
            </div>
            <button onClick={() => handlerInsertErrorLogs()} className="group-hover:visible invisible rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100">
              <FaPlus className="text-zinc-500 dark:text-zinc-300"/>
            </button>
        </div>
        <ErrorLogs data={data}/>
    </div>
  )
}
