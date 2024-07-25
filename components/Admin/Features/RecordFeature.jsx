import { FaMinus } from "react-icons/fa";
import { BsCheck, BsXCircle } from "react-icons/bs"
import { useContext } from "react";
import { MyContext } from "../../../context/MyProvider";
import FeatureRepository from "../../../repositories/FeatureRepository";
import Swal from "sweetalert2";
import { Notify } from "../../../utils/scriptApp";

export default function RecordFeature({ data, statename, profileData }) {
    const context = useContext(MyContext)
    const bitws = profileData._bitws
    const featureaccess = profileData._feature

    const rolePermission = (feature, action) => {
        const isAllow = Number(featureaccess[feature] & bitws[action]) == 0 ? false:true
        return isAllow
    }

    const handleChange = async (action) => {
        if(!rolePermission("_feature", "edit")) return Notify("Permission Denied", "warning")

        const getxa = JSON.parse(localStorage.getItem("XA"))
        let payload = {
            f_id: data.id, // fitur id
            r_id: data.roleId, // role id
            action // action (view,add,edit,delete,export,import,setting,approval)
        }
        Swal.fire({
            title: 'Do you wanna change the permission?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then( async (result) => {
            if (result.isConfirmed) {
                const result = await FeatureRepository.putFeature({
                    xa: getxa,
                    data: payload
                })

                if(result.status == 0){
                    context[statename].data.find(res => res.id == data.id)[action] = data[action] == 1 ? 2 : 1
                    context.setData({ ...context, [statename]: context[statename] })
                    Notify("Updated", "info")

                }
            }
          })
    }

    let iconFeatures = {
        1: <BsCheck className="text-3xl text-green-500"/>,
        2: <FaMinus className="text-xl text-red-500"/>,
        0: ""
    }
    
    return (
        <tr>
            <td className="w-full px-12 py-4 text-zinc-700 dark:text-white whitespace-nowrap font-bold">
                {data?.feature_name}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.view == 0 && true} onClick={() => handleChange("view")}>{iconFeatures[data?.view]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.add == 0 && true} onClick={() => handleChange("add")}>{iconFeatures[data?.add]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.edit == 0 && true} onClick={() => handleChange("edit")}>{iconFeatures[data?.edit]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.delete == 0 && true} onClick={() => handleChange("delete")}>{iconFeatures[data?.delete]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.export == 0 && true} onClick={() => handleChange("export")}>{iconFeatures[data?.export]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.import == 0 && true} onClick={() => handleChange("import")}>{iconFeatures[data?.import]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.approval == 0 && true} onClick={() => handleChange("approval")}>{iconFeatures[data?.approval]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center">
                <button disabled={data?.setting == 0 && true} onClick={() => handleChange("setting")}>{iconFeatures[data?.setting]}</button>
            </td>
        </tr>
    )
}
