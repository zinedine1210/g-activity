import { FaEllipsisH } from "react-icons/fa";
import SelectReusable from "../Partials/SelectReusable";
import { BsTrash, BsPencil, BsEye } from "react-icons/bs"
import { useContext } from "react";
import { MyContext } from "../../../context/MyProvider";
import { Notify } from "@utils/scriptApp";

export default function RecordUser({ data, profileData }) {
    const context = useContext(MyContext)
    const handleDelete = async () => {
        alert("Action not found")
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
            onClick: () => {
                handleDelete()
            }
        },
        {
            label: "Update",
            iconLabel: <BsPencil className='text-blue-500' />,
            onClick: (data) => {
                if(rolePermission("_user", "edit")){
                    context.setData({ ...context, modal: { name: "modalUser", type: "update", data: data } })
                }else Notify("Permission denied", "warning")
            }
        },
        {
            label: "View",
            iconLabel: <BsEye className='text-blue-500' />,
            onClick: (data) => {
                if(rolePermission("_user", "view")){
                    context.setData({ ...context, modal: { name: "modalUser", type: "view", data: data } })
                }else Notify("Permission denied", "warning")
            }
        },

    ]
    return (
        <tr>
            <td className="px-4 py-4 text-sm font-medium text-zinc-700 dark:text-white whitespace-nowrap">
                <div className="inline-flex items-center gap-x-3">
                    <input type="checkbox" onChange={e => Notify("Action not found", "info")} className="text-blue-500 border-zinc-300 rounded dark:bg-zinc-900 dark:ring-offset-zinc-900 dark:border-zinc-700" />
                    <h1>{data?.username}</h1>
                </div>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                {data?.fullname}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                {data?.email}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap text-center mx-auto">
                <span className="inline-block py-1.5 px-5 rounded-xl text-sm text-white" style={{ backgroundColor: data?.rolename?.color }}>{data?.rolename?.rolename}</span>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                {data?._active ?
                    <span className="inline-block py-1.5 px-5 rounded-xl text-sm bg-green-100 text-green-500 font-bold">Active</span>
                    :
                    <span className="inline-block py-1.5 px-5 rounded-xl text-sm text-white bg-red-500">Inactive</span>
                }
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap flex items-center gap-2">
                <SelectReusable data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            </td>
        </tr>
    )
}
