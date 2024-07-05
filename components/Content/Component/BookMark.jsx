import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import CardBookMark from "./CardBookMark";
import { MyContext } from "../../../context/MyProvider"
import Swal from "sweetalert2";

export default function BookMark(props) {
  const context = useContext(MyContext)
  const {property} = props
  const [active, setActive] = useState(true)
  const [embed, setEmbed] = useState(null)
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

  const handlerEmbed = e => {
    e.preventDefault()
    setActive(false)
    
    property.link = embed
  }

  const handlerDeleteEmbed = () => {
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
        property.link = null
        context.setDataDocumentation(context.dataDocumentation)
      }
    })
  }

  return (
    <>
    {
      property.link ?
      <CardBookMark embed={property.link} handlerDeleteEmbed={() => handlerDeleteEmbed()}/>
      :
      <button ref={dropRef} onClick={() => setActive(true)} className="button-close relative bg-zinc-300 dark:bg-darkPrimary rounded-md border-2 border-dashed border-zinc-400 text-center py-2 block w-full">
        <div className="flex items-center justify-center gap-2">
            <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            <h1 className="font-semibold text-sm text-zinc-500 cursor-pointer">{props.lang("addWebsite")}</h1>
        </div>

        <div className={`${active ? "block":"hidden"} z-20 absolute top-full right-1/2 transform translate-x-1/2 transition-all bg-white dark:bg-darkPrimary  rounded-md shadow-lg w-96 p-2 text-start`}>
            <form className="p-2" onSubmit={e => handlerEmbed(e)}>
              <input id={`property-${props.property.index}`} type="url" className="w-full outline-none border rounded-md p-2 text-sm" placeholder={props.lang("pasteBookmark")} onChange={(e) => setEmbed(e.target.value)} />
              <button type="submit" className="bg-zinc-200 dark:bg-darkSecondary transition-all duration-300 py-1 px-2 text-sm my-3 block mx-auto hover:bg-zinc-300">{props.lang("createBookmark")}</button>
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-200 text-center">{props.lang("descBookmark")}</p>
            </form>
        </div>
      </button>
    }
    </>
  )
}
