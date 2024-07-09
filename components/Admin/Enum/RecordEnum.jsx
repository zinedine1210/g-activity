import { FaEllipsisH } from "react-icons/fa";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs"
import { useContext } from "react";
import { MyContext } from "../../../context/MyProvider";
import { Notify } from "../../../utils/scriptApp";
import SelectReusable from "../Partials/SelectReusable";
import EnumRepository from "../../../repositories/EnumRepository";

export default function RecordEnum({ data, statename, enumSelf }) {
    const context = useContext(MyContext)

    const handleDelete = async (payload) => {
        const result = await EnumRepository.deleteEnum({
            xa: JSON.parse(localStorage.getItem("XA")),
            data: [payload.id]
        })
        console.log(result)
        if(result.status == 0){
            Notify("Deleted", "success")
        }else{
            alert("Something went wrong")
        }
    }

    const bulkOptions = [
        {
            label: "Delete",
            iconLabel: <BsTrash className='text-red-500' />,
            onClick: (data) => {
                handleDelete(data)
            }
        },
        {
            label: "Update",
            iconLabel: <BsPencil className='text-blue-500' />,
            onClick: (data) => {
                context.setData({ ...context, modal: { name: "modalEnum", type: "update", data: data } })
            }
        },
        {
            label: "View",
            iconLabel: <BsEye className='text-blue-500' />,
            onClick: (data) => {
                context.setData({ ...context, modal: { name: "modalEnum", type: "view", data: data } })
            }
        },

    ]

    const module = context[statename] ? context[statename].enumSelf.find(res => res.value == data.mod)?.label : ""
    
    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="w-full px-12 py-4 dark:text-white whitespace-nowrap font-bold">
                {data?.app}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <span className="text-sm py-1.5 px-3 bg-teal-500 rounded-xl text-white font-semibold">{module}</span>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                {data?.code}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                {data?.value}
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                <SelectReusable data={data} options={bulkOptions} label={<FaEllipsisH className='text-zinc-500 dark:text-white' />} customCss='w-8 h-8' position="right-0" />
            </td>
        </tr>
    )
}
