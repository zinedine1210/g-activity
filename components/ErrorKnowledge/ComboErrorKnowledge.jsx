import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/MyProvider";

export default function ComboErrorKnowledge({value, option, handlerChange, title}) {
    const dropRef = useRef(null)
    const context = useContext(MyContext)
    const [open, setOpen] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const find = option.find(res => {
        return res.value == value
    })

  return (
    <div ref={dropRef} className="relative">
        <button className="text-xs font-semibold bg-blue-500 px-2 py-1 rounded-md text-white capitalize" style={{backgroundColor:find.color}} onClick={() => setOpen(!open)}>{find.value}</button>

        <div className={`${open ? "":"hidden"} z-20 absolute bg-white rounded-md shadow-lg overflow-hidden w-24`}>
            <h1 className="font-bold text-xs p-2 border-b">{title}</h1>
            {
                option.map((opt, key) => {
                    return (
                        <button key={key} onClick={() => {handlerChange(opt.value); setOpen(false)}} className="py-2 px-2 text-sm hover:bg-blue-100 transition-all duration-300 capitalize w-full text-start">{opt.value}</button>
                    )
                })
            }
        </div>
    </div>
  )
}
