import ChatCollection from "@repositories/ChatCollection";
import { Notify } from "@utils/scriptApp";
import { MyContext } from "context/MyProvider";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BsChevronLeft, BsSearch } from "react-icons/bs";
import ModalContact from "./ModalContact";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function PanelContact({
    profileData,
    roomId
}) {
    const context = useContext(MyContext)
    const statename = "dataContact"
    const [keyword, setKeyword] = useState("")
    const [datatimeout, setDatatimeout] = useState(null)
    const [contactfind, setContactFind] = useState(null)
    const router = useRouter()

    const getAllContact = async () => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        const result = await ChatCollection.getContact({
            xa: getxa
        })
        console.log(result)
        if(result.status == 0){
            context.setData({ ...context, [statename]: result.data })
        }else Notify("Something went wrong when get contact", 'error')
    }

    useEffect(() => {
        if(!context[statename]) getAllContact()
    }, [context[statename]])


    const findContact = async (value) => {
        const getxa = JSON.parse(localStorage.getItem("XA"))
        
        const result = await ChatCollection.findContact({
            xa: getxa,
            data: {
                username: value
            }
        })
        console.log(result)
        if(result.status == 0 && result.type != 1){
            setContactFind(result.data)
        }else{
            setContactFind(null)
        }
    }

    const handleAddNewRoom = async cont => {
        if(cont?.room_id){
            router.push(`/usr/chat?roomId=${cont.room_id}`)
            return false
        }
        
        Swal.fire({
            title:`Do you want to start a conversation with ${cont?.first_name} ${cont?.last_name}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, say hallo'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // buat private room
                let obj = {
                    label: "",
                    type: 1,
                    type_msg: 1,
                    msg: "Hallo " + cont?.first_name + cont?.last_name,
                    list_user: [
                        cont.user_id // contact userid
                    ]
                }

                // tambahkan confirm apakah yakin membuat room
                const result = await ChatCollection.postRoom({
                    xa: JSON.parse(localStorage.getItem("XA")),
                    data: obj
                })
                console.log(result)
                if(result.status == 0){
                    context.setData({ ...context, dataRoom: null, dataChat: null, dataDetailRoom: null, dataContact: null })
                    router.push(`/usr/chat?roomId=${result.data.room.id}`)
                } else Notify("Something went wrong", "error")
            }
          })
    }

    const handleAddNewContact = async cont => {
        const find = context[statename].find(res => res.user_id == cont.id)
        if(!find) context.setData({...context, modal: { name: "newcontact", type: "create", data: cont }})
            else Notify("Contact has been added", "info")
    }

    const handleSearch = (value) => {
        clearTimeout(datatimeout)
        let getdatatimeout = setTimeout(() => {
            if(value){
                findContact(value)
            }else{
                setContactFind(null)
            }
            setKeyword(value)
        }, 1000);
        setDatatimeout(getdatatimeout)
    }



    // Looping mapping
    const mapDataContact = () => {
        // cek udah dapet datanya apa belum
        if(context[statename]){
            const filterbykeyword = context[statename].filter(res => {
                const stringifydata = JSON.stringify(res)
                if(!stringifydata.toLowerCase().includes(keyword.toLowerCase())) return false
                return true
            })
            return (
                <div className="w-full">
                    <h1 className="text-center py-1 text-sm uppercase font-bold bg-teal-500/20 text-teal-500">
                        My Contact
                    </h1>
                    <div className="space-y-2 mt-2 px-2">
                        {
                            filterbykeyword.length > 0 ? filterbykeyword.map((item, index) => {
                                return (
                                    <button onClick={() => handleAddNewRoom(item)} className="w-full text-start flex items-center gap-2 py-2 hover:bg-blue-500/10 p-2 transition-colors duration-300 rounded-md" key={index}>
                                        <span className="w-10 h-10 uppercase rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-teal-600 to-teal-200">{item?.first_name.charAt(0)}{item?.last_name.charAt(0)}</span>
                                        <div>
                                            <h1 className="font-semibold">{item?.first_name} {item?.last_name}</h1>
                                            <p className="text-sm text-zinc-700">{item?.username}</p>
                                        </div>
                                    </button>
                                )
                            })
                            :
                            <div className="text-center mt-5 text-red-500">
                                <h1 className="font-bold">Contact not found</h1>
                            </div>
                        }
                    </div>
                </div>
            )
        }else{
            return (
                <div className="space-y-2 px-2 mt-2">
                    {
                        new Array(10).fill("contact").map((load, index) => {
                            return (
                                <div key={index} className="h-20 w-full rounded-xl mt-1 bg-zinc-200 animate-pulse"></div>
                            )
                        })
                    }
                </div>
            )
        }
    }
    
    const isActiveModal = context?.modal?.name == "newcontact"
  return (
    <div className="w-full xl:w-full h-screen overflow-y-hidden">
        <div className="flex-col flex h-full">
            <header className="w-full border-b-2 border-blue-500 shadow-md px-2 py-2.5">
                <div className="pl-3 mb-5">
                    <h1 className="font-bold">My Contact</h1>
                    <p className="text-sm text-zinc-600 font-semibold">Search your contacts or new contacts by username</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <button onClick={() => router.push({ pathname: `/usr/chat`, query: router.query }, undefined, { shallow: true })} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
                            <BsChevronLeft />
                        </button>
                    </div>
                    <div className="relative w-full">
                        <BsSearch className="absolute top-1/2 -translate-y-1/2 left-3"/>
                        <input type="search" onChange={(e) => handleSearch(e.target.value)} className="focus:bg-zinc-300 duration-300 rounded-md outline-none w-full py-3 pl-10 text-sm placeholder:text-zinc-500" placeholder="Search Contact or new contact" />
                    </div>
                </div>
            </header>
            
            <div className="w-full flex-1 overflow-y-auto space-y-2 relative">
                {contactfind && (
                    <>
                        <h1 className="text-center py-1 text-sm font-bold bg-teal-500/20 text-teal-500 uppercase">
                            New Contact Found
                        </h1>
                        <div className="w-full px-2">
                            <button onClick={() => handleAddNewContact(contactfind)} className="w-full text-start flex items-center gap-2 py-2 hover:bg-blue-500/10 p-2 transition-colors duration-300 rounded-md">
                                <span className="w-10 h-10 uppercase rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-teal-600 to-teal-200">{contactfind?.username.charAt(0)}</span>
                                <div>
                                    <h1 className="font-semibold">{contactfind?.username}</h1>
                                    <p className="text-sm text-zinc-700">{contactfind?.email}</p>
                                </div>
                            </button>
                        </div>
                    </>
                )}
                {mapDataContact()}
                {isActiveModal && <ModalContact statename={statename} />}
            </div>

            <footer>
                
            </footer>
        </div>
    </div>
  )
}
