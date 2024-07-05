import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import { getTimeAgo, getTimeDate } from "../../utils/function";

export default function TimeMOM() {
  const context = useContext(MyContext)
  const data = context.dataDocumentation
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)
  const [open2, setOpen2] = useState(false)
  const dropRef2 = useRef(null)

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
    if (dropRef2.current && !dropRef2.current.contains(event.target)) {
        setOpen2(false);
    }
  };

  const handlerChangeDate = (value, target) => {
    const timeInput = value.split(":")
    const now = new Date()
    now.setHours(timeInput[0])
    now.setMinutes(timeInput[1])
    const result = now.getTime() / 1000
    const format = Number(result.toFixed(3))

    data[target] = {
      epoch_time:format
    }
    data.end_time_type = -1
    context.setDataDocumentation(context.dataDocumentation)
    setOpen(false)
    setOpen2(false)
  }

  const handlerFinish = () => {
    data.end_time = null
    data.end_time_type = 1
    context.setDataDocumentation(context.dataDocumentation)
    setOpen(false)
    setOpen2(false)
  }

  return (
    <div className="flex items-center gap-2 mt-10">
        <h1 className="font-semibold w-1/5">Waktu</h1>
        <div className="flex items-center w-4/5">
            <span className="font-bold text-xl mr-2">:</span>
            
            <div className="flex items-center gap-1">
                <div ref={dropRef}>
                    <button onClick={() => setOpen(true)} className={`${open ? "hidden":""} hover:bg-zinc-100 rounded-md px-2 transition-all duration-300`}>
                    {data.start_time ? getTimeDate(data.start_time.epoch_time * 1000)+" WIB" : "Input Start"}
                    </button>
                    <input type="time" id="start" className={`${open ? "":"hidden"} outline-none text-base bg-zinc-200 transition-all duration-300 px-2 rounded-md`} value={data.start_time ? getTimeDate(data.start_time.epoch_time * 1000):null} onChange={e => handlerChangeDate(e.target.value, "start_time")} />
                </div>
                <h1 className="font-bold text-xl">~</h1>
                <div ref={dropRef2}>
                    <button onClick={() => setOpen2(true)} className={`${open2 ? "hidden":""} hover:bg-zinc-100 text-base rounded-md px-2 transition-all duration-300`}>
                    {data.end_time_type == 1 ? "Selesai": data.end_time ? getTimeDate(data.end_time.epoch_time * 1000)+" WIB" : "Input End"}
                    </button>
                    {
                      open2 ?
                      <div className="flex items-center">
                        <input type="time" id="end" className={`outline-none text-base bg-zinc-200 transition-all duration-300 px-2 rounded-md`} value={data.end_time ? getTimeDate(data.end_time.epoch_time * 1000):null} onChange={e => handlerChangeDate(e.target.value, "end_time")} />
                        <button className={`bg-zinc-100 rounded-md py-1 text-sm px-2 ml-2 font-semibold hover:bg-zinc-200 transition-all duration-300`} onClick={(e) => handlerFinish()}>Sampai Selesai</button>
                      </div>
                      :""
                    }
                    
                </div>
            </div>
        </div>
    </div>
  )
}
