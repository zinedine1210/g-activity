import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../../context/MyProvider";
import TipTapTask from "../ModalTask/TipTapTask";

export default function DescriptionTask(props) {
    const [open, setOpen] = useState(false)
    const dropRef = useRef(null)
    const context = useContext(MyContext)
    const {item} = props

    const handlerEnter = value => {
        item.description = value
    }

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false)
        }
    };


    useEffect(() => {
        if(!item.hasOwnProperty("description")){
            item.description = ""
            context.setDataDocumentation(context.dataDocumentation)
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

  return (
    <div ref={dropRef}>
        {
            open ?
            <TipTapTask value={item.description} style="text-base px-5 py-3" handlerEnter={value => handlerEnter(value)}/>
            :
            item.description == "<p></p>" || item.description == "" ?
            <button className="text-start w-full block bg-zinc-100 text-sm rounded-md pt-2 pb-4 px-3" onClick={() => setOpen(true)}>Add more detailed description</button>
            :
            <button className="ProseMirror w-full block text-start" onClick={() => setOpen(true)} dangerouslySetInnerHTML={{__html:item.description}}></button>
        }
    </div>
  )
}
