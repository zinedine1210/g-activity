import { FaDotCircle } from "react-icons/fa"
import { getTimeAgo, getTimeDate } from "../../../utils/function"

export default function CardComments(props) {
    const {item} = props
  return (
    <div className="flex gap-3 border-b pb-2">
        <span className="flex items-center justify-center text-white bg-red-500 w-10 h-10 rounded-full shadow-md font-bold uppercase">{item._cb_docs.username.charAt(0)}</span>
        <div>
          <div className="flex items-center gap-2 mb-2">
              <h1 className="text-sm"><span className="font-bold">{item._cb_docs.username}</span> added a <span className="font-bold bg-zinc-300 py-0.5 px-2 rounded-md text-xs uppercase">Comment</span></h1>
              <FaDotCircle className="w-2 h-2 text-zinc-500"/>
              <span className="text-xs text-zinc-500">{getTimeAgo(item._cd.epoch_time * 1000)} - {getTimeDate(item._cd.epoch_time * 1000)}</span>
          </div>
          <p className="ProseMirror" dangerouslySetInnerHTML={{__html:item.content}}/>
        </div>
    </div>
  )
}
