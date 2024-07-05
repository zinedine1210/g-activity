export default function Forum() {
  return (
    <div className="py-10">
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-xl font-bold">Forum Sushimoo</h1>
            <button className="bg-primary rounded-lg px-2 py-1 text-white font-semibold">New Conversation</button>
        </div>

        <div className="w-full flex gap-5">
            <div className="w-1/5 space-y-2">
                <div className="w-full bg-zinc-100 rounded-md p-3 shadow-md relative group">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 group-hover:scale-75 transition-all duration-300 absolute top-1/2 right-2 -translate-y-1/2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <h1 className="font-semibold">Testing</h1>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Feb 12</p>
                </div>
            </div>
            <div className="w-4/5 border-2 border-blue-400 rounded-lg h-full p-5">
                <div className="flex justify-between border-b pb-4">
                    <div>
                    <h1 className="font-bold text-2xl">Testing</h1>
                    <p className="font-semibold text-zinc-600 dark:text-zinc-300 text-sm">General</p>
                    </div>
                    <div className="flex gap-2 items-center">
                    <button className="flex items-center gap-1 font-bold hover:bg-zinc-200 p-1">
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        1
                    </button>
                    <button className="hover:bg-zinc-200 p-1">
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    </div>
                </div>
                <div>
                    <textarea placeholder="" className="text-sm py-2 w-full mt-3 px-5 outline-none border-2 hover:bg-zinc-100 focus:bg-white focus:border-primary" />
                    <div className="flex items-center justify-between mt-1">
                        <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>

                        <button className="bg-blue-500 rounded-md py-1 px-2 text-white text-sm font-semibold">
                            Comments
                        </button>
                    </div>

                    <ul className="mt-5">
                        <li className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                            <div className="flex gap-2">
                                <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center relative">Zz <span className="bg-green-500 w-3 h-3 rounded-full absolute -bottom-0 right-0"></span></span>
                                <div className="w-full">
                                    <h1 className="font-semibold text-sm">Zinedine Ziddan Fahdlevy</h1>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-xs">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum veritatis odio distinctio tenetur optio nobis, debitis nisi pariatur, rem quo accusamus odit! Necessitatibus delectus suscipit rerum minima magni accusamus quam!</p>
                                </div>
                            </div>
                        </li>
                        <li className="w-full flex items-center justify-between gap-2 py-3 relative border-b">
                            <div className="flex gap-2">
                                <span className="w-12 h-12 bg-black rounded-full flex items-center text-white font-bold justify-center relative">Ms<span className="bg-green-500 w-3 h-3 rounded-full absolute -bottom-0 right-0"></span></span>
                                <div className="w-full">
                                    <h1 className="font-semibold text-sm">Maruba Simangunsong</h1>
                                    <p className="text-zinc-600 dark:text-zinc-300 text-xs">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum veritatis odio distinctio tenetur optio nobis, debitis</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
  )
}
