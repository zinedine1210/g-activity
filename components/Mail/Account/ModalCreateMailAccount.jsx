import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "context/MyProvider"
import PasswordInput from "@components/Input/PasswordInput"
import AuthRepository from "@repositories/AuthRepository"
import MeetingRepository from "@repositories/MeetingRepository"
import { Notify } from "@utils/scriptApp"
import CollectionData from "@repositories/CollectionData"


export default function ModalCreateMailAccount(props) {
    const context = useContext(MyContext)
    const { name, type, data } = context.modal
    const [value, setValue] = useState({
        provider: "",
        password: ""
    })
    const [dataMemberKeyword, setDataMemberKeyword] = useState([])
    const [datatimeout, setDatatimeout] = useState(null)
    const [typename, setTypename] = useState("")
    const [loading, setLoading] = useState(false)
    const [providerOptions, setProviderOptions] = useState([])

    function formatEpochTime(epochTime) {
        const date = new Date(epochTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    async function getOptionProvider() {
        const result = await CollectionData.getData({ url: `mail_provider` })
        if (result.data) {
            console.log("result provider", result)
            result.data.push({ id: "Custom Mail Server", name: "Custom Mail Server" })
            setProviderOptions(result.data)
        }
    }


    useEffect(() => {
        // get option provider
        getOptionProvider()
        if (type == "create") {
            setTypename("Insert your username account")
        } else if (type == "update") {
            console.log("data??", data)
            let obj = {
                name: data?.name,
                id: data?.id,
                username: data?.username,
                password: data?.password,
                provider: data?.provider
            }
            setValue(obj)
            setTypename("Update Meeting")
        } else {
            setTypename("Meeting Detail")
            let obj = JSON.parse(JSON.stringify(data))
            obj.date = formatEpochTime(obj?.date?.epoch_time * 1000)
            setValue(obj)
        }
    }, [type, data])

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const findMembers = async (value) => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await AuthRepository.getFindMember({
            xa: getxa,
            data: {
                keyword: value
            }
        })
        setDataMemberKeyword(result.data)
    }

    const handlerKey = (e, idx) => {

        if (e.key == "ArrowDown") {
            if (idx == dataMemberKeyword.data.data.length) {
                return alert("Invalid")
            }
            document.getElementById(`username-${idx ? idx + 1 : 1}`).focus()
        }

        if (e.key == "ArrowUp") {
            if (idx == 1) {
                return alert("Invalid")
            }
            document.getElementById(`username-${idx - 1}`).focus()
        }
    }

    const handleSearch = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            if (value != "") {
                findMembers(value)
            } else {
                setDataMemberKeyword([])
            }
        }, 1000);
        setDatatimeout(getdatatimeout)
    }


    const handlerChange = (valueinput, target) => {
        if (target == "select") {
            if (valueinput == "Custom Mail Server") {
                // console.log("disini custom")
            }
        }

        setValue({ ...value, [target]: valueinput })
    }

    const handlerSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        // check if email valid
        let checkEmail = isValidEmail(value['username'])

        if (!checkEmail) {
            setLoading(false)
            return Notify("Email not valid", "error")
        }
        if (value['provider'] != "Custom Mail Server") {
            let serverProvider = providerOptions.find(provider => provider.id === value['provider']);
            value['imap'] = serverProvider['imap']
            value['smtp'] = serverProvider['smtp']
        } else {
            value['imap'] = value['server']
            value['smtp'] = value['server']
        }
        console.log(value)

        actionUser[type].action(value)
        setLoading(false)
    }

    let actionUser = {
        create: {
            name: "create",
            action: async (value) => {
                console.log("value insert", value)
                const result = await CollectionData.postData({ url: `mail_account`, values: value })
                console.log('result', result)
                if (result.status == 0) {
                    context.setData({
                        ...context,
                        dataMailAccount: context.dataMailAccount && Array.isArray(context.dataMailAccount)
                            ? [...context.dataMailAccount, result.data] 
                            : [result.data],
                        modal: null
                    });
                    Notify("Added", "info");
                } else Notify("Something went wrong", "error")
            }
        },
        update: {
            name: "update",
            action: async (value) => {
                console.log("value update", value)
                const result = await CollectionData.putData({ url: `mail_account/${value.id}`, values: value })
                console.log('result update', result)
                if (result.status == 0) {
                    if (result.status == 0) {
                        const findIndex = context.dataMailAccount[value.type].findIndex(el => el.id == obj.id)
                        context.dataMailAccount[value.type][findIndex] = result.data
                        context.setData({
                            ...context, dataMailAccount: {
                                ...context.dataMailAccount,
                                [value.type]: context.dataMailAccount[value.type]
                            }, modal: null
                        })
                        Notify("Updated", "info")
                    }
                } else Notify("Something went wrong", "error")
            }
        }
    }


    const isDisabledView = type == "view" ? true : false

    return (
        <div className="fixed top-0 left-0 flex justify-center right-0 z-50 bg-black bg-opacity-50 w-full overflow-x-hidden overflow-y-auto h-full md:h-full">
            <div className="relative w-full h-full max-w-4xl md:h-auto p-5">
                <div className="relative bg-white rounded-lg shadow dark:bg-darkSecondary flex items-center">
                    <div className="p-6 w-full relative">
                        <form onSubmit={e => handlerSubmit(e)} className="flex-col flex h-full">
                            <header>
                                <h1 className="font-bold text-2xl">{typename}</h1>
                                <p className="text-sm text-zinc-600">Insert your username account and select the provider to use the mail feature.</p>
                            </header>
                            {
                                value && (
                                    <div className="w-full mt-4 space-y-5 overflow-y-auto flex-1">
                                        <div>
                                            <h1 className="font-semibold">Provider</h1>
                                            <select type="text" defaultValue={value.provider} disabled={isDisabledView} required name="provider" onInput={e => handlerChange(e.target.value, e.target.name)} placeholder="select provider" className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white">
                                                <option value="" disabled>Select provider</option>
                                                {providerOptions.map((provider, index) => (
                                                    <option key={index} value={provider.value}>
                                                        {provider.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {
                                            value.provider == "Custom Mail Server" ? <div>
                                                <h1 className="font-semibold">Mail Server</h1>
                                                <input placeholder="ex: mails.gai.co.id" type="text" disabled={isDisabledView} required value={value.server} name="server" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                            </div> : null
                                        }

                                        <div>
                                            <h1 className="font-semibold">Name</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.name} name="name" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Email</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.username} name="username" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <PasswordInput isRequired={false} label={"Password"} value={value.password} handlerChange={(value, target) => handlerChange(value, target)} name={"password"} />
                                    </div>
                                )
                            }

                            <footer className="pt-5 border-t mt-5 w-full">
                                {
                                    loading ?
                                        <div className="">
                                            <div role="status" className="w-full py-2">
                                                <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="btn-primary" type="submit">Save</button>
                                            <button className="btn-secondary" type="button" onClick={() => context.setData({ ...context, modal: null })}>Cancel</button>
                                        </div>
                                }
                            </footer>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}