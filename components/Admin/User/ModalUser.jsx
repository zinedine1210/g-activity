import { useContext, useEffect, useState } from "react"
import { MyContext } from "../../../context/MyProvider"
import PasswordInput from "../../Input/PasswordInput"
import RoleRepository from "../../../repositories/RoleRepository"
import UserRepository from "../../../repositories/UserRepository"
import SelectInput from "../../Input/SelectInput"
import { Notify } from "../../../utils/scriptApp"


export default function ModalUser(props) {
    const context = useContext(MyContext)
    const { name, type, data } = context.modal
    const [value, setValue] = useState({
        "_active": 1
    })
    const [typename, setTypename] = useState("")
    const [optionsRole, setOptionsRole] = useState(null)


    const handlerChange = (valueinput, target) => {
        setValue({ ...value, [target]: valueinput })
    }

    const handleChangePassword = async (value, target) => {
        handlerChange(value, target)
    }

    const getComboRole = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await RoleRepository.getRoleComboBox({ xa: getxa })
        if (result.status == 0) {
            let arr = []
            result.data.forEach(element => {
                let obj = {
                    value: element.id,
                    label: element.rolename
                }
                arr.push(obj)
            });
            setOptionsRole(arr)
        } else {
            alert("Something went wrong")
        }
    }

    useEffect(() => {
        if (!optionsRole) getComboRole()
        if (type == "create") {
            setTypename("Create User")
        } else if (type == "update") {
            let obj = {
                id: data.id,
                email: data.email,
                username: data.username,
                fullname: data.fullname,
                r_id: data.r_id,
                _active: data._active ?? 1,
                changePassword: false
            }
            setValue(obj)
            setTypename("Update User")
        } else {
            setTypename("User Detail")
            setValue(data)
        }
    }, [type, data])

    const handlerSubmit = async (e) => {
        e.preventDefault()
        // validasi
        if (!value?._active || !value?.r_id) return alert("Please fill input is null")
        // console.log(value)
        actionUser[type].action(value)
    }

    let actionUser = {
        update: {
            name: "update",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                const result = await UserRepository.putUser({
                    xa: getxa,
                    id: value.id,
                    data: value
                })
                if (result.status == 0) {
                    const filter = context.dataUserAdmin.data.filter(res => res.id !== value.id)
                    context.setData({ ...context, dataUserAdmin: { data: [ result.data, ...filter ]}, modal: null })
                    Notify("Updated", "info")
                }
            }
        },
        create: {
            name: "create",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                const result = await UserRepository.postUser({
                    xa: getxa,
                    data: value
                })
                console.log(result)
                if (result.status == 0) {
                    context.setData({ ...context, dataUserAdmin: { data: [ result.data , ...context.dataUserAdmin.data ]}, modal: null })
                    setOptionsRole(null)
                    Notify("Berhasil ditambahkan", "info")
                }
            }
        }
    }


    const isDisabledView = type == "view" ? true : false

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
                                            <h1 className="font-semibold">Username</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.username} name="username" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Fullname</h1>
                                            <input type="text" disabled={isDisabledView} value={value.fullname} required name="fullname" onChange={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Email</h1>
                                            <input type="text" disabled={isDisabledView} value={value.email} required name="email" onChange={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <SelectInput
                                            isDisabled={isDisabledView}
                                            defaultAll={false}
                                            name={"r_id"}
                                            change={(v, t) => handlerChange(v, t)}
                                            value={value.r_id}
                                            label="Role"
                                            options={optionsRole ?? []}
                                        />
                                        <div className="space-y-3">
                                            <h1 className="font-semibold block">Status</h1>
                                            <label className="inline-flex items-center cursor-pointer ml-2">
                                                <input disabled={isDisabledView} type="checkbox" checked={value._active == 1 ? true : false} name="_active" onChange={(e) => handlerChange(e.target.checked ? 1 : -1, e.target.name)} className="sr-only peer" />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{value._active == 1 ? "Active" : "Suspend"}</span>
                                            </label>
                                        </div>
                                        {
                                            type == "create" && (
                                                <>
                                                    <PasswordInput label={"Password"} isDisabled={isDisabledView} value={value.password} handlerChange={(value, target) => handlerChange(value, target)} name={"password"} />
                                                    <PasswordInput label={"Retype Password"} isDisabled={isDisabledView} handlerChange={(value, target) => handlerChange(value, target)} value={value.repassword} name={"repassword"} />
                                                </>
                                            )
                                        }
                                        {
                                            type == "update" && (
                                                <div>
                                                    <button type="button" className="btn-secondary" onClick={() => handleChangePassword(!value.changePassword, "changePassword")}>Change Password</button>
                                                    {
                                                        value.changePassword && (
                                                            <div className="mt-5 space-y-5">
                                                                <PasswordInput label={"Password"} isDisabled={isDisabledView} value={value.password} handlerChange={(value, target) => handlerChange(value, target)} name={"password"} />
                                                                <PasswordInput label={"Retype Password"} isDisabled={isDisabledView} handlerChange={(value, target) => handlerChange(value, target)} value={value.repassword} name={"repassword"} />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }

                            <footer className="pt-5 border-t mt-5 w-full">
                                <div className="flex items-center justify-end gap-2">
                                    {type !== "view" && <button className="btn-primary" type="submit">Save</button>}
                                    <button className="btn-secondary" type="button" onClick={() => { context.setData({ ...context, modal: null }); setOptionsRole(null) }}>Cancel</button>
                                </div>
                            </footer>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}