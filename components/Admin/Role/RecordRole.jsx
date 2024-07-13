import { FaEllipsisH, FaMinus } from "react-icons/fa";
import { BsCheck, BsEye, BsPencil, BsTrash } from "react-icons/bs"
import { useContext } from "react";
import { MyContext } from "../../../context/MyProvider";
import { Notify } from "../../../utils/scriptApp";
import SelectReusable from "../Partials/SelectReusable";

export default function RecordRole({ data, statename, profileData }) {
    const context = useContext(MyContext)

    const handleDelete = async (payload) => {
        Notify("Action not found", "info")
        // const result = await RoleRepository.deleteRole({
        //     xa: JSON.parse(localStorage.getItem("XA")),
        //     id: payload.id
        // })
        // console.log(result)
        // if(result.status == 0){
        //     Notify("Deleted", "success")
        // }else{
        //     alert("Something went wrong")
        // }
    }

    const bitws = profileData._bitws
    const featureaccess = profileData._feature

    const rolePermission = (feature, action) => {
        const isAllow = Number(featureaccess[feature] & bitws[action]) == 0 ? false:true
        return isAllow
    }

    const bulkOptions = [
        {
            label: "Delete",
            iconLabel: <BsTrash className='text-red-500' />,
            onClick: (data) => {
                if(!rolePermission("_role", "delete")) return Notify("Permission Denied", "warning")
                handleDelete(data)
            }
        },
        {
            label: "Update",
            iconLabel: <BsPencil className='text-blue-500' />,
            onClick: (data) => {
                if(!rolePermission("_role", "edit")) return Notify("Permission Denied", "warning")
                context.setData({ ...context, modal: { name: "modalRole", type: "update", data: data } })
            }
        },
        {
            label: "View",
            iconLabel: <BsEye className='text-blue-500' />,
            onClick: (data) => {
                if(!rolePermission("_role", "view")) return Notify("Permission Denied", "warning")
                context.setData({ ...context, modal: { name: "modalRole", type: "view", data: data } })
            }
        },

    ]
    
    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="w-full px-12 py-4 dark:text-white whitespace-nowrap font-bold">
                <span className="inline-block py-1.5 px-5 text-sm rounded-xl text-white" style={{ backgroundColor: data?.color }}>{data?.rolename}</span>
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                <SelectReusable data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            </td>
        </tr>
    )
}
