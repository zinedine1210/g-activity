import { useContext } from "react"
import { MyContext } from "../../../context/MyProvider"

export default function BulletedList(props) {
  const {property} = props
  const context = useContext(MyContext)

    const handlerChange = (val) => {
        props.property.text = val
    }

    const handlerSubSection = (key) => {
      if(key == "Tab"){
        const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
        data.tab = property.tab + 1

        props.handlerUpdateComponent(data, property)
      }else{
        if(property.tab == 1){
          return false
        }
        const data = JSON.parse(JSON.stringify(property))
        data.tab = property.tab - 1
        props.handlerUpdateComponent(data, property)
      }
      context.setDataDocumentation(context.dataDocumentation)
    }
    
    const handlerKey = (e) => {
      if(e.key == "Enter"){
        e.preventDefault()
        if(e.target.innerHTML != ""){
          const data = JSON.parse(JSON.stringify(context.dataComponents[10]))
          data.tab = property.tab
          
          props.handlerAddSection(data, property)   
        }else{
          const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
          data.tab = property.tab

          props.handlerUpdateComponent(data, property)
        }
      }
      if(e.key == "Backspace" && e.target.innerHTML == ""){
        e.preventDefault()
        const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
        data.tab = property.tab
        props.handlerUpdateComponent(data, property)
      }

      if(e.key == "Tab" && e.shiftKey == false){
        e.preventDefault()
        handlerSubSection(e.key)
      }
      if(e.key == "Tab" && e.shiftKey == true){
        e.preventDefault()
        handlerSubSection("Shift")
      }
    }


  return (
    <div style={{marginLeft:(property.tab - 1) * 25+'px'}}>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
        <h1 id={`property-${props.property.index}`} className="editable-text text-base text-zinc-500 dark:text-zinc-300 px-2" role={"textbox"} onKeyDown={(e) => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeList")} dangerouslySetInnerHTML={{__html:property.text}}></h1>
      </div>
    </div>
  )
}
