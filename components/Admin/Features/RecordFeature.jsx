import { FaEllipsisH, FaMinus } from "react-icons/fa";
import SelectReusable from "../Partials/SelectReusable";
import { BsTrash, BsPencil, BsEye, BsCheck, BsStripe, BsXCircle } from "react-icons/bs"
import { useContext } from "react";
import { MyContext } from "../../../context/MyProvider";

export default function RecordFeature({ data }) {
    const context = useContext(MyContext)

    const handleChange = async () => {
        
    }

    let iconFeatures = {
        1: <BsCheck className="text-3xl text-green-500"/>,
        2: <FaMinus className="text-xl text-red-500"/>,
        0: <BsXCircle className="text-zinc-500 text-2xl"/>
    }
    
    return (
        <tr>
            <td className="w-full px-12 py-4 text-zinc-700 dark:text-white whitespace-nowrap font-bold">
                {data?.feature_name}
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.view]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.add]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.edit]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.delete]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.export]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.import]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.approval]}</button>
            </td>
            <td className="px-12 py-4 text-sm font-normal text-zinc-700 dark:text-white whitespace-nowrap">
                <button onClick={() => handleChange()}>{iconFeatures[data?.setting]}</button>
            </td>
        </tr>
    )
}
