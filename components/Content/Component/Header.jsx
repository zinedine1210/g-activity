import { marked } from "marked"
import { useContext } from "react"
import { useEffect, useState } from "react"
import { MyContext } from "../../../context/MyProvider"

export default function Header(props) {
    const [size, setSize] = useState(null)
    const context = useContext(MyContext)
    
    const handlerChange = (val) => {
      const mark = marked(val)
      props.property.text = mark
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerKey = (e) => {
      if(e.key == "Enter"){
        e.preventDefault()
        const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
        if(props.property.tab){
          data.tab = props.property.tab
        }else{
          data.tab = 1
        }
        props.handlerAddSection(data, props.property)
      }
    }

    useEffect(() => {
        const getID = props.property.id
        if(getID == 4){
            setSize("text-2xl")
        }else if (getID == 5) {
            setSize("text-xl")
        }else{
            setSize("text-lg")
        }
    }, [])
    
    return (
      <div className="block">
        <h1 id={`property-${props.property.index}`} className={`font-semibold editable-text ${size} text-zinc-600 dark:text-zinc-300 capitalize`} role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang(props.property.type)} onKeyDown={(e) => handlerKey(e)} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
      </div>
    )
  }
  