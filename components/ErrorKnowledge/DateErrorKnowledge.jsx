import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import { getLocaleTimeDate } from "../../utils/function";

export default function DateErrorKnowledge({title, value, handlerChange}) {
    const context = useContext(MyContext)
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
    }
  };

  const handlerChangeDate = e => {
    const getLocale = getLocaleTimeDate(e.target.value)
    let obj = {
        date:e.target.value,
        dateLocale:getLocale
    }
    handlerChange(obj)
  }

  return (
    <div ref={dropRef}>
        <button onClick={() => setOpen(true)} className={`${open ? "hidden":""} hover:bg-zinc-100 py-1 rounded-md px-2 transition-all duration-300`}>
            {value.dateLocale ? value.dateLocale : "Click Here"}
        </button>
        <input type="date" id="momdate" className={`${open ? "":"hidden"} py-1 outline-none text-base bg-zinc-200 transition-all duration-300 px-2 rounded-md`} value={value.date} onChange={e => handlerChangeDate(e)} />
    </div>
  )
}
