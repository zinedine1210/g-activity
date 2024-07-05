import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import { findIndex } from "lodash";
import DocumentationRepository from "../../repositories/DocumentationRepository";
import Swal from "sweetalert2";

export default function ListPage(props) {
  const {item, lang} = props
  const [hide, setHide] = useState(props.defaultHide)
  const context = useContext(MyContext)
  
  const handlerDeletePage = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newArr = item.child.filter(res => {
          return res.id != id
        })

        const findData = item.child.find(res => {
          return res.id == id
        })

        let arr = []
        async function getIdData(array){
          arr.push(array.id)
          if(array.hasOwnProperty("child")){
            array.child.forEach(val => {
              if(val.hasOwnProperty("child")){
                getIdData(val)
              }else{
                arr.push(val.id)
              }
            });
          }
        }
        
        await getIdData(findData)
        console.log(arr);
        
        const result = await DocumentationRepository.deletePageDocumentation({data:arr, xa:JSON.parse(localStorage.getItem("XA"))})
        console.log(result);
        if(result.data.type == "success"){
          item.child = newArr
          context.setDataDocumentation(context.dataDocumentation)
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again or refresh the page'
          })
        }
      }
    })
  }

  const handlerAddPage = async () => {
    let obj = {
      document_id:context.dataDocumentation.id,
      device:1,
      title:"",
      pid:item.id,
      content:[
        {
          id:1,
          index:1,
          type:"title",
          text:null
        },
        {
          id:0,
          index:2,
          type:"text",
          text:null
        }
      ]
    }
    console.log(item);
    const result = await DocumentationRepository.postPageDocumentation({xa:JSON.parse(localStorage.getItem("XA")), data:obj})
    console.log(result);
    if(result.data.type == "success"){
      if(item.hasOwnProperty("child")){
        item.child.unshift(result.data.data)
      }else{
        item.child = []
        item.child.unshift(result.data.data)
      }
      context.setDataDocumentation(context.dataDocumentation)
    }
    return result.data.data
  }


  const handlerChange = (value) => {
    item.title = value
    context.setDataDocumentation(context.dataDocumentation)
  }
  

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };


  const handleDrop = (e, data, type) => {
    e.preventDefault()

    if(type != "pages"){
      return false
    }
    
    const dragged = JSON.parse(e.dataTransfer.getData("application/json"))
    const dataCopy = [...item.child]
    const dropIndex = findIndex(dataCopy, {id:data.id})
    
    // cek apakah data yang didrag terdapat di array jika tidak ada maka akan dicombine seddangkan jika ada akan dimove saja
    const find = dataCopy.find(res => {
      return res.id == dragged.id
    })

    if(find){
      const draggedIndex = findIndex(dataCopy, {id:dragged.id})
      let obj = dataCopy.splice(draggedIndex, 1, dataCopy[dropIndex])
      dataCopy.splice(dropIndex, 1, obj[0])
    }else{
      // cek apakah data yang didrag adalah child dari drop
      const findChild = dataCopy[dropIndex].child.find(res => {
        return res.id == dragged.id
      })
      if(!findChild){
        // menyesuaikan id nya dengan parent
        dragged['id'] = `${dataCopy[dropIndex].id}-${dragged['id'].split("-").slice(1)}`
        dataCopy[dropIndex].child.push(dragged)
      }
    }
    
    item.child = []
    dataCopy.forEach(val => {
      item.child.push(val)
    })

    context.setDataDocumentation(context.dataDocumentation)
  };

  const handlerActive = async (value) => {
    context.setData({...context, active:null, breadcrumb:null})
    let obj = []
    JSON.parse(JSON.stringify(context.dataDocumentation.pages)).forEach((val) => {
        if(val.hasOwnProperty("child")){
            const child = val.child
            delete val.child
            child.forEach(val2 => {
                obj.push(val2)
            })
        }
        obj.push(val)
    });

    let bread = []
    function getTree(value){
      if(value.pid == "ortu"){
        bread.push(value)
      }else{
        bread.push(value)
        obj.forEach(val => {
          if(val.id == value.pid){
            getTree(val)
          }
        })
      }
    }

    if(!value.hasOwnProperty("content")){
      const result = await DocumentationRepository.getPageDocumentationByID({xa:JSON.parse(localStorage.getItem("XA")), id:value.id})
      value.content = result.data.content
      context.setDataDocumentation(context.dataDocumentation)
    }
    
    getTree(value)

    await context.setData({...context, active:value, breadcrumb:bread})
  }

  const handlerKey = async (e) => {
    if(e.key == "Enter"){
      e.preventDefault()
      props.handlerAddPage(null)
    }
  }

  return (
    <>
    <li className="block" draggable onDragStart={(e) => props.handleDragStart(e, item)} onDrop={(e) => props.handleDrop(e, item, 'pages')} onDragOver={(e) => e.preventDefault()}>
      <div onClick={() => handlerActive(item)} className="flex items-center gap-2 cursor-pointer justify-between transition-all rounded-md hover:dark:bg-darkSecondary hover:bg-blue-200 p-1 duration-300 ease-in-out group">
          <div className="flex items-center gap-2">
              {
                  item.hasOwnProperty("child") ? 
                  <button onClick={() => setHide(!hide)} className={`hover:bg-blue-100 w-5 h-5 flex items-center justify-center rounded-md`}><svg className={`w-3 h-3 stroke-zinc-600 dark:stroke-zinc-300 transition-all duration-300 ${hide ? "":"rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                  :
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md`}>
                    <svg className="w-2 h-3 stroke-zinc-600 dark:stroke-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                  </div>
              }
              <div className="block">
                <h1 id={`page-${item.pid}-${item.id}`} className="editable-text text-sm text-zinc-500 dark:text-zinc-300" role={"textbox"} onKeyDown={e => handlerKey(e)} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML)} maxLength={10} autoFocus={true} contentEditable data-placeholder={lang("typeHere")} dangerouslySetInnerHTML={{__html:item.title}}></h1>
              </div>
          </div>
          <div className="hidden group-hover:flex items-center justify-center gap-1 z-20">
              <button onClick={() => handlerAddPage(item.id)} className="hover:bg-blue-100 hover:dark:bg-dark w-5 h-5 flex items-center justify-center rounded-md transition-all"><svg className="w-4 h-4 stroke-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>
              <button onClick={() => props.handlerDeletePage(item.id)} className="hover:bg-blue-100 hover:dark:bg-dark w-5 h-5 flex items-center justify-center rounded-md transition-all"><svg className="w-2 h-3 stroke-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg></button>
          </div>
      </div>
    </li>
    <ul className={`ml-3 ${hide ? "hidden":"block"}`}>
      {
        item.hasOwnProperty("child") ? item.child.map((item2, idx2) => {
          return (
            <ListPage item={item2} key={idx2} lang={lang} defaultHide={true} handlerAddPage={() => handlerAddPage(props.idx + 1)} idx={idx2} handlerDeletePage={(e) => handlerDeletePage(e)} handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, item, type) => handleDrop(e, item, type)}/>
          )
        })
        :""
      }
    </ul>
    </>
  )
}
