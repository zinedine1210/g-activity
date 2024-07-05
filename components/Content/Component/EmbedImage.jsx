import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MyContext } from "../../../context/MyProvider";

export default function EmbedImage(props) {
  const context = useContext(MyContext)
  const {property} = props
  const [active, setActive] = useState(true)
  const [embed, setEmbed] = useState(null)
  const [tab, setTab] = useState(1)
  const dropRef = useRef(null)

  const handleOutsideClick = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
          setActive(false);
      }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
      };
  }, []);
  
  const handlerDrop = e => {
    e.preventDefault()
    setActive(false)
    const files = e.dataTransfer.files;
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image()
      img.src = e.target.result
      property.result = e.target.result

      img.onload = function(){
        property.width = img.width
        property.height = img.height
      }
      context.setDataDocumentation(context.dataDocumentation)
    }
    reader.readAsDataURL(file);
  }

  const handlerChange = e => {
    e.preventDefault()
    setActive(false)
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image()
      img.src = e.target.result
      property.result = e.target.result

      img.onload = function(){
        property.width = img.width
        property.height = img.height
      }
      context.setDataDocumentation(context.dataDocumentation)
    }
    reader.readAsDataURL(file);
  }

  const handlerEmbed = e => {
    e.preventDefault()
    setActive(false)
    const img = new Image()
    img.src = embed
    property.result = embed
    
    img.onload = function(){
      property.width = img.width
      property.height = img.height
    }
  }

  const handlerDimensi = (e) => {
    if(e.target.value > 200){
      const data = (e.target.value * property.height) / property.width
      property.width = e.target.value
      property.height = data.toFixed(2)
      context.setDataDocumentation(context.dataDocumentation)
    }else{
      e.target.value = property.width
      return Swal.fire("Image to small")
    }
  }

  const handlerAlign = (value) => {
    console.log(property);
    property.align = value
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handlerDelete = () => {
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
        property.result = null
        property.width = null
        property.height = null
    
        context.setDataDocumentation(context.dataDocumentation)
      }
    })
  }

  return (
    <>
    {
      property.result ?
      <div ref={dropRef} className="flex items-center justify-center relative group">
        <button onClick={() => setActive(true)} className="button-close group-hover:opacity-100 opacity-0 group-hover:visible invisible absolute top-0 right-0 bg-zinc-300 transition-all duration-300 w-7 h-7 flex items-center justify-center rounded-full">
          <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
        <div className={`bg-white dark:bg-darkPrimary rounded-md z-20 shadow-lg p-2 absolute top-0 right-0 w-64 ${active ? "block":"hidden hover:block"}`}>
          <ul className="space-y-1">
            <li className="border-b font-semibold text-zinc-500 dark:text-zinc-300 pb-1 text-sm">{props.lang("imageAlign")}</li>
            <li className="grid grid-cols-3">
              <button onClick={() => handlerAlign("mr-auto")} className="w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300">
                {props.lang("left")}
              </button>
              <button onClick={() => handlerAlign("mx-auto")} className="w-full py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 text-center">
                {props.lang("center")}
              </button>
              <button onClick={() => handlerAlign("ml-auto")} className="w-full text-end py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300">
                {props.lang("right")}
              </button>
            </li>
            <li className="border-b dark:text-zinc-300 pb-1 pt-2">
              <h1 className="font-semibold text-zinc-500 text-sm">{props.lang("dimentation")} (px)</h1>
              <p className="font-light text-zinc-500 text-xs">{props.lang("minimalWidth")} 200px</p>
            </li>
            <li className="grid grid-cols-2 gap-1">
              <input type="number" defaultValue={property.width} className="w-full outline-none border rounded-md p-2 text-sm" placeholder="Width" onBlur={(e) => handlerDimensi(e)} />
              <input type="number" defaultValue={property.height} disabled className="w-full outline-none border rounded-md p-2 text-sm" placeholder="Height" />
            </li>
            <li className="text-red-500">
              <button onClick={() => handlerDelete()} className="w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 flex items-center gap-2">
              <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              {props.lang("cancel")}
              </button>
            </li>
          </ul>
        </div>

        <div className={`${property.align}`}>
          <img width={property.width} height={property.height} src={property.result} alt="gambar" />
        </div>
      </div>
      :
      <button onClick={() => setActive(true)} className="button-close relative bg-zinc-300 dark:bg-darkPrimary rounded-md border-2 border-dashed border-zinc-400 text-center py-2 block w-full" ref={dropRef} onDrop={(e) => handlerDrop(e)}>
        <div className="flex items-center justify-center gap-2">
            <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h1 className="font-semibold text-sm text-zinc-500 cursor-pointer">{props.lang("dropImage")}</h1>
        </div>

        <div className={`${active ? "block":"hidden"} z-20 absolute top-full right-1/2 transform translate-x-1/2 transition-all bg-white dark:bg-darkPrimary rounded-md shadow-lg  w-96 p-2 text-start`}>
          <div className="grid grid-cols-3 gap-2 border-b pb-1">
            <button onClick={() => setTab(1)} className={`${tab == 1 ? "bg-zinc-200 dark:bg-dark":"hover:bg-zinc-200 hover:dark:bg-dark"} rounded-md transition-all duration-300 text-sm py-1`}>Upload</button>
            <button onClick={() => setTab(2)} className={`${tab == 2 ? "bg-zinc-200 dark:bg-dark":"hover:bg-zinc-200 hover:dark:bg-dark"} rounded-md transition-all duration-300 text-sm py-1`}>Embed Link</button>
            <button onClick={() => setTab(3)} className={`${tab == 3 ? "bg-zinc-200 dark:bg-dark":"hover:bg-zinc-200 hover:dark:bg-dark"} rounded-md transition-all duration-300 text-sm py-1`}>Unsplash</button>
          </div>
          {
            tab == 1?
            <div className="p-2">
              <input type="file" onChange={(e) => handlerChange(e)} className="hidden" id="file" />
              <label htmlFor="file" className="border rounded-md hover:bg-zinc-100 hover:dark:bg-dark cursor-pointer text-sm text-center w-full py-1 block">{props.lang("selectImage")}</label>
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-200 text-center">{props.lang("maximumFile")} 5 MB</p>
            </div>
            :""
          }
          {
            tab == 2?
            <form className="p-2" onSubmit={e => handlerEmbed(e)}>
              <input type="url" className="w-full outline-none border rounded-md p-2 text-sm" placeholder={props.lang("pasteImage")} onChange={(e) => setEmbed(e.target.value)} />
              <button type="submit" className="bg-zinc-200 dark:bg-darkSecondary transition-all duration-300 py-1 px-2 text-sm my-3 block mx-auto hover:bg-zinc-300">{props.lang("embedImage")}</button>
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-200 text-center">{props.lang("descEmbedImage")}</p>
            </form>
            :""
          }
          {
            tab == 3?
            <div className="p-2">
              <h1 className="text-center">Coming Soon</h1>
            </div>
            :""
          }
        </div>
      </button>
    }
    </>
  )
}
