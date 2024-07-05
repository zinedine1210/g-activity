import { useContext, useEffect, useRef, useState } from 'react'
import { FaCheck, FaTags } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { MyContext } from '../../../context/MyProvider'

function InputLabel({item, setA, a}){
    const menuRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [color, setColor] = useState(null)
    const [data, setData] = useState(null)


    const handleOutsideClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpen(false);
        }
    };

    const handlerAdd = e => {
        if(e.key == "Enter"){
            if(!data || !color){
                return Swal.fire("Invalid, You must fill in the color and label name")
            }
            let obj = {
                id:item.label.length + 1,
                value:data,
                color:color
            }

            item.label.push(obj)
            handleOutsideClick(e)
            setA(!a)
        }
    }

    const colors = ['#fde047', '#a7f3d0', '#f87171', '#67e8f9', '#86efac', '#a1a1aa', '#bef264', '#7dd3fc', '#a78bfa', '#818cf8', '#fb7185', '#e879f9']

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [open, color]);


    return (
        <div className='relative' ref={menuRef}>
            <input type="text" className='outline-none' onChange={e => setData(e.target.value)} placeholder='Add another label' onFocus={() => setOpen(true)} onKeyUp={e => handlerAdd(e)} />
            <div className={`${open ? "block":"hidden"} absolute bg-white rounded-md shadow-md w-80 p-3`}>
                <div className='grid grid-cols-6 gap-2'>
                    {
                        colors.map((item, key) => {
                            return (
                                <button key={key} onKeyDown={e => handlerAdd(e)} style={{backgroundColor:item}} className={`text-white font-bold w-full h-7 rounded-md flex items-center justify-center`} onClick={() => setColor(item)}>{color == item ? <FaCheck />:""}</button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default function LabelTask({item}) {
    const [a, setA] = useState(false)
    const context = useContext(MyContext)

    useEffect(() => {
        if(!item.hasOwnProperty("label")){
            item.label = []
            context.setDataDocumentation(context.dataDocumentation)
        }
    }, [])

    const handlerDeleteLabel = (id) => {
        const data = item.label.filter(res => {
            return res.id != id
        })
        console.log(item);
        item.label = data
        setA(!a)
    }

  return (
    <div className='mt-5'> 
        <h1 className="flex items-center gap-3 font-bold text-sm text-zinc-500 dark:text-zinc-300"><FaTags /> Labels</h1>
        <div className="flex items-center gap-2 flex-wrap mt-2">
            {
                item.hasOwnProperty("label") ? item.label.map((label, key) => {
                    return (
                        <div key={key} style={{backgroundColor:label.color}} className={`p-2 rounded-md shadow-md font-bold text-sm flex items-center gap-2`}>
                            {label.value}
                            <button onClick={() => handlerDeleteLabel(label.id)}>
                                <svg fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4 stroke-zinc-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )
                })
                :""
            }
            <InputLabel item={item} setA={e => setA(e)} a={a}/>
        </div>
    </div>
  )
}

