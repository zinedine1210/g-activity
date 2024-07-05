import Pre_BulletedList from "./Pre_BulletedList"
import Pre_CardBookMark from "./Pre_CardBookMark"
import Pre_Copy from "./Pre_Copy"
import Pre_Header from "./Pre_Header"
import Pre_NumberingList from "./Pre_NumberingList"
import Pre_Quote from "./Pre_Quote"
import Pre_Tip from "./Pre_Tip"

export default function Pre_Type(props) {
    const {comp, device} = props
    
  return (
    <div>
        {
            comp.id == 1 ?
            <h1 className={`font-extrabold mb-5 ${device == 1 ?"text-5xl":device == 2 ? "text-4xl":"text-3xl"}`}>{comp.text ? comp.text:"Untitled"}</h1>
            :""
        }
        {
            comp.id == 2 ?
            comp.text ?
            <p className={"text-base text-zinc-700 first-letter:uppercase dark:text-zinc-300 mb-1"} dangerouslySetInnerHTML={{__html:comp.text}}/>
            :
            <p className="py-4"></p>
            :""
        }
        {
            comp.id == 0 ?
            comp.text ?
            <p className={"text-base text-zinc-700 first-letter:uppercase dark:text-zinc-300 mb-1"} dangerouslySetInnerHTML={{__html:comp.text}}/>
            :
            <p className="py-4"></p>
            :""
        }
        {
            comp.id == 3 ?
            <Pre_Tip property={comp} device={device}/>
            :""
        }
        {
            comp.id == 4 || comp.id == 5 || comp.id == 6 ?
            <Pre_Header property={comp} device={device}/>
            :""
        }
        {
            comp.id == 7 ?
            <Pre_Copy property={comp} device={device}/>
            :""
        }
        {
            comp.id == 8 ?
            <Pre_Quote property={comp} device={device}/>
            :""
        }
        {
            comp.id == 9 ?
            <div className="h-7 w-full flex items-center justify-center">
                <span className="block bg-zinc-400 w-full h-0.5"></span>
            </div>
            :""
        }
        {
            comp.id == 11 ?
            <Pre_BulletedList property={comp} device={device}/>
            :""
        }
        {
            comp.id == 12 ?
            <Pre_NumberingList property={comp} device={device}/>
            :""
        }
        {
            comp.id == 13?
            comp.result ?
            <div className="mb-2">
                <img src={comp.result} alt="gambar" height={comp.height} width={comp.width} className={comp.align} />
            </div>
            :""
            :""
        }
        {
            comp.id == 14?
            comp.link?
            <Pre_CardBookMark property={comp} device={device}/>
            :""
            :""
        }
        {
            comp.id == 15?
            comp.result?
            <div>
                <iframe width={device != 1 ? "100%":comp.width} className={comp.align} height={device != 1 ? "100%":comp.height} src={comp.result} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            :""
            :""
        }
        </div>
  )
}
