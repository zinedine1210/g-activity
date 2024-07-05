import { useContext } from "react"
import { FaCaretDown, FaPlus, FaTasks, FaTrash } from "react-icons/fa"
import { MyContext, urlData } from "../../context/MyProvider"
import { handlerAddRecord, handlerDeleteRecord, handlerPutRecord } from "../../utils/repositories"
import DateTime from "./RowComponent/DateTime"
import FreeText from "./RowComponent/FreeText"
import Mention from "./RowComponent/Mention"
import MomRepository from "../../repositories/MomRepository"

export default function RecordMOM({record}) {
    const context = useContext(MyContext)

    const handlerAdd = async () => {
        // setLoading(true)
        let obj = {
            mom_id:record.mom_id,
            result:"",
            target_date:new Date(),
            pic:[],
            state_by:[],
            pos:record.pos + 1
        }
        
        const result = await MomRepository.postPoint({xa:JSON.parse(localStorage.getItem("XA")), data:obj})
        console.log(result);
        if(result.data.type == "success"){
            context.dataDocumentation.record.splice(record.pos, 0, result.data.data)
            context.dataDocumentation.record.slice(record.pos + 1).forEach((item, key) => {
                item.pos = (record.pos + 1) + key + 1
                return item
            })
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handlerDelete = async () => {
        const result = await MomRepository.deletePoint({xa:JSON.parse(localStorage.getItem("XA")), id:record.id})
        console.log(result);
        if(result.data.type == "success"){
            const cache = context.dataDocumentation.record.filter(res => {
                return res.id != record.id
            })
            context.dataDocumentation.record = cache
            context.dataDocumentation.record.forEach((val, key) => {
                val.pos = key + 1
                return val
            });
            
            context.setDataDocumentation(context.dataDocumentation)
        }
    }

    const handleDrop = async (e, dropStatus) => {
        e.stopPropagation()
        e.preventDefault()

        const urutanNow = record.urutan
    
        const dragStatus = JSON.parse(e.dataTransfer.getData("json"))
        document.getElementById(`record-${dropStatus.id}`).classList.remove("bg-green-200")
        document.getElementById(`record-${dropStatus.id}`).classList.remove("bg-red-50")
        
        context.dataDocumentation.record[dropStatus.urutan - 1].urutan = dragStatus.urutan
        dropStatus.urutan = dragStatus.urutan
        await handlerPutRecord(dropStatus)
        
        
        context.dataDocumentation.record[dragStatus.urutan - 1].urutan = urutanNow
        dragStatus.urutan = urutanNow
        await handlerPutRecord(dragStatus)

        context.dataDocumentation.record.sort((a, b) => {
            return a.urutan - b.urutan
        })
        context.setDataDocumentation(context.dataDocumentation)
      }
    
      const handleDragStart = (e, value) => {
        e.stopPropagation()
        context.setData({...context, activeDrag:"record"})
        e.dataTransfer.setData('json', JSON.stringify(value))
      }
    
      const handlerDragOver = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const dropzone = document.getElementById(`record-${record.id}`)
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove("bg-green-200")
            dropzone.classList.remove("bg-red-50")
        }
        else {
            if(context.activeDrag == "record"){
                dropzone.classList.add("bg-green-200")
            }else{
                dropzone.classList.add("bg-red-50")
            }
        }
      }
      
      const handlerDragLeave = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const dropzone = document.getElementById(`record-${record.id}`)
          if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove("bg-green-200")
            dropzone.classList.remove("bg-red-50")
          }
          else {
              if(context.activeDrag == "record"){
                  dropzone.classList.add("bg-green-200")
              }else{
                  dropzone.classList.add("bg-red-50")
              }
          }
      }
     

    
  return (
        <tr id={`record-${record.id}`} className="group hover:bg-blue-50 focus:bg-blue-50" draggable onDragEnter={e => handlerDragOver(e)} onDragLeave={e => handlerDragLeave(e)} onDragStart={(e) => handleDragStart(e, record)} onDrop={(e) => handleDrop(e, record)}>
            <td className="absolute hover:visible hover:opacity-100 bg-white rounded-md shadow-md p-1 -left-12 z-20 group-hover:visible invisible mx-1 border opacity-0 group-hover:opacity-100 transition-all duration-300 w-fit space-y-1 delay-100">
                <button onClick={() => handlerAdd()} className="hover:bg-blue-100 p-2 text-start block w-full rounded-md"><FaPlus className="text-zinc-500 dark:text-zinc-300 text-sm"/></button>
                <button onClick={() => handlerDelete()} className="hover:bg-blue-100 p-2 text-start block w-full rounded-md"><FaTrash className="text-red-500 dark:text-red-300 text-sm"/></button>
            </td>
            <td className="relative border-r text-center p-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                <h1 className="font-bold text-xl">{record.pos}.</h1>
            </td>
            
            <td className="relative border-r p-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                <FreeText data={record}/>
            </td>
            <td className="relative border-r p-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                <DateTime data={record}/>
            </td>
            <td className="relative border-r p-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                <Mention data={record.pic} record={record}/>
            </td>
            <td className="relative border-r p-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                <Mention data={record.state_by} record={record}/>
            </td>
        </tr>
  )
}
