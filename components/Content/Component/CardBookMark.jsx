import { useEffect, useState } from "react";
import useSWR from "swr"

const fetcher = async (url) => {
    const json = await fetch(url).then(res => res.json())
    return json
}

export default function CardBookMark({embed, handlerDeleteEmbed}) {
    const { data, error, isLoading } = useSWR(`https://jsonlink.io/api/extract?url=${embed}`, fetcher)
    const [active, setActive] = useState(false)

    useEffect(() => {
        document.body.addEventListener("click", handleClick)
        return () => {
            document.body.removeEventListener("click", handleClick)
        }
    }, [])
  
    function handleClick(event) {
        if(!event.target.closest('.button-close')){
          setActive(false)
        }
    }

    if(error){
        return (
            <div className="flex items-center justify-center w-full py-10">
                <h1>Web Not Found</h1>
            </div>
        )
    }
    if(isLoading){
        return <div className="text-center font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-300">Searching...</div>
    }

    if(data){
        return (
            <div className="w-full bg-white dark:bg-darkPrimary shadow-md rounded-md flex h-full min-h-24 overflow-y-scroll relative group">
                <button onClick={() => setActive(true)} className="button-close absolute top-0 right-0 shadow-md group-hover:opacity-100 opacity-0 group-hover:visible invisible bg-zinc-300 transition-all duration-300 w-7 h-7 flex items-center justify-center rounded-full">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
                <div className={`bg-white dark:bg-dark rounded-md shadow-lg p-2 absolute top-0 right-0 w-64 z-20 ${active ? "block":"hidden"}`}>
                <ul className="space-y-1">
                    <li className="text-red-500">
                    <button onClick={() => handlerDeleteEmbed()} className="w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 flex items-center gap-2">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Cancel
                    </button>
                    </li>
                </ul>
                </div>
                <div className="w-3/4 p-3 relative">
                    <h1 className="font-semibold text-lg">{data.title ? data.title : <span className="text-red-500">Not found</span>}</h1>
                    <p className="font-light text-base text-zinc-500 dark:text-zinc-300">{data.description ? data.description.length > 100 ? data.description.substring(0, 100)+"...":data.description:<span className="text-red-500">Not found</span>}</p>
                    <a href={data.url} target={"_blank"} className="font-light text-sm text-zinc-500 dark:text-zinc-300 hover:text-primary transition-all duration-300 mt-3 inline-block">{data.url ? data.url.length > 100 ? data.url.substring(0, 100)+"...":data.url:<span className="text-red-500">Not found</span>}</a>
                </div>
                {
                    data.images.length > 0 ?
                        <div className="w-1/4 bg-origin-content bg-center" style={{backgroundImage:`url(${data.images[0]})`}}>
                        </div>
                    :""
                }
            </div>
        )
    }
}
