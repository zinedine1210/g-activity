import React, { useEffect, useRef, useState } from 'react'
import { BsCaretDown } from 'react-icons/bs';

export default function SelectInput({
    name, 
    options=[],
    label,
    value,
    change,
    defaultAll=false,
    isDisabled=false,
    prefix,
    suffix
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState("")
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleDropdownClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const findValue = () => {
        if(value && options){
            return options.find(res => res.value === value)?.label
        }
        return null
    }

    const handleChangeOption = value => {
        change(value, name)
        setKeyword("")
        setIsOpen(false)
    }

    const handleOpen = () => !isDisabled ? setIsOpen(!isOpen) : false

    const active = !value ? defaultAll ? "All" : "Select Options" : findValue(); // cek jika value kosong dan value bernilai All
    // console.log(value)
  return (
    <div className='relative' ref={dropdownRef}>
        {
            label && <label htmlFor={name} className='block font-semibold mb-2'>{label}</label>
        }
        
        <div onClick={() => handleOpen()} className="cursor-pointer w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white flex items-center justify-between">
            <h1>{prefix} {active} {suffix}</h1>
            <BsCaretDown className={`${isOpen && "rotate-180"} duration-300 ease-in-out`}/>
        </div>

        <div className={`${isOpen ? "visible scale-100":"invisible scale-0"} z-20 ease-in-out duration-300 origin-top-left absolute top-full right-0 w-full shadow-md rounded-md bg-white dark:bg-dark dark:border-2 dark:border-white/20 overflow-hidden hover:overflow-auto max-h-52`}>
            {/* <p className="text-xs py-2 border-b px-2 font-bold text-cText dark:text-white">{label}</p> */}
            <div className="p-1">
                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" placeholder="Search by label" className="placeholder:text-sm transition-all duration-300 focus:bg-white w-full py-1 px-3 text-sm outline-none bg-blue-100 hover:bg-blue-200 border hover:border-blue-500 " />
            </div>
            <div className="overflow-hidden">
                {
                    defaultAll && (
                        <button onClick={() => handleChangeOption("All")} className={`${value == "All" ? "bg-blue-400":""} duration-300 text-start py-1 px-2 hover:bg-blue-100 dark:hover:bg-dark2 text-sm w-full `}>All</button>
                    )
                }
                {
                    options ? options.length > 0 ? options.filter(res => {
                        if(!res.label.toLowerCase().includes(keyword.toLowerCase())){
                            return false
                        }
                        return res
                    }).map((item, key) => {
                        return (
                            <button type="button" key={key} className={`${item.value == value ? "bg-blue-400":""} duration-300 text-start py-1 px-2 hover:bg-blue-100 dark:hover:bg-dark2 text-sm w-full `} onClick={() => handleChangeOption(item.value)}>
                                {prefix} {item.label} {suffix}
                            </button>
                        )
                    })
                    :
                    <div className="w-full py-5">
                        <h1 className="text-blue-500 text-sm text-center">Data Not Available</h1>
                    </div>
                    :
                    new Array(5).fill("coba").map((item, load) => {
                        return (
                            <div key={load} className="w-full bg-zinc-300 animate-pulse h-16">

                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
    // <div className="my-2">
    //     <div>
    //         <div className="flex items-center justify-between relative">
    //             <input type="search" onChange={(e) => handlerKeyword(e.target.value)} placeholder="Filter by name" className="dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-sm py-2 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary peer w-1/2" />
    //             <div className="top-full bg-white rounded-b-xl dark:bg-dark max-h-80 overflow-y-scroll absolute left-0 shadow-lg  w-full md:w-1/2 hover:visible peer-focus:visible invisible">
    //                 <h1 className="text-sm text-zinc-400 mb-2 p-2">Sharing Suggestions</h1>
    //                 {
    //                     dataMemberKeyword ?
    //                     dataMemberKeyword.data.data.length > 0 ?
    //                     dataMemberKeyword.data.data.filter(res => {
    //                         function getOption(){
    //                             const find = data.find(opt => {
    //                                 return opt.id == res.id
    //                             })

    //                             const member = props.members.find(opt => {
    //                                 return opt.uid == res.id
    //                             })
    //                             let result = true

    //                             if(find || member){
    //                                 result = false
    //                             }
    //                             return result
    //                         }

    //                         const mantap = getOption()
                            
    //                         if(mantap){
    //                             return res
    //                         }
    //                     }).map((item, key) => {
    //                         return (
    //                             <button key={key} onClick={() => handlerAddEmail(item)} className="outline-none disabled:bg-zinc-200 focus:bg-blue-100 hover:bg-blue-100 p-2 w-full text-start flex items-center gap-2 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary">
    //                                 <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
    //                                     {item.username.charAt(0)}
    //                                 </span>
    //                                 <div className="text-start">
    //                                     <h1 className="font-bold text-sm">{item.username}</h1>
    //                                     <p className="text-xs text-zinc-500">{item.email}</p>
    //                                 </div>
    //                             </button>
    //                         )
    //                     })
    //                     :
    //                     <div className="text-center font-bold text-red-500 p-5">
    //                         <h1>Not Available</h1>
    //                     </div>
    //                     :
    //                     <div className="text-center font-bold p-5">
    //                         <div className="bg-blue-200 mx-auto w-8 h-8 rounded-full animate-pulse">

    //                         </div>
    //                     </div>
    //                 }
    //             </div>

    //             {
    //                 loading ?
    //                 <button disabled className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-all duration-300">
    //                     <div role="status" className="w-full py-2">
    //                         <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    //                             <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    //                         </svg>
    //                         <span className="sr-only">Loading...</span>
    //                     </div>
    //                 </button>
    //                 :
    //                 <button onClick={(e) => handlerSubmitEmail(e)} disabled={data.length > 0 ? false:true} className="disabled:bg-zinc-500 disabled:hover:bg-zinc-600 py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-all duration-300">
    //                     <h1>Share</h1>
    //                 </button>
    //             }
    //         </div>
    //         <div className="my-2 max-h-56 overflow-y-scroll">
    //         {
    //             data.length > 0 ? data.map((item, key) => {
    //                 return (
    //                     <div key={key} className="flex items-center justify-between hover:bg-blue-50 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary group">
    //                         <div className="w-full flex items-center gap-3 py-2 px-2">
    //                             <span className="w-10 h-10 rounded-full bg-black text-white font-bold uppercase flex items-center justify-center text-xl">
    //                                 {item.username.charAt(0)}
    //                             </span>
    //                             <div className="text-start">
    //                                 <h1 className="font-bold text-sm">{item.username}</h1>
    //                                 <p className="text-xs text-zinc-500">{item.email}</p>
    //                             </div>
    //                         </div>
    //                         <button className="p-2 group-hover:visible invisible" onClick={() => handlerDeleteEmail(item)}>
    //                             <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    //                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    //                             </svg>
    //                         </button>
    //                     </div>
    //                 )
    //             })
    //             :
    //             <div className="text-center font-bold text-red-500 pt-2">
    //                 <h1>Not Available</h1>
    //             </div>
    //         }
    //         </div>
    //     </div>
    // </div>
  )
}
