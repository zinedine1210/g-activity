import { useContext, useEffect, useRef, useState } from "react";
import { FaCalendar, FaCaretDown, FaTextHeight, FaUser } from "react-icons/fa";
import { MyContext } from "../../../context/MyProvider";
import { generateId } from "../../../utils/function";
import { handlerAddRecord, handlerPutMOM, handlerPutRecord } from "../../../utils/repositories";

export default function RecordHeader({header}) {
    const dropRef = useRef(null)
    const [open, setOpen] = useState(null)
    const context = useContext(MyContext)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerChange = (value) => {
        header.name = value
    }

    const handlerAdd = async () => {
        const data = await handlerAddRecord(0, context.dataDocumentation)
        context.dataDocumentation.record.unshift(data) 
        const updateDataUrutan = context.dataDocumentation.record.slice(1)
        updateDataUrutan.forEach(async (val, key) => {
            val.urutan = key + 1 + 1
            await handlerPutRecord(val)
        });
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDelete = async () => {
        // update dengan menghapus header pada data mom
        const data = JSON.parse(JSON.stringify(context.dataDocumentation))
        const newHeader = data.header.filter(res => {
            return res.id != header.id
        })
        data.header = newHeader
        delete data.record
        
        context.dataDocumentation.header = data.header
        await handlerPutMOM(data)

        // update content mom point
        context.dataDocumentation.record.forEach(async (val) => {
            const newData = val.content.filter(res => {
                return res.headerID != header.id
            })

            val.content = newData
            await handlerPutRecord(val)
        });

        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerOpen = (e, type) => {
        setOpen(type)
        document.getElementById(`${type}-${header.id}`).style.top = e.target.getBoundingClientRect().top+"px"
        document.getElementById(`${type}-${header.id}`).style.left = e.target.getBoundingClientRect().left+"px"
    }

    const handlerAddColumn = async (type) => {
        let obj = {
            "name": null,
            "id": generateId(),
            "align": "start",
            "type": type
        }

        // add header
        const data = JSON.parse(JSON.stringify(context.dataDocumentation))
        data.header.push(obj)
        delete data.record
        await handlerPutMOM(data)
        context.dataDocumentation.header.push(obj)


        // update content mom point
        context.dataDocumentation.record.forEach(async (val, key) => {
            let content = {
                pointID:val.id,
                headerID:obj.id
            }
            if(type == "mention"){
                content.value = []
            }else{
                content.value = null
            }
            val.content.push(content)
            console.log(val);
            await handlerPutRecord(val)
        });

        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <th ref={dropRef} className={`${open ? "border-2 border-blue-500":""} group relative font-bold p-3 text-sm border-r text-left rtl:text-right text-zinc-500 dark:text-zinc-400`}>
        {/* <h1 className="editable-text text-zinc-500 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML)} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Type Header"}>{header.name}</h1> */}
        <h1 className="text-zinc-500 dark:text-zinc-300">{header.name}</h1>
        {/* <button className={`${open ? "rotate-180 visible":"group-hover:visible invisible"} absolute top-1 right-1 bg-blue-100`} onClick={(e) => handlerOpen(e, "row")}><FaCaretDown /></button>
        <div id={`row-${header.id}`} className={`${open == "row" ? "":"hidden"} bg-white fixed rounded-md w-fit py-1 shadow-md z-30`}>
            <button className="hover:bg-blue-100 p-2 text-start block w-full" onClick={() => handlerAdd()}>Insert Record</button>
            <button className="hover:bg-blue-100 p-2 text-start block w-full" onClick={(e) => handlerOpen(e, "insert")}>Insert Column</button>
            <button className="hover:bg-blue-100 p-2 text-start block w-full text-red-500" onClick={() => handlerDelete()}>Delete Column</button>
        </div> */}
        {/* <div id={`insert-${header.id}`} className={`${open == "insert" ? "":"hidden"} bg-white fixed rounded-md w-56 py-1 shadow-md z-30`}>
            <h1 className="text-zinc-500 dark:text-zinc-300 text-xs p-2 border-b">Choose Type Input</h1>
            <button className="hover:bg-blue-100 p-2 text-start w-full flex items-center gap-2" onClick={() => handlerAddColumn("mention")}><FaUser className="w-3 h-3"/> Metion Input</button>
            <button className="hover:bg-blue-100 p-2 text-start w-full flex items-center gap-2" onClick={() => handlerAddColumn("freeText")}><FaTextHeight className="w-3 h-3"/> Free Text</button>
            <button className="hover:bg-blue-100 p-2 text-start w-full flex items-center gap-2" onClick={() => handlerAddColumn("datetime")}><FaCalendar className="w-3 h-3"/> Date</button>
        </div> */}
    </th>
  )
}
