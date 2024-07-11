import { useContext, useEffect, useState } from "react"
import { MyContext } from "../../context/MyProvider"
import ListComponent from "../Pages/ListComponent"
import ListPage from "../Pages/ListPage"
import EditableText from "../Input/EditableText"
import _, { findIndex } from "lodash"
import DocumentationRepository from "../../repositories/DocumentationRepository"
import Swal from "sweetalert2"

async function getPage(context) {
  let arr = null

  if (!context.realDocumentation) {
    const result = await DocumentationRepository.getPageDocumentation({
      xa: JSON.parse(localStorage.getItem("XA")),
      id: context.dataDocumentation.id
    })
    arr = result.data
  } else {
    arr = context.realDocumentation
  }

  function buildTree(arr, parentId) {
    let tree = [];
    arr.forEach((val) => {
      if (val.pid === parentId) {
        let children = buildTree(arr, val.id);
        if (children.length) {
          val.child = children;
        }
        tree.push(val);
      }
    })

    return tree;
  }

  let finalData = buildTree(arr, 'ortu');
  return {
    finalData,
    result: arr
  }
}

export default function Sidebar({ lang }) {
  const [active, setActive] = useState(true)
  const context = useContext(MyContext)

  const dataDoc = context.dataDocumentation

  const getAllData = async () => {
    const dataReturn = await getPage(context)
    context.dataDocumentation.pages = dataReturn.finalData
    context.setDataDocumentation(context.dataDocumentation)
    context.setData({ ...context, realDocumentation: dataReturn.result })
  }


  useEffect(() => {
    if (!context.dataDocumentation.hasOwnProperty("pages") && context.dataDocumentation.pages == undefined) {
      getAllData()
    }
  }, [context.dataDocumentation])

  const handlerAddPage = async () => {
    const posNow = context?.realDocumentation.length + 1 ?? 1
    let obj = {
      document_id: context.dataDocumentation.id,
      device: 1,
      title: "Untitled",
      pid: "ortu",
      pos: posNow,
      content: [
        {
          id: 1,
          index: 1,
          type: "title",
          text: null
        },
        {
          id: 0,
          index: 2,
          type: "text",
          text: null
        }
      ]
    }

    const result = await DocumentationRepository.postPageDocumentation({ xa: JSON.parse(localStorage.getItem("XA")), data: obj })
  
    if (result.status == 0) {
      context.dataDocumentation.pages.unshift(result.data)
      context.setDataDocumentation(context.dataDocumentation)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again or refresh the page'
      })
    }

    return result.data
  }

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
        const newArr = context.dataDocumentation.pages.filter(res => {
          return res.id != id
        })

        const findData = context.dataDocumentation.pages.find(res => {
          return res.id == id
        })

        let arr = []
        async function getIdData(array) {
          arr.push(array.id)
          if (array.hasOwnProperty("child")) {
            array.child.forEach(val => {
              if (val.hasOwnProperty("child")) {
                getIdData(val)
              } else {
                arr.push(val.id)
              }
            });
          }
        }

        await getIdData(findData)
       
        const result = await DocumentationRepository.deletePageDocumentation({ data: arr, xa: JSON.parse(localStorage.getItem("XA")) })
        if (result.status == 0) {
          context.dataDocumentation.pages = newArr
          context.setDataDocumentation(context.dataDocumentation)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again or refresh the page'
          })
        }
      }
    })
  }

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDrop = async (e, item, type) => {
    e.preventDefault()

    if (type != "pages") {
      return false
    }

    const dragged = JSON.parse(e.dataTransfer.getData("application/json"))
    const dataCopy = [...context.dataDocumentation.pages]
    const dropIndex = findIndex(dataCopy, { id: item.id })

    // cek apakah data yang didrag terdapat di array jika tidak ada maka akan dicombine seddangkan jika ada akan dimove saja
    const find = dataCopy.find(res => {
      return res.id == dragged.id
    })
    const draggedIndex = findIndex(dataCopy, { id: dragged.id })

    if (find) {
      console.log("move");
      let obj = dataCopy.splice(draggedIndex, 1, dataCopy[dropIndex])
      dataCopy.splice(dropIndex, 1, obj[0])

    } else {
      console.log("combine");
      dragged.pid = dataCopy[dropIndex].id
      console.log(dragged);
      const result = await DocumentationRepository.putPageDocumentation({ xa: JSON.parse(localStorage.getItem("XA")), id: dragged.id, data: dragged })
      console.log(result);
      if (result.status == 0) {
        // hapus data diposisi awal
        dataCopy.splice(draggedIndex, 1)
        // cek apakah data yang didrag adalah child dari drop
        if (dataCopy[dropIndex].hasOwnProperty("child")) {
          const findChild = dataCopy[dropIndex].child.find(res => {
            return res.id == dragged.id
          })

          if (!findChild) {
            // menyesuaikan id nya dengan parent
            dataCopy[dropIndex].child.push(result.data)
            console.log("combine id parent");
          }
        } else {
          dataCopy[dropIndex].child = []
          dataCopy[dropIndex].child.push(result.data)
        }
      }
    }

    context.dataDocumentation.pages = []
    dataCopy.forEach((val, key) => {
      val.id = `${key}`
      context.dataDocumentation.pages.push(val)
    })

    console.log(dataCopy);
    context.setDataDocumentation(context.dataDocumentation)
  };

  const handlerChange = (value) => {
    context.dataDocumentation.name = value
    context.setDataDocumentation(context.dataDocumentation)
  }

  if (dataDoc)
    return (
      <>
        <button className={`peer bg-white dark:bg-darkPrimary hidden md:block fixed left-0 mt-20 p-2 ${active ? "sr-only" : "not-sr-only"}`} onClick={() => setActive(true)}>
          <svg className={`w-5 h-5 rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        </button>
        <div className={`shadow-md md:block p-3 z-30 bg-white dark:bg-darkPrimary transition-all duration-300 overflow-y-scroll ${active ? "h-screen pt-20 top-0 left-0 translate-x-0 opacity-100 relative md:w-2/12" : "fixed left-0 w-72 -translate-x-96 opacity-0 h-3/4 peer-hover:translate-x-0 peer-hover:opacity-100 peer-hover:duration-300 delay-300 hover:translate-x-0 hover:opacity-100 mt-20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center font-semibold text-sm bg-red-500 w-8 uppercase text-white h-8">{dataDoc.name ? dataDoc.name.charAt(0) : "-"}</span>
              <EditableText placeholder="Documentation Name" handlerChange={value => handlerChange(value)} value={dataDoc.name} text="base" />
            </div>
            <button onClick={() => setActive(!active)}>
              <svg className={`w-5 h-5 transition-all ${active ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            </button>
          </div>

          <div className="mt-5">
            <div className="justify-between flex group">
              <h1 className="text-base font-semibold text-zinc-600 dark:text-white">{lang("pages")}</h1>
              <button onClick={() => handlerAddPage(null)} className="opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out"><svg className="w-6 h-6 stroke-zinc-600 dark:stroke-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>
            </div>

            <ul className="mt-2">
              {
                dataDoc?.pages ? dataDoc.pages.map((item, idx) => {
                  return (
                    <ListPage lang={lang} handlerAddPage={(value) => handlerAddPage(value)} item={item} key={idx} defaultHide={false} idx={idx} handlerDeletePage={(e) => handlerDeletePage(e)} handleDragStart={(e, value) => handleDragStart(e, value)} handleDrop={(e, idx, type, item) => handleDrop(e, idx, type, item)} />
                  )
                })
                  :
                  new Array(5).fill("pages").map(() => {
                    return (
                      <div className="bg-zinc-100 w-full h-5 animate-pulse rounded-md mb-1"></div>
                    )
                  })
              }
            </ul>
          </div>

          <div className="mt-5">
            <div className="justify-between flex group">
              <h1 className="text-base font-semibold text-zinc-600 dark:text-white">{lang("components")}</h1>
            </div>

            <ul className="mt-2">
              {
                context.dataComponents.map((item, key) => {
                  return (
                    <ListComponent lang={lang} item={item} key={key} />
                  )
                })
              }
            </ul>
          </div>
        </div>
      </>
    )
}
