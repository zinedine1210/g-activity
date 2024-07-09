import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../context/MyProvider";
import TableFeature from "./TableFeature";
import SelectInput from "../../Input/SelectInput";
import RoleRepository from "../../../repositories/RoleRepository";

export default function MainFeature() {
    const context = useContext(MyContext)
    const [keyword, setKeyword] = useState("")
    const statename = "dataFeatureAdmin"
    const nameModal = "modalFeature"
    const [filter, setFilter] = useState({
        role: ""
    })

    const roleOptions = context?.options?.roleOptions

    const getRoleComboBox = async () => {
        if(!roleOptions){
            const getxa = JSON.parse(localStorage.getItem("XA"))
            const result = await RoleRepository.getRoleComboBox({ xa: getxa })
            // console.log(result)
            if(result.status == 0){
                const resultdata = result.data
                let arr = []
                resultdata.forEach((el) => {
                    arr.push({
                        label: el?.rolename ?? "name undefined",
                        value: el?.id
                    })
                })
                context.setData({ ...context, options: { ...context.options, roleOptions: arr }})
            }
        }
    }

    const handleFilter = (v) => {
        context.setData({ ...context, [statename]: null })
        setFilter({ ...filter, role: v })
    }

    useEffect(() => {
        if(!roleOptions) getRoleComboBox()
    }, [roleOptions])

  return (
    <div className="w-full">
        <div className={`my-5 w-full xl:w-full`}>
            <div className="xl:flex items-center justify-between mb-5">
                <input type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-search w-full xl:w-auto" placeholder="Search" />
                <div className="xl:flex items-center gap-2 mt-2 xl:mt-0 space-y-2 xl:space-y-0">
                    { roleOptions && (
                        <SelectInput 
                            change={(v,t) => handleFilter(v)}
                            value={filter.role}
                            options={roleOptions}
                        />
                    )}
                    <button className="btn-primary" onClick={() => context.setData({...context, [statename]:null})}>
                        Refresh
                    </button>
                </div>
            </div>
            <div>
                <TableFeature filter={filter} statename={statename} keyword={keyword} />
            </div>
        </div>
    </div>
  )
}
