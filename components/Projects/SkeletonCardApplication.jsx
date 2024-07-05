export default function SkeletonCardApplication() {
  return (
    <div className="w-full relative shadow-lg h-36 group bg-zinc-50 dark:bg-dark">
        <div className="overflow-hidden relative w-full h-full p-2 rounded-lg">
            <div className="w-6 bg-gradient-to-b z-10 animate-pulse from-zinc-600 via-zinc-600 to-zinc-800 group-hover:from-zinc-500 group-hover:via-zinc-500 group-hover:to-zinc-700 h-full absolute top-0 left-0 bg-black">
            </div>
            <div className="h-full">
                <div className="relative">
                    <div className="flex items-center gap-1">
                        <span className="bg-zinc-400 flex items-center w-10 h-10 rounded-md justify-center text-lg font-extrabold text-white z-10 font-mono animate-pulse"></span>
                        <div>
                            <h1 className="font-bold text-sm w-20 rounded-md h-2 bg-zinc-200 animate-pulse mb-1"></h1>
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 w-32 animate-pulse bg-zinc-200 h-5"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 pl-8 border-t w-full pr-2 py-1 flex items-center justify-between">
                <h1 className="text-xs text-zinc-500 dark:text-zinc-300 w-10 rounded-md bg-zinc-100 animate-pulse"></h1>
                <button className={`bg-zinc-200 h-4 w-10 animate-pulse`}></button>
            </div>
        </div>
    </div>
  )
}
