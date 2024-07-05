import { useEffect } from "react"
import { useState } from "react"
import { MultiSelect } from "react-multi-select-component"


export default function SelectMultiple({name, options, loading, create, change, defaultValue, cantSelectAll}) {
    const [data, setData] = useState([])

    useEffect(() => {
        if(defaultValue){
            for(let def of defaultValue){
                data.push({label:def, value:def})
            }
        }
    }, [defaultValue])

    const handlerOptions = (value, target) => {
        setData(value)

        let obj = []
        for(let val of value){
            obj.push(val.value)
        }
        
        change(obj, target)
    }
  return (
    <div className="relative w-full">
        <MultiSelect
            options={options}
            value={data}
            onChange={(e) => handlerOptions(e, name)}
            labelledBy="Select"
            // defaultIsOpen
            isLoading={loading}
            isCreatable={create}
            // shouldToggleOnHover={true}
            hasSelectAll={cantSelectAll ? false:true}
            // closeOnChangedValue={true}
            className="text-sm my-2 rounded-lg font-light peer py-1 peer dark:text-black"
        />
    </div>
  )
}
