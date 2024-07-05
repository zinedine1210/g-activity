import { useContext, useState } from "react";
import { MyContext } from "../../context/MyProvider";

export default function ActionMOM() {
    const context = useContext(MyContext)
    const data = context.dataDocumentation


    const handlerKey = async (e, index) => {
        if(e.key == "Enter"){
            e.preventDefault()
            await handlerAddAction(index)
            document.getElementById(`action-${index + 1}`).focus()
        }

        if(e.key == "Backspace" && e.target.innerHTML == ""){
            if(index == 0){
                return false
            }
            await data.action_list.splice(index, 1)
            document.getElementById(`action-${index - 1}`).focus()
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handlerChange = (value, target, index) => {
        data.action_list[index][target] = value
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerAddAction = async (index) => {
        let obj = {
            value:null,
            check:false
        }
        await data.action_list.splice(index + 1, 0, obj)
        context.setDataDocumentation(context.dataDocumentation)
    }
    
    
  return (
    <div className="pb-10">
        <h2 className="text-lg font-medium text-zinc-800 dark:text-white">Action Item List</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300 mb-2">Add action items that you create during the meeting and check off boxes as you make progress.</p>
        <div className="space-y-2">
            {
                data.action_list.map((action, key) => {
                    return (
                        <div className="flex items-center gap-3" key={key}>
                            <input type="checkbox" className="w-4 h-4" checked={action.checked} onChange={e => handlerChange(e.target.checked, "check", key)} />
                            <h1 id={`action-${key}`} onBlur={e => handlerChange(e.target.innerHTML, "value", key)} className="editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={e => handlerKey(e, key)} maxLength={10} data-placeholder="Type your action, Enter to add other input..." contentEditable dangerouslySetInnerHTML={{__html:action.value}}></h1>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}
