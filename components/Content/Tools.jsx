import { useContext } from "react"
import { MyContext } from "../../context/MyProvider"

export default function Tools({lang}) {
  const context = useContext(MyContext)

  const handlerLocked = () => {
    context.active.lock = !context.active.lock
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handlerListStruktur = () => {
    context.active.subHeader = !context.active.subHeader
    context.setDataDocumentation(context.dataDocumentation)
  }

  const handlerDevice = (item) => {
    context.active.device = item
    context.active.lock = true
    context.setDataDocumentation(context.dataDocumentation)
  }

  if(context.active){
    return (
    <div className={`${context.active ? "block":"hidden"} contain w-full py-5 px-3 md:px-5`}>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
                {/* LOCKED */}
                <button className={`flex items-center gap-2 text-zinc-500 dark:text-zinc-200 font-semibold text-sm`} onClick={() => handlerLocked()}>
                    {
                        context.active.lock ?
                        <svg fill="none" stroke="currentColor" className="w-7 h-7 stroke-zinc-700 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        :
                        <svg fill="none" stroke="currentColor" className="w-7 h-7 stroke-zinc-700 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    }
                </button>

                {/* DEVICE */}
                <div className="flex items-center gap-2">
                    {/* KOMPUTER */}
                    <button className={`lg:block hidden`} onClick={() => handlerDevice(1)}>
                        <svg fill="none" stroke="currentColor" className={`${context.active.device == 1 ? "stroke-blue-800":""} w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                        </svg>
                    </button>

                    {/* TABLET */}
                    <button className={`hidden md:block`} onClick={() => handlerDevice(2)}>
                        <svg fill="none" stroke="currentColor" className={`${context.active.device == 2 ? "stroke-blue-800":""} w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </button>

                    {/* HANDPHONE */}
                    <button onClick={() => handlerDevice(3)}>
                        <svg fill="none" stroke="currentColor" className={`${context.active.device == 3 ? "stroke-blue-800":""} w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-5">
                <h1 className="font-semibold text-zinc-500 dark:text-zinc-300 border-r-2 border-zinc-500 pr-3">{context.active.device == 1 ? "Desktop": context.active.device == 2 ? "Tablet":"Mobile"}</h1>
                <p className="text-zinc-500 dark:text-zinc-300"><span className="font-bold">W:</span> {context.active.device == 1 ? "Auto":context.active.device == 2 ?"600px":"400px"}</p>
                <p className="text-zinc-500 dark:text-zinc-300"><span className="font-bold">H:</span> {context.active.device == 1 ? "Auto":context.active.device == 2 ?"1024px":"720px"}</p>
            </div>

            <button className="w-6 h-6 md:hidden rounded-full hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
                <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
            <div className="hidden md:flex items-center gap-5">
                {/* <h1 className="text-sm text-zinc-500 dark:text-zinc-300">{lang("lastEdit")} 15m</h1> */}

                {/* <button>
                    <svg fill="none" stroke="currentColor" className="inline-block w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                </button>

                <button>
                    <svg fill="none" stroke="currentColor" className="inline-block w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                </button>

                <button>
                    <svg fill="none" stroke="currentColor" className="inline-block w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                <button>
                    <svg fill="none" stroke="currentColor" className="inline-block w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </button> */}
                <button onClick={() => handlerListStruktur()}>
                    <svg fill="none" stroke="currentColor" className="inline-block w-5 h-5 transition-all duration-300 ease-in-out hover:stroke-blue-500 stroke-zinc-500 dark:stroke-zinc-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    )
  }
}
