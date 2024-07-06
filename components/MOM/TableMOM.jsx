import { useContext, useEffect, useState } from "react"
import { MyContext } from "../../context/MyProvider"
import { useMomPoint } from "../../utils/swr"
import RecordHeader from "./ColumnComponent/RecordHeader"
import RecordMOM from "./RecordMOM"
import MomRepository from "../../repositories/MomRepository"
import { FaPlus } from "react-icons/fa"

export default function TableMOM() {
    const context = useContext(MyContext)
    const data = context.dataDocumentation
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function getRecord() {
            const result = await MomRepository.getPoint({ xa: JSON.parse(localStorage.getItem("XA")), momID: data.id })
            console.log(result);
            result.data.sort(function (a, b) {
                return a.pos - b.pos
            })
            context.dataDocumentation.record = result.data
            context.setDataDocumentation(context.dataDocumentation)
        }
        if (!context.dataDocumentation.hasOwnProperty('record')) {
            getRecord()
        }
    }, [])


    const handlerCreateRecord = async () => {
        setLoading(true)
        let obj = {
            mom_id: data.id,
            result: "",
            target_date: new Date(),
            pic: [],
            state_by: [],
            pos: context.dataDocumentation.record.length + 1
        }

        const result = await MomRepository.postPoint({ xa: JSON.parse(localStorage.getItem("XA")), data: obj })
        console.log(result);
        if (result.status == 0) {
            data.record.push(result.data)
            context.setDataDocumentation(context.dataDocumentation)
        }

        setLoading(false)
    }


    return (
        <section className="pb-10">
            <div className="sm:flex sm:items-center sm:justify-between mb-2 group relative">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="font-bold text-zinc-800 dark:text-white">Goals And Progress</h2>

                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-zinc-800 dark:text-blue-400">{context.dataDocumentation.record ? context.dataDocumentation.record.length : 0} Records</span>
                    </div>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">Fill in the table before your meeting. Add Answer of Question or Important Point of meeting about what you learned since the last meeting and what you hope to achieve by the next meeting.</p>
                </div>
                <button onClick={() => handlerCreateRecord()} className="bg-zinc-200 rounded-md hover:bg-zinc-300 transition-all duration-300 ease-in-out w-12 h-12 ">
                    <FaPlus className="text-sm text-zinc-500 text-center mx-auto" />
                </button>
            </div>
            <div className="flex flex-col relative">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 md:px-6 lg:px-8">
                        <div className="overflow-y-hidden border border-zinc-200 dark:border-zinc-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                                <thead className="bg-zinc-50 dark:bg-zinc-800">
                                    <tr>
                                        <th></th>
                                        <th className="w-5 relative font-bold p-3 text-sm border-r text-left rtl:text-right text-zinc-500 dark:text-zinc-400">No</th>
                                        {
                                            data.header.map((header, key) => {
                                                return (
                                                    <RecordHeader key={key} header={header} />
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-zinc-200 dark:divide-zinc-700 dark:bg-zinc-900 align-top">
                                    {
                                        context.dataDocumentation.hasOwnProperty("record") ?
                                            context.dataDocumentation.record.map((record, key) => {
                                                return <RecordMOM record={record} key={key} />
                                            })
                                            : "Loading"
                                    }
                                </tbody>
                            </table>
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

                <div className="items-center hidden md:flex gap-x-3">
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
        </section>
    )
}
