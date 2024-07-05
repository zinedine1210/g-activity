import Image from "next/image"
import { useContext, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { MyContext } from "../../context/MyProvider"
import Type from "./Type"

export default function Group(props) {
    const {item, lang} = props
    const context = useContext(MyContext)
    const [add, setAdd] = useState(false)
    const addRef = useRef(null)

    const handleOutsideClick = (event) => {
        if (addRef.current && !addRef.current.contains(event.target)) {
            setAdd(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerAddGrid = (value, property) => {
        const newValue = JSON.parse(JSON.stringify(value))
        let obj = property
        newValue.index = property.cols.length + 1
        obj.cols.push(newValue)

        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerAddSection = (value, from) => {
        const newValue = JSON.parse(JSON.stringify(value))
        let obj = null
        const dataID = from.index.split("-")
        
        obj = context.active.content[dataID[0] - 1].cols[dataID[1] - 1]
        obj.rows.splice(dataID[2], 0, newValue)
        const dataFinal = JSON.stringify(obj.rows)

        obj.rows = []
        const akhir = dataID.slice(0, dataID.length - 1).join("-")
        JSON.parse(dataFinal).forEach((val, key) => {
            val.index = `${akhir}-${key+1}`
            obj.rows.push(val)
        });
        context.setDataDocumentation(context.dataDocumentation)
    }
  
    const handlerDelete = (value) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          const dataID = value.index.split("-")
          const dataFinal = JSON.stringify(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.filter(res => {
            return res.index != value.index
          }))
          
          context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows = []
          const akhir = dataID.slice(0, dataID.length - 1).join("-")
          JSON.parse(dataFinal).forEach((val, idx) => {
            val.index = `${akhir}-${idx+1}`
            context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.push(val)
          })
    
          context.setDataDocumentation(context.dataDocumentation)
        }
      })
    }

    const handlerDuplicate = (value) => {
      const dataID = value.index.split("-")
      context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.splice(dataID[2] - 1, 0, value)

      const dataFinal = JSON.stringify(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows)
      context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows = []
      const akhir = dataID.slice(0, dataID.length - 1).join("-")
      JSON.parse(dataFinal).forEach((val, idx) => {
        val.index = `${akhir}-${idx+1}`
        context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.push(val)
      })
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerUpdateComponent = (value, from) => {
      const dataID = from.index.split("-")
      console.log(context.active.content[dataID[0] - 1].cols[dataID[1] - 1]);
      context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.splice(dataID[2] - 1, 1, value)
      const dataFinal = JSON.stringify(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows)
      context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows = []
      const akhir = dataID.slice(0, dataID.length - 1).join("-")
      JSON.parse(dataFinal).forEach((val, idx) => {
        val.index = `${akhir}-${idx+1}`
        context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.push(val)
      })
      context.setDataDocumentation(context.dataDocumentation)
    }


    const handleDragStart = (e, item) => {
      e.dataTransfer.setData('json', JSON.stringify(item));
    };
  
    const handleDrop = (e, data, type) => {
      e.preventDefault()
      e.target.classList.remove("drag-hover")
  
      if(type != "components"){
        return false
      }

      const dragged = JSON.parse(e.dataTransfer.getData("json"))
      
      const dataID = data.index.split("-")
      const dataParent = dataID.slice(0, dataID.length - 1).join("-")

      const draggedID = dragged.index.split("-")
      const draggedParent = draggedID.slice(0, draggedID.length - 1).join("-")
      // jika tidak sama
      if(draggedParent != dataParent){
        context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.splice(dataID[2], 0, dragged)
        handlerDelete(dragged)
        const dataFinal = JSON.parse(JSON.stringify(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows))
        context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows = []
        dataFinal.forEach((val, key) => {
          val.index = `${dataParent}-${key+1}`
          context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.push(val)
        })
      }else{
        let obj = context.active.content[draggedID[0] - 1].cols[draggedID[1] - 1].rows.splice(draggedID[2] - 1, 1, data)
        context.active.content[draggedID[0] - 1].cols[draggedID[1] - 1].rows.splice(dataID[2] - 1, 1, obj[0])
        const dataFinal = JSON.parse(JSON.stringify(context.active.content[draggedID[0] - 1].cols[draggedID[1] - 1].rows))

        
        context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows = []
        dataFinal.forEach((val, key) => {
          val.index = `${dataParent}-${key+1}`
          context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.push(val)
        })
      }

      // context.setDataDocumentation(context.dataDocumentation)
    };

    const handlerDragOver = (e) => {
      e.preventDefault()
      if(e.target.classList.contains("dragable")){
          e.target.classList.add("drag-hover")
      }
    }
    
    const handlerDragLeave = (e) => {
      e.preventDefault()
      if(e.target.classList.contains("dragable")){
          e.target.classList.remove("drag-hover")
      }
    }

    const pengaturanNumber = (value) => {
      let result = null
      
      const dataID = value.index.split("-")
      if(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2]){
        if(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].hasOwnProperty("number")){
          // jika atasnya nomer maka:
          if(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].tab == value.tab){
            result = context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].number + 1
          }else{
            if(value.tab > context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].tab){
              result = 1
            }else{
              const numberlist = context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.filter(res => {
                return res.tab == value.tab
              })
              const findIndex = _.findIndex(numberlist, {index:value.index})
              if(numberlist[findIndex - 1].hasOwnProperty("number")){
                result = numberlist[findIndex - 1].number + 1
              }else{
                result = 1
              }
            }
          }
        }else{
          // jika bukan nomer maka:
          if(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].hasOwnProperty("tab")){
            // jika memiliki property tab maka:
            if(context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].tab == value.tab){
              // jika memiliki tab yang sama
              result = 1
            }else{
              // jika tidak sama maka:
              if(value.tab > context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows[dataID[2] - 2].tab){
                // jika tabnya lebih besar dari atasnya maka:
                result = 1
              }else{
                // jika tabnya lebih kecil maka:
                const numberlist = context.active.content[dataID[0] - 1].cols[dataID[1] - 1].rows.filter(res => {
                  return res.tab == value.tab
                })
                const findIndex = _.findIndex(numberlist, {index:value.index})
                // jika ini bukan paling atas maka:
                if(numberlist[findIndex - 1]){
                  if(numberlist[findIndex - 1].hasOwnProperty("number")){
                    result = numberlist[findIndex - 1].number + 1
                  }else{
                    result = 1
                  }
                }else{
                  result = 1
                }
              }
            }
          }else{
            result = 1
          }
        }
      }else{
        result = 1
      }

      return result
    }

  return (
    <div ref={addRef} draggable onDragStart={(e) => props.handleDragStart(e, item)} onDragOver={(e) => handlerDragOver(e)} onDragLeave={e => handlerDragLeave(e)} onDrop={(e) => props.handleDrop(e, item, "components")} className={`dragable grid gap-2 grid-cols-${item.cols.length} group relative hover:border-2 transition-all border-primary dark:border-blue-500 border-opacity-20 border-dashed rounded-md p-2`}>
        <button onClick={() => setAdd(!add)} className="button-close absolute -top-2 -left-2 shadow-md w-5 h-5 rounded-full bg-white dark:bg-darkPrimary flex items-center justify-center group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-all duration-300">
            <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
        </button>

        <button onClick={() => props.handlerDelete(item)} className="absolute -top-2 -right-2 shadow-md w-5 h-5 bg-white dark:bg-darkPrimary rounded-full text-red-600 flex items-center justify-center group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-all duration-300">
            <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
        </button>
        {
            item.cols.map((col, idx) => {
            return (
                <div className="rounded-md hover:border-2 border-yellow-500 transition-all border-opacity-40 border-dashed p-2">
                {
                    col.hasOwnProperty("rows") ? col.rows.map((row, key) => {
                        return (
                            <Type lang={lang} key={key} handlerUpdateComponent={(item, from) => handlerUpdateComponent(item, from)} pengaturanNumber={(value) => pengaturanNumber(value)} cols={true} handlerDelete={(value) => handlerDelete(value)} handlerAddGrid={(value, property) => handlerAddGrid(value, property)} property={row} handlerDuplicate={(value) => handlerDuplicate(value)} handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, item, type) => handleDrop(e, item, type)} handlerAddSection={(value, from) => handlerAddSection(value, from)}/>
                        )
                    }):
                    <Type lang={lang} key={idx} cols={true} handlerUpdateComponent={(item, from) => handlerUpdateComponent(item, from)} pengaturanNumber={(value) => pengaturanNumber(value)} handlerDelete={(value) => handlerDelete(value)} handlerAddGrid={(value, property) => handlerAddGrid(value, property)} property={col} handlerDuplicate={(value) => handlerDuplicate(value)} handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, item, type) => handleDrop(e, item, type)} handlerAddSection={(value, from) => handlerAddSection(value, from)}/>
                }
                {/* <div className={`${grid ? "block absolute top-0 right-0":"hidden"} bg-white dark:bg-darkPrimary p-3 w-64 rounded-md shadow-md overflow-y-scroll max-h-96 z-20`}>
                    <ul className="space-y-2">
                        {
                            context.dataComponents.map((comp, id) => {
                                return (
                                    <li onClick={() => handlerAddGrid(comp, item)} className="cursor-pointer flex items-center gap-2 hover:bg-secondary py-1 px-2 transition-all duration-300 ease-in-out rounded-md" key={id}>
                                      <Image src={`/images${comp.image}`} alt={comp.image} width={40} height={40}/>
                                        <div>
                                            <h1 className="text-sm font-semibold capitalize">{comp.type}</h1>
                                            <p className="text-xs text-zinc-500">{comp.description}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div> */}


                <div className={`${add ? "block absolute top-0 left-0":"hidden"} bg-white dark:bg-darkPrimary p-3 w-64 rounded-md shadow-md overflow-y-scroll max-h-96 z-20`}>
                    <ul className="space-y-2">
                        {
                            context.dataComponents.map((comp, id) => {
                                return (
                                    <li onClick={() => props.handlerAddSection(comp, item)} className="cursor-pointer flex items-center gap-2 hover:bg-secondary py-1 px-2 transition-all duration-300 ease-in-out rounded-md" key={id}>
                                        <Image src={`/images${comp.image}`} alt={comp.image} width={40} height={40}/>
                                        <div>
                                            <h1 className="text-sm font-semibold capitalize">{lang(comp.type)}</h1>
                                            <p className="text-xs text-zinc-500">{lang(`${comp.type}2`)}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                {/* <button onClick={() => setGrid(!grid)} className={`${item.cols.length > 1 ? "hidden":"block"} button-close bg-white dark:bg-darkPrimary rounded-full shadow-md absolute top-1/2 cursor-pointer z-20 -right-0 transform -translate-y-1/2 translate-x-1/2 hover:opacity-100 invisible hover:visible group-hover:visible group-hover:opacity-100 opacity-0 transition-all duration-300 delay-100`}>
                    <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button> */}
              </div>
            )
            })
        }
        </div>
  )
}
