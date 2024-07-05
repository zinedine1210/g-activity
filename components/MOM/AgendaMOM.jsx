import { useContext, useState } from "react";
import { MyContext } from "../../context/MyProvider";

export default function AgendaMOM() {
    const context = useContext(MyContext)
    const data = context.dataDocumentation


    const handlerKey = async (e, index) => {
        data.agenda[index] = e.target.innerHTML

        if(e.key == "Enter"){
            e.preventDefault()
            await handlerAddAgenda(index)
            document.getElementById(`agenda-${index + 1}`).focus()
        }

        if(e.key == "Backspace" && data.agenda[index] == ""){
            if(index == 0){
                return false
            }
            await data.agenda.splice(index, 1)
            document.getElementById(`agenda-${index - 1}`).focus()
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handlerAddAgenda = async (index) => {
        await data.agenda.splice(index + 1, 0, "")
        context.setDataDocumentation(context.dataDocumentation)
    }
    
    
  return (
      <div className="pb-10">
        <h2 className="font-semibold text-zinc-800 dark:text-white">Agenda</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300 mb-2">Add discussion topics before the meeting.</p>
        <div>
            {
                data.agenda.map((text, key) => {
                    return (
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
                            <h1 id={`agenda-${key}`} className="editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={e => handlerKey(e, key)} maxLength={10} data-placeholder="Type Here..." contentEditable dangerouslySetInnerHTML={{__html:text}} key={key}></h1>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}
