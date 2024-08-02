import { useContext } from "react"
import { MyContext } from "../../context/MyProvider"
import AgendaMOM from "./AgendaMOM"
import DateMOM from "./DateMOM"
import ActionMOM from "./ActionMOM"
import ParticipantsMOM from "./ParticipantsMOM"
import TableMOM from "./TableMOM"
import TimeMOM from "./TimeMOM"
import ConclusionMOM from "./ConclusionMOM"
import ParticipantsMOM2 from "./ParticipantsMOM2"

export default function EditorMOM() {
    const context = useContext(MyContext)
    const data = context.dataDocumentation

    const handlerChange = (value, target) => {
      data[target] = value
      context.setDataDocumentation(context.dataDocumentation)
    }

    if(context.dataDocumentation)
  return (
    <div className="w-full">
        <h1 className="editable-text text-xl font-bold uppercase" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "title")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Give this Minutes of Meeting a Title"} dangerouslySetInnerHTML={{__html:data.title}}></h1>
        <div className="space-y-1">
            <DateMOM />
            <TimeMOM />

            <div className="flex gap-2 mt-10">
                <h1 className="font-semibold w-1/5">Tempat</h1>
                <div className="flex w-4/5">
                    <span className="font-bold text-xl mr-2">:</span>
                    <h1 className="editable-text px-2 text-base" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "place")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Tempat"} dangerouslySetInnerHTML={{__html:data.place}}></h1>
                </div>
            </div>

            <div className="flex gap-2 mt-10 pb-5">
                <h1 className="font-semibold w-1/5">Alamat</h1>
                <div className="flex w-4/5">
                    <span className="font-bold text-xl mr-2">:</span>
                    <h1 className="editable-text px-2 text-base" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "address")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Alamat"} dangerouslySetInnerHTML={{__html:data.address}}></h1>
                </div>
            </div>

            <AgendaMOM />
            
            <ParticipantsMOM2 />

            <TableMOM />

            <ActionMOM />
            
            <ConclusionMOM />
        </div>
    </div>
  )
}
