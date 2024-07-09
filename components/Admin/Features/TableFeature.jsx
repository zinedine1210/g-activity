import { useContext, useEffect } from "react"
import { MyContext } from "../../../context/MyProvider"
import RecordFeature from "./RecordFeature"
import FeatureRepository from "../../../repositories/FeatureRepository"

export default function TableFeature({
    statename,
    keyword,
    filter
}) {
    const context = useContext(MyContext)

    const getFeatureData = async (role) => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await FeatureRepository.getFeature({
            roleId: role == "" ? 'dataawal' : role,
            xa: getxa
        })
        if(result.status == 0){
            result.data.map((res) => res['roleId'] = role)
            context.setData({...context, [statename]: result })
        }
    }

    useEffect(() => {
        if (!context[statename]) {
            getFeatureData(filter.role)
        }
    }, [context[statename]])

    const dataList = context?.[statename]?.data

    const advanceSearch = (valueSearch) => {
		return options.slice(1).filter((res) => {
			const itemString = JSON.stringify(res).toLowerCase();
			const keywordLower = valueSearch.toLowerCase().split('');
			return keywordLower.every((part) => {
				const regex = new RegExp(part, 'i');
				return regex.test(itemString);
			});
		});
	};

    const fetchComponent = () => dataList.sort((a, b) => b?._cd?.epoch_time - a?._cd?.epoch_time)
                                        .filter(res => {
                                            const stringifydata = JSON.stringify(res)
                                            if(!stringifydata.toLowerCase().includes(keyword.toLowerCase())) return false
                                            return true
                                        })
                                        .map((item, key) => {
                                            return <RecordFeature statename={statename} key={key} data={item} />
                                        })
    return (
        <div className="w-full">
            <div className="flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6">
                    <div className="inline-block min-w-full py-2 align-middle xl:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            {
                                dataList ?
                                    dataList.length > 0 ?
                                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                                            <thead className="">
                                                <tr>
                                                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400 w-full">
                                                        Feature
                                                    </th>

                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        View
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Add
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Edit
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Delete
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Export
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Import
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Approval
                                                    </th>
                                                    <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-zinc-500 dark:text-zinc-400">
                                                        Setting
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-zinc-200 dark:divide-zinc-700 dark:bg-black">
                                                {fetchComponent()}
                                            </tbody>
                                        </table>
                                        :
                                        <div className="w-full text-center p-5">
                                            <h1 className="text-red-500 text-sm uppercase font-bold">No Data Available</h1>
                                        </div>
                                    :
                                    <div className="mt-10">
                                        {new Array(10).fill("mantap").map((key, index) => {
                                            return (
                                                <div key={index} className="w-full h-10 animate-pulse bg-zinc-200 mb-1 rounded-md"></div>
                                            )
                                        })}
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="flex items-center justify-between mt-6">
            <a href="#" className="flex items-center px-5 py-2 text-sm text-zinc-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>

                <span>
                    previous
                </span>
            </a>

            <div className="items-center hidden xl:flex gap-x-3">
                <a href="#" className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-zinc-800 bg-blue-100/60">1</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">2</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">3</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">...</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">12</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">13</a>
                <a href="#" className="px-2 py-1 text-sm text-zinc-500 rounded-md dark:hover:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100">14</a>
            </div>

            <a href="#" className="flex items-center px-5 py-2 text-sm text-zinc-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <span>
                    Next
                </span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </a>
        </div> */}
        </div>
    )
}
