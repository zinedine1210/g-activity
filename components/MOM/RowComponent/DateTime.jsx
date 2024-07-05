import { useContext } from "react"
import { MyContext } from "../../../context/MyProvider"
import { getValue } from "../../../utils/function"

export default function DateTime({data}) {
    const context = useContext(MyContext)

    const handlerChange = (e) => {
      const value = new Date(e.target.value).getTime()
      const result = value / 1000
      const format = Number(result.toFixed(3))
      data.target_date = {
        epoch_time:format
      }
      context.setDataDocumentation(context.dataDocumentation)
    }

  return (
    <div>
        <input type="date" value={data.target_date ? getValue(data.target_date.epoch_time * 1000):null} className={`bg-inherit outline-none focus:outline-2 focus:outline-blue-500 rounded-md px-2 py-1`} onChange={e => handlerChange(e)} />
    </div>
  )
}
