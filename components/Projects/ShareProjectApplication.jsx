import {useDocumentation, useMom, useNote} from "../../utils/swr"
import CardDocumentation from "../Projects/CardDocumentation"
import CardNote from "./CardNote";
import SkeletonCardApplication from "./SkeletonCardApplication";
import CardMOM from "../Projects/CardMOM"
import CardErrorKnowledge from "../Projects/CardErrorKnowledge"


export default function ShareProjectApplication({data}) {
    const dataDocumentation = useDocumentation(2, JSON.parse(localStorage.getItem("XA")), data.id)
    const dataNote = useNote(2, JSON.parse(localStorage.getItem("XA")), data.id)
    const dataMOM = useMom(2, JSON.parse(localStorage.getItem("XA")), data.id)
    console.log(dataNote, dataMOM);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-20">
        {
            dataDocumentation ? dataDocumentation?.data?.data.map((item, key) => {
                return <CardDocumentation key={key} item={item}/>
            })
            :
            new Array(4).fill("mantap").map((item, key) => {
                return <SkeletonCardApplication key={key}/>
            })
        }

        {
            dataNote ? dataNote?.data?.data.map((item, key) => {
                return <CardNote key={key} item={item}/>
            })
            :
            new Array(4).fill("mantap").map((item, key) => {
                return <SkeletonCardApplication key={key}/>
            })
        }
        {
            dataMOM ? dataMOM?.data?.data.map((item, key) => {
                return <CardMOM key={key} item={item} />
            })
                :
                new Array(4).fill("mantap").map((item, key) => {
                    return <SkeletonCardApplication key={key} />
                })
        }
    </div>
  )
}