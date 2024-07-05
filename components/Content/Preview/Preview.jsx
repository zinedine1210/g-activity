import { useContext } from "react"
import { MyContext } from "../../../context/MyProvider"
import Pre_Type from "./Pre_Type"

export default function Preview({lang}) {
    const context = useContext(MyContext)
    const device = context.active ? context.active.device : null
    
    if(context.active){
        return (
        <div>
            <div className={`${device == 1 ? "w-full":""} ${device == 2 ? "w-[600px] h-[1024px] border-8 border-black rounded-[50px] bg-white dark:bg-dark dark:border-black px-5 mx-auto hover:overflow-y-scroll overflow-hidden outline outline-blue-300 shadow-2xl":""} ${device == 3 ? "w-[400px] h-[840px] border-8 border-black rounded-[50px] bg-white dark:bg-dark dark:border-black px-5 mx-auto hover:overflow-y-scroll overflow-hidden outline outline-blue-300 shadow-2xl":""} relative`}>
            <span className={`${device == 1 ? "hidden":""} sticky block top-0 right-1/2 mx-auto transform translate-x-1/2 w-1/3 rounded-b-3xl h-8 bg-black dark:bg-black`}>
            </span>
            {
                context.active.content.map((comp, key) => {
                    return (
                    <div>
                        {
                            comp.hasOwnProperty("cols") ?
                            <div className={`${device != 1 ? "w-full":`grid gap-10 grid-cols-${comp.cols.length}`}`}>
                                {
                                    comp.cols.map((item, idx) => {
                                        return (
                                            <div key={idx}>
                                                {
                                                    item.hasOwnProperty("rows") ?
                                                        item.rows.map((row, idx2) => {
                                                            return <Pre_Type comp={row} key={idx2}/>
                                                        })
                                                    :
                                                    <Pre_Type comp={item} device={device}/>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <Pre_Type comp={comp} device={device} key={key}/>
                        }
                    </div>
                    )
                })
            }
            </div>
        </div>
        )
    }

}
