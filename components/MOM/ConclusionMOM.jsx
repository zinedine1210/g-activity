import { useContext } from "react"
import { MyContext } from "../../context/MyProvider"
import TipTapMOM from "./TipTapMOM"

export default function ConclusionMOM() {
    const context = useContext(MyContext)

    const data = context.dataDocumentation

    const handlerEnter = (value) => {
        data.conclusion = value
        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div className="pb-10">
        <h2 className="text-lg font-medium text-zinc-800 dark:text-white mb-2">Conclusion</h2>
        <div className="hover:bg-zinc-100 transition-all duration-300">
          <TipTapMOM value={data.conclusion} style={`py-2 px-1`} handlerEnter={value => handlerEnter(value)}/>
        </div>
    </div>
  )
}
