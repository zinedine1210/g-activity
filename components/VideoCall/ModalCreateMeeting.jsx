import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "context/MyProvider"
import PasswordInput from "@components/Input/PasswordInput"
import AuthRepository from "@repositories/AuthRepository"
import MeetingRepository from "@repositories/MeetingRepository"
import { Notify } from "@utils/scriptApp"


export default function ModalCreateMeeting(props) {
    const context = useContext(MyContext)
    const { name, type, data } = context.modal
    const [value, setValue] = useState({
        audience: []
    })
    const [dataMemberKeyword, setDataMemberKeyword] = useState([])
    const [datatimeout, setDatatimeout] = useState(null)
    const [typename, setTypename] = useState("")
    const [loading, setLoading] = useState(false)

    function formatEpochTime(epochTime) {
        const date = new Date(epochTime - (7 * 60 * 60 * 1000));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if (type == "create") {
            setTypename("Create Meeting")
        } else if (type == "update") {
            let obj = {
                title: data?.title,
                id: data?.id,
                about: data?.about,
                passcode: data?.passcode,
                date: formatEpochTime(data?.date?.epoch_time * 1000)
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

        if(e.key == "ArrowDown"){
            if(idx == dataMemberKeyword.data.data.length){
                return alert("Invalid")
            }
            document.getElementById(`username-${idx ? idx + 1 : 1}`).focus()
        }

        if(e.key == "ArrowUp"){
            if(idx == 1){
                return alert("Invalid")
            }
            document.getElementById(`username-${idx - 1}`).focus()
        }
    }

    const handleSearch = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            if(value != ""){
                findMembers(value)
            }else{
                setDataMemberKeyword([])
            }
        }, 1000);
        setDatatimeout(getdatatimeout)
    }

    const handlerChange = (valueinput, target) => {
        setValue({ ...value, [target]: valueinput })
    }

    const handleDeleteAudience = (item) => {
        const filter = JSON.parse(JSON.stringify(value.audience)).filter(res => res.id !== item.id)
        setValue({ ...value, audience: filter })
    }

    const handleAddAudience = item => {
        const getaudient = JSON.parse(JSON.stringify(value.audience))
        getaudient.push(item)
        setValue({ ...value, audience: getaudient})
    }

    const handlerSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        // console.log(value)
        actionUser[type].action(value)
        setLoading(false)
    }

    let actionUser = {
        update: {
            name: "update",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                let obj = JSON.parse(JSON.stringify(value))
                const splitdate = obj.date.split("T")
                splitdate[1] = splitdate[1] + ":00"
                const joinDate = splitdate.join(" ")
                obj.date = joinDate
                const result = await MeetingRepository.putMeeting({
                    xa: getxa,
                    data: obj,
                    id: obj.id
                })
                if (result.status == 0) {
                    const findIndex = context.dataMeeting.findIndex(el => el.id == obj.id)
                    context.dataMeeting[findIndex] = result.data
                    context.setData({ ...context, dataMeeting: context.dataMeeting , modal: null })
                    Notify("Updated", "info")
                }
            }
        },
        create: {
            name: "create",
            action: async (value) => {
                if (value.audience.length == 0) {
                    setLoading(false)
                    return Notify("Please fill input is null", "info")
                }

                let obj = JSON.parse(JSON.stringify(value))
                let arr = ""
                obj.audience.forEach((el, index) => {
                    if(index == 0){
                        arr += el.id
                    }else{
                        arr += ","+el.id
                    }
                });
                obj.audience = arr
                const splitdate = obj.date.split("T")
                splitdate[1] = splitdate[1] + ":00"
                const joinDate = splitdate.join(" ")
                obj.date = joinDate
                const result = await MeetingRepository.postMeeting({
                    xa: JSON.parse(localStorage.getItem("XA")),
                    data: obj
                })
                console.log(result, obj)
                if(result.status == 0){
                    context.setData({ ...context, dataMeeting: [ ...context.dataMeeting, result.data ], modal: null })
                    Notify("Added", "info")
                }else Notify("Something went wrong", "error")
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
                                <p className="text-sm text-zinc-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet, facilis.</p>
                            </header>
                            {
                                value && (
                                    <div className="w-full mt-10 space-y-5 overflow-y-auto flex-1">
                                        <div>
                                            <h1 className="font-semibold">Title</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.title} name="title" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">About</h1>
                                            <input type="text" disabled={isDisabledView} required value={value.about} name="about" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Date</h1>
                                            <input type="datetime-local" disabled={isDisabledView} required value={value.date} name="date" onInput={e => handlerChange(e.target.value, e.target.name)} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <PasswordInput isRequired={false} label={"Passcode"} value={value.passcode} handlerChange={(value, target) => handlerChange(value, target)} name={"passcode"} />

                                        {
                                            type == "create" && (
                                                <>
                                                    <div className="w-full relative">
                                                        <h1 className="font-semibold">Invite your team to join meeting</h1>
                                                        <form className="mt-10 space-y-3 " onSubmit={(e) => handlerSubmitEmail(e)}>
                                                            {
                                                                value.audience.length > 0 ? value.audience.map((item, key) => {
                                                                    return (
                                                                        <div key={key} className="block relative border-2 dark:border-zinc-500 dark:bg-darkPrimary border-blue-500 p-2 rounded-md bg-blue-100">
                                                                            <h1>{item.username}</h1>
                                                                            <div className="absolute top-1/2 right-0 -translate-y-1/2 px-2">
                                                                                <button type="button" onClick={() => handleDeleteAudience(item)} className="bg-red-500 rounded-full flex items-center justify-center text-white">
                                                                                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                                :
                                                                <h1 className="w-full text-center text-red-500 font-bold py-5">
                                                                    Please Select Member 
                                                                    <p className="text-zinc-600">The members you choose will appear here</p>
                                                                </h1>
                                                            }
                                                            <div className={`shadow-md p-5 bg-white dark:bg-dark rounded-xl z-20 w-full`}>
                                                                <input type="text" onKeyDown={e => handlerKey(e)} onChange={(e) => handleSearch(e.target.value)} className={`outline-none p-2 border-2 dark:border-zinc-800 border-blue-300 w-full`} placeholder="Search Member from username" />
                                                                {/* {console.log(dataMemberKeyword)} */}
                                                                <div className="h-full max-h-72 overflow-y-scroll">
                                                                    {
                                                                        dataMemberKeyword ?
                                                                        dataMemberKeyword.length > 0 ?
                                                                        dataMemberKeyword.filter(res => {
                                                                            const find = value.audience.find(f => f.id == res.id)
                                                                            if(find) return false
                                                                            else return true
                                                                        }).map((opt, key) => {
                                                                            return (
                                                                                <button id={`username-${key + 1}`} type="button" onKeyDown={e => handlerKey(e, key + 1)} key={key} onClick={() => handleAddAudience(opt)} className="outline-none disabled:bg-zinc-200 focus:bg-blue-100 hover:bg-blue-100 py-4 border-b px-3 transition-all duration-300 w-full text-start flex items-center gap-2 dark:hover:bg-darkPrimary dark:focus:bg-darkSecondary">
                                                                                    <span className="flex items-center justify-center text-white bg-black rounded-full w-10 h-10 uppercase font-bold">
                                                                                        {opt.username.charAt(0)}
                                                                                    </span>
                                                                                    <div>
                                                                                        <h1>{opt?.fullname}</h1>
                                                                                        <p className="font-bold text-sm">{opt?.username}</p>
                                                                                    </div>
                                                                                </button>
                                                                            )
                                                                        })
                                                                        :
                                                                        <div className="text-center font-bold text-blue-500 p-5">
                                                                            <h1>Not Available</h1>
                                                                        </div>
                                                                        :
                                                                        <div className="text-center font-bold p-5">
                                                                            <div className="bg-blue-200 mx-auto w-8 h-8 rounded-full animate-pulse">

                                                                            </div>
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                )
                            }

                            <footer className="pt-5 border-t mt-5 w-full">
                                {
                                    loading ? 
                                    <div className="">
                                        <div role="status" className="w-full py-2">
                                        <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
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