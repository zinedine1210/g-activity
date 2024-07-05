import { useContext, useEffect } from "react"
import { MyContext } from "../../context/MyProvider"
import Type from "./Type";
import { findIndex } from "lodash";
import Group from "./Group";
import BreadCrumb from "./BreadCrumb";
import Preview from "./Preview/Preview";
import ListStructure from "./ListStructure";
import Swal from "sweetalert2";

export default function Main({lang}) {
    const context = useContext(MyContext)
    let content = context.active ? context.active.content : null
    console.log(content);
    

    const handleDragStart = (e, item) => {
      e.dataTransfer.setData('application/json', JSON.stringify(item));
    };
  
    const handleDrop = (e, data, type) => {
      e.preventDefault()
      e.target.classList.remove("drag-hover")
  
      if(type != "components"){
        return false
      }
      const dragged = JSON.parse(e.dataTransfer.getData("application/json"))
      const dataCopy = [...context.active.content]
      const dropIndex = findIndex(dataCopy, {index:data.index})
      
      if(dragged.hasOwnProperty("index")){
        const draggedIndex = findIndex(dataCopy, {index:dragged.index})
  
        let obj = dataCopy.splice(draggedIndex, 1, dataCopy[dropIndex])
        dataCopy.splice(dropIndex, 1, obj[0])
        
        context.active.content = []
        dataCopy.forEach((val,key) => {
          val.index = key + 1
          context.active.content.push(val)
        })
    
        context.setDataDocumentation(context.dataDocumentation)
      }else{
        handlerAddSection(dragged, dataCopy[dropIndex])
      }
    };

    const handlerAddGrid = (value, property) => {
      const newValue = JSON.parse(JSON.stringify(value))
      const getIndex = findIndex(content, {index:property.index})
      
      let obj = {
        index:property.index,
        cols:[
          {
            index:`${property.index}-1`,
            rows:[property]
          },
          {
            index:`${property.index}-2`,
            rows:[newValue]
          }
        ]
      }

      obj.cols.forEach((val , key) => {
        val.rows[0].index = `${val.index}-1`
      });
      
      content.splice(getIndex, 1, obj)
      context.active.content = content
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDuplicate = (value) => {
      content.splice(value.index - 1, 0, value)

      const dataFinal = JSON.stringify(content)
      content = []

      JSON.parse(dataFinal).forEach((val, idx) => {
        val.index = idx + 1
        content.push(val)
      })

      context.active.content = content
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerAddSection = async (item, from) => {
      content.splice(from.index, 0, item)
      const dataFinal = JSON.stringify(content)
      content = []
      JSON.parse(dataFinal).forEach((val, idx) => {
        val.index = idx + 1
        content.push(val)
      })

      context.active.content = content
      await context.setDataDocumentation(context.dataDocumentation)

      document.getElementById(`property-${from.index + 1}`).focus()
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
          const dataFinal = JSON.stringify(content.filter(res => {
            return res.index != value.index
          }))
          
          content = []
          JSON.parse(dataFinal).forEach((val, idx) => {
            val.index = idx + 1
            content.push(val)
          })
          context.active.content = content
          context.setDataDocumentation(context.dataDocumentation)
    
          document.getElementById(`property-${value.index}`).focus()
        }
      })
    }

    const handlerUpdateComponent = (item, from) => {
      content.splice(from.index - 1, 1, item)
      const dataFinal = JSON.stringify(content)
      content = []
      JSON.parse(dataFinal).forEach((val, idx) => {
        val.index = idx + 1
        content.push(val)
      })
      context.active.content = content
      context.setDataDocumentation(context.dataDocumentation)
    }

    const pengaturanNumber = (value) => {
      let result = null
      
      if(content[value.index - 2].hasOwnProperty("number")){
        if(content[value.index - 2].tab == value.tab){
          result = content[value.index - 2].number + 1
        }else{
          if(value.tab > content[value.index - 2].tab){
            result = 1
          }else{
            const numberlist = content.filter(res => {
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
        if(content[value.index - 2].hasOwnProperty("tab")){
          if(content[value.index - 2].tab == value.tab){
            result = 1
          }else{
            if(value.tab > content[value.index - 2].tab){
              result = 1
            }else{
              const numberlist = content.filter(res => {
                return res.tab == value.tab
              })
              const findIndex = _.findIndex(numberlist, {index:value.index})
              if(numberlist[findIndex - 1]){
                if(numberlist[findIndex - 1].hasOwnProperty("number")){
                  result = numberlist[findIndex - 1].number + 1
                }else{
                  result = 1
                }
              }
            }
          }
        }else{
          result = 1
        }
      }

      return result
    }
    

    if(context.active){
      return (
        <section className={`block w-full md:contain px-3 md:px-20 py-5`}>
          <BreadCrumb />
            <section className="block md:flex gap-5">
              <div className={`w-full ${context.subHeader ? "md:w-4/5":""}`}>
                {
                  context.active.lock ?
                  <Preview lang={lang}/>
                  :
                  content ? content.map((item, key) => {
                    return (
                      <>
                      {
                        item.hasOwnProperty("cols") ?
                          <Group lang={lang} item={item} handlerUpdateComponent={(item, from) => handlerUpdateComponent(item, from)} handlerDelete={(value) => handlerDelete(value)} handlerAddSection={(value, from) => handlerAddSection(value, from)} handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, item, type) => handleDrop(e, item, type)}/>
                        :
                        <div className="relative group">
                          <Type lang={lang} pengaturanNumber={(property) => pengaturanNumber(property)} key={key} handlerUpdateComponent={(item, from) => handlerUpdateComponent(item, from)} itemLength={content.length} handlerDelete={(value) => handlerDelete(value)} handlerAddGrid={(value, property) => handlerAddGrid(value, property)} property={item} handlerDuplicate={(value) => handlerDuplicate(value)}  handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, item, type) => handleDrop(e, item, type)} handlerAddSection={(value, from) => handlerAddSection(value, from)}/>
                        </div>
                      }
                      </>
                    )
                  })
                  :"Tidak ada"
                }
              </div>
              {
                context.active.subHeader ?
                  <ListStructure />
                :""
              }
            </section>
        </section>
      )
    }
}
