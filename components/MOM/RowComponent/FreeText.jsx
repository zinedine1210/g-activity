import { useContext } from "react"
import { MyContext } from "../../../context/MyProvider"
import TipTapMOM from "../TipTapMOM"

export default function FreeText({data}) {
    const context = useContext(MyContext)

    const handlerEnter = (value) => {
        data.result = value
        context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div>
      <TipTapMOM value={data.result} style={`py-2 px-1`} handlerEnter={value => handlerEnter(value)}/>
    </div>
  )
}
