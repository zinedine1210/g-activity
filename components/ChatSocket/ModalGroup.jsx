import { useContext, useEffect, useState, useCallback } from "react"
import RoleRepository from "@repositories/RoleRepository"
import { Notify } from "@utils/scriptApp"
import { MyContext } from "context/MyProvider"
import ChatCollection from "@repositories/ChatCollection"
import { MultiSelect } from 'react-multi-select-component';
import CollectionData from "@repositories/CollectionData"
import { emit, on, connect, checkErrorMsg } from "@utils/socketfunction"
import { showToast } from "@utils/functionToast"

export default function ModalGroup({ statename }) {
    const context = useContext(MyContext)
    const { name, type, data } = context.modal
    const [option, setOption] = useState([])
    const [value, setValue] = useState({})
    const [typename, setTypename] = useState("")

    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Fungsi untuk fetch data dari server
    const fetchOptions = async (query) => {
        setIsLoading(true);
        const result = await CollectionData.postData({ url: `chat-contact/findmycontact`, values: { "username": query } })
        if (result.data.length > 0) {
            const fetchedOptions = result.data.map(item => ({
                label: `${item.first_name} ${item.last_name}`,
                uid: item.user_id,
                value: item.id,
            }));
            setOptions(fetchedOptions);
        }
        setIsLoading(false);
    };

    const handlerChange = (valueinput, target) => {
        setValue({ ...value, [target]: valueinput })
    }

    // Handler untuk input pencarian dengan debounce
    const handleInputChange = useCallback((event) => {
        const { value } = event.target;
        setSearchTerm(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            if (value) {
                fetchOptions(value);
            } else {
                setOptions([]);
            }
        }, 500); // Waktu debounce 500ms

        setDebounceTimeout(newTimeout);
    }, [debounceTimeout]);

    useEffect(() => {
        if (type == "create") {
            setTypename("Create Group")
            setValue({
                group: data?.group ?? ""
            })
        } else if (type == "update") {
            let obj = {
                group: data?.group ?? "",

                id: data?.id
            }
            setValue(obj)
            setTypename("Update Group")
        } else {
            setTypename("Group Detail")
            setValue(data)
        }
    }, [type, data])

    const handlerSubmit = async (e) => {
        e.preventDefault()
        console.log("ini submit")
        if (!value || value == ""){
            showToast({
                type: "error",
                text: "Group name cannot be empty"
            })
        }

        let newObj = {
            'group': value['group'],
            'member': selected
        }
        console.log("newObj", newObj)
        // SEND MESSAGE
        emit("createGroup", newObj)
            .then(callback => {
                console.log("callback create group", callback)
                checkErrorMsg(callback)
            })
    }

    let actionUser = {
        update: {
            name: "update",
            action: async (value) => {
                const getxa = JSON.parse(localStorage.getItem("XA"))
                const result = await RoleRepository.putRole({
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
                const result = await ChatCollection.postGroup({
                    xa: getxa,
                    data: value
                })
                console.log(result)
                if (result.status == 0) {
                    context.setData({ ...context, [statename]: null, modal: null })
                    Notify("Success", "info")
                }
            }
        }
    }


    const isDisabledView = type == "view" ? true : false

    return (
        <div className="absolute top-0 left-0 flex justify-center items-center right-0 z-50 bg-black bg-opacity-50 w-full p-2 overflow-x-hidden overflow-y-auto md:inset-0 h-full md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-darkSecondary flex items-center">
                    <div className="p-6 w-full relative">
                        <form onSubmit={e => handlerSubmit(e)} className="flex-col flex h-full">
                            <header>
                                <h1 className="font-bold text-lg">{typename}</h1>
                            </header>
                            {
                                value && (
                                    <div className="w-full mt-10 space-y-5 overflow-y-auto flex-1">
                                        <div>
                                            <h1 className="font-semibold">Group name</h1>
                                            <input type="text" required value={value.group}  onInput={e => handlerChange(e.target.value, e.target.name)}  name="group" className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
                                        </div>
                                        <div>
                                            <h1 className="font-semibold">Search and select user</h1>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleInputChange}
                                                placeholder="Type contact name..."
                                                className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white"
                                            />
                                            {isLoading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                <MultiSelect
                                                    options={options}
                                                    value={selected}
                                                    onChange={setSelected}
                                                    disableSearch={true}
                                                    labelledBy="Select"
                                                />
                                            )}
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