import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import { getLocaleTimeDate, getValue } from "../../utils/function";

export default function DateMOM() {
  const context = useContext(MyContext)
  const data = context.dataDocumentation
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
    const value = new Date(e.target.value).getTime()
    const result = value / 1000
    const format = Number(result.toFixed(3))
    data.mom_date = {
      epoch_time:format
    }
    context.setDataDocumentation(context.dataDocumentation)
}

  return (
    <div className="flex items-center gap-2 mt-10">
        <h1 className="font-semibold w-1/5">Hari/Tanggal</h1>
        <div ref={dropRef} className="w-4/5">
            <span className="font-bold text-xl mr-2">:</span>
            <button onClick={() => setOpen(true)} className={`${open ? "hidden":""} hover:bg-zinc-100 rounded-md px-2 transition-all duration-300`}>
                {data.mom_date ? getLocaleTimeDate(data.mom_date.epoch_time * 1000) : "Click Here"}
            </button>
            <input type="date" id="momdate" className={`${open ? "":"hidden"} outline-none text-base bg-zinc-200 transition-all duration-300 px-2 rounded-md`} value={data.mom_date ? getValue(data.mom_date.epoch_time * 1000):null} onChange={e => handlerChangeDate(e)} />
        </div>
    </div>
  )
}
