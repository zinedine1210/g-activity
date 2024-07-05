import { useContext } from "react"
import { MyContext } from "../../context/MyProvider"

export default function BreadCrumb() {
    const context = useContext(MyContext)
    
  return (
    <nav className="w-full text-zinc-600 dark:text-white pb-5">
        <ol className="flex h-8 space-x-2 items-center">
            <li className="flex items-center">
            <span title="Back to homepage" className="hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1 text-zinc-600 dark:text-white">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
            </span>
            </li>
            {
                context.breadcrumb ? context.breadcrumb.length > 0 ? 
                context.breadcrumb.map((bread, key) => {
                    return (
                        <li className="flex items-center space-x-2" key={key}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="w-2 h-2 mt-1 transform rotate-90 fill-current text-zinc-400">
                                <path d="M32 30.031h-32l16-28.061z"></path>
                            </svg>
                            <a rel="noopener noreferrer" href="#" className="flex items-center px-1 capitalize hover:underline">{bread.title ? bread.title: <span className="text-red-500">No Name</span>}</a>
                        </li>
                    )
                }):"":""
            }
        </ol>
    </nav>
  )
}
