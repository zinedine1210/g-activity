import { useState } from "react"
import { useEffect } from "react"

export default function Pre_Header(props) {
    const [size, setSize] = useState(null)

    useEffect(() => {
        const getID = props.property.id
        if(getID == 4){
            setSize("text-2xl")
        }else if (getID == 5) {
            setSize("text-xl")
        }else{
            setSize("text-lg")
        }
    }, [])
    return (      
        <div className="block mb-5">
            <h1 className={`${size} text-zinc-600 dark:text-zinc-300 font-bold `} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
        </div>
    )
}
