import { marked } from "marked";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../context/MyProvider";

export default function Text(props) {
  const [add, setAdd] = useState(false)
  const {property} = props
  const context = useContext(MyContext)

  const handlerChange = (val) => {
    const mark = marked(val)
    props.property.text = mark
  }

  useEffect(() => {
      document.body.addEventListener("click", handleClick)
      return () => {
          document.body.removeEventListener("click", handleClick)
      }
  }, [])

  function handleClick(event) {
      if(!event.target.closest('.button-close')){
          setAdd(false);
      }
  }

  const handlerSubSection = (key) => {
    if(key == "Tab"){
      property.tab = property.tab + 1
    }else{
      if(property.tab == 1){
        return false
      }
      property.tab = property.tab - 1  
    }
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handlerKey = (e) => {
    if(e.key == "Enter"){
      e.preventDefault()
      const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
      if(property.tab){
        data.tab = property.tab
      }else{
        data.tab = 1
      }
      props.handlerAddSection(data, props.property)
    }

    if(e.key == "/"){
      setAdd(true)
    }

    if(e.key == "Backspace" && e.target.innerHTML == ""){
      e.preventDefault()
      if(property.hasOwnProperty("tab")){
        if(property.tab == 1){
          return false
        }
        const data = JSON.parse(JSON.stringify(context.dataComponents[0]))
        data.tab = property.tab - 1
        props.handlerUpdateComponent(data, property)
      }
    }

    if (/^[0-9]+\.$/.test(e.target.innerHTML) && e.key == " ") {
      const data = JSON.parse(JSON.stringify(context.dataComponents[11]))
      data.number = Number(e.target.innerHTML.split(".")[0])
      if(property.tab){
        data.tab = property.tab
      }else{
        data.tab = 1
      }
      props.handlerUpdateComponent(data, props.property)
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

  const handlerUpdate = (item) => {
    const data = JSON.parse(JSON.stringify(item))
    if(property.hasOwnProperty("tab")){
      data.tab = property.tab
    }else{
      data.tab = 1
    }
    
    props.handlerUpdateComponent(data, props.property)
  }



  return (
    <div className="block relative">
      <div className={`${add ? "block absolute top-0 left-0":"hidden"} bg-white dark:bg-darkPrimary p-3 w-64 rounded-md shadow-md overflow-y-scroll max-h-96 z-20`}>
          <ul className="space-y-2">
              {
                  context.dataComponents.map((item, id) => {
                      return (
                          <li onClick={() => handlerUpdate(item)} className="cursor-pointer flex items-center gap-2 hover:bg-secondary py-1 px-2 transition-all duration-300 ease-in-out rounded-md" key={id}>
                              <Image src={`/images${item.image}`} alt={item.image} width={40} height={40}/>
                              <div>
                                  <h1 className="text-sm font-semibold capitalize">{props.lang(item.type)}</h1>
                                  <p className="text-xs text-zinc-500">{props.lang(`${item.type}2`)}</p>
                              </div>
                          </li>
                      )
                  })
              }
          </ul>
      </div>
      <h1 id={`property-${props.property.index}`} className="editable-text text-base text-zinc-500 dark:text-zinc-300" role={"textbox"} onKeyDown={e => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeCommand")} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
    </div>
  )
}
