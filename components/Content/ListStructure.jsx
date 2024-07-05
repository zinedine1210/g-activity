import { useContext } from "react"
import { MyContext } from "../../context/MyProvider"

export default function ListStructure() {
    const context = useContext(MyContext)

  return (
    <ul className="border-l-2 pl-5 h-full min-h-[20px] border-zinc-300 text-sm font-light text-zinc-600 dark:text-zinc-300 space-y-2 w-full md:w-1/5">
        {
            context.active ? context.active.content.filter(res => {
                return res.id == 4 || res.id == 5 || res.id == 6
            }).map((item, key) => {
                return <li className="first-letter:uppercase" key={key} dangerouslySetInnerHTML={{__html:item.text}}></li>   
            }) :""
        }
    </ul>
  )
}
