import { getTimeAgo, getTimeDate } from "../../../utils/function"

export default function CardAttachments(props) {
    const {item} = props

  return (
    <div className="flex gap-3">
        <span className="flex items-center justify-center text-white bg-red-500 w-10 h-10 rounded-full shadow-md font-bold uppercase">{item.email.charAt(0)}</span>
        <div>
            <div className="flex items-center gap-2">
                <h1 className="text-sm"><span className="font-bold">{item.email}</span> added an <span className="font-bold bg-zinc-300 py-0.5 px-2 rounded-md text-xs uppercase">Attachment</span></h1>
                <span className="text-xs text-zinc-500">{getTimeAgo(item.date)} {getTimeDate(item.date)}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
            {
                item.attachType == "image" ?
                <img src={item.value} alt="" className="max-w-[200px] w-full" />
                :
                <p>{item.value}</p>
            }
            </div>
        </div>
    </div>
  )
}
