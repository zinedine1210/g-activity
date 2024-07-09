import { useContext, useEffect, useState } from "react"
import { MyContext } from "../../../context/MyProvider"
import EnumRepository from "../../../repositories/EnumRepository"
import { Notify } from "../../../utils/scriptApp"
import SelectInput from "../../Input/SelectInput"

export default function ModalEnum({ statename }) {
    const context = useContext(MyContext)
    const { name, type, data } = context.modal
    const [value, setValue] = useState({
        _sort: 1
    })
    const [typename, setTypename] = useState("")

    const handlerChange = (valueinput, target) => {
        setValue({ ...value, [target]: valueinput })
    }

    useEffect(() => {
        if (type == "create") {
            setTypename("Create Enum")
        } else if (type == "update") {
            let obj = {
                code: data?.code ?? "",
                mod: data?.mod ?? "",
                value: data?.value ?? "",
                app: data?.app ?? "",
                id: data?.id,
                _sort: data?._sort ?? 1
            }
            setValue(obj)
            setTypename("Update Enum")
        } else {
            setTypename("Enum Detail")
            setValue(data)
        }
    }, [type, data])

    const handlerSubmit = async (e) => {
        e.preventDefault()
        if (!value?.mod) return alert("Please fill input is null")
        actionUser[type].action(value)
    }

    let actionUser = {
        update: {
            name: "update",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                const result = await EnumRepository.putEnum({
                    xa: getxa,
                    id: value.id,
                    data: value
                })
                if (result.status == 0) {
                    context.setData({ ...context, [statename]: null, modal: null })
                    Notify("Updated", "info")
                }
            }
        },
        create: {
            name: "create",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                console.log(value)
                const result = await EnumRepository.postEnum({
                    xa: getxa,
                    data: value
                })
                if (result.status == 0) {
                    context.setData({ ...context, [statename]: null, modal: null })
                    Notify("Success", "info")
                }
            }
        }
    }


    const isDisabledView = type == "view" ? true : false
    const optionsMod = context[statename].enumSelf

    return (
        <div className="fixed top-0 left-0 flex justify-center items-center right-0 z-50 bg-black bg-opacity-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-darkSecondary flex items-center">
                    <div className="p-6 w-full relative">
                        <form onSubmit={e => handlerSubmit(e)} className="flex-col flex h-full">
                            <header>
                                <h1 className="font-bold text-2xl">{typename}</h1>
                            </header>
                            {
                                value && (
                                    <div className="w-full mt-10 space-y-5 overflow-y-auto flex-1">
                                        <div>
                                            <h1 className="font-semibold">Application</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.app} name="app" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <SelectInput
                                            isDisabled={isDisabledView}
                                            defaultAll={false}
                                            name={"mod"}
                                            change={(v, t) => handlerChange(v, t)}
                                            value={value.mod}
                                            label="Module"
                                            options={optionsMod ?? []}
                                        />
                                        <div>
                                            <h1 className="font-semibold">Code</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.code} name="code" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Description</h1>
                                            <textarea disabled={isDisabledView} required value={value.value} name="value" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                    </div>
                                )
                            }

                            <footer className="pt-5 border-t mt-5 w-full">
                                <div className="flex items-center justify-end gap-2">
                                    {type !== "view" && <button className="btn-primary" type="submit">Save</button>}
                                    <button className="btn-secondary" type="button" onClick={() => { context.setData({ ...context, modal: null }); }}>Cancel</button>
                                </div>
                            </footer>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}