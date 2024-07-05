import { useContext, useEffect } from "react"
import { MyContext } from "../../context/MyProvider"
import { useErrorLogs } from "../../utils/swr"
import CardLogs from "./CardLogs"

export default function ErrorLogs({data}) {
    const dataErrorLogs = useErrorLogs(null, data.id)
    console.log(dataErrorLogs);
    const context = useContext(MyContext)

    useEffect(() => {
        if(dataErrorLogs){
            if(!context.dataDocumentation.hasOwnProperty("errorLogs")){
                if(dataErrorLogs.data.length > 0){
                    dataErrorLogs.data.sort(function(a, b){
                        return a.urutan - b.urutan
                    })
                    context.dataDocumentation.errorLogs = dataErrorLogs.data
                }else{
                    context.dataDocumentation.errorLogs = []
                }
            }
        }else{
            context.setDataDocumentation(context.dataDocumentation)
        }
    }, [dataErrorLogs, context])


    
  return (
    <div className='space-y-2 mt-10'>
            {
                context.dataDocumentation.hasOwnProperty("errorLogs") ?
                context.dataDocumentation.errorLogs.map((log, key) => {
                    return (
                        <CardLogs log={log}/>
                    )
                })
                :""
            }
    </div>
  )
}
