import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { MyContext, urlData } from "../../context/MyProvider";
import {FaUserPlus, FaPrint, FaPalette} from "react-icons/fa"
import {handlerPutErrorKnowledge, handlerPutErrorLogs, handlerPutMOM, handlerPutRecord} from "../../utils/repositories"

export default function NavbarErrorKnowledge(props) {
    const {lang, editor} = props
    const [active, setActive] = useState(false)
    const {theme, setTheme} = useTheme()
    const router = useRouter()
    const defaultLocale = router.locale
    const context = useContext(MyContext)
    const [language, setLanguage] = useState(defaultLocale)

    const settingsLanguage = (value) => {
        if(value == "id"){
            router.push(router.asPath, router.asPath, {locale : "id"})
            setLanguage("id")
        }else if(value == "en"){
            router.push(router.asPath, router.asPath, {locale : "en"})
            setLanguage("en")
        }
    }

    const handlerSave = async () => {
        // update data record:
        const recordTotal = context.dataDocumentation.errorLogs
        recordTotal.forEach(async (val, key) => {
            console.log(val);
            val.urutan = key + 1
            await handlerPutErrorLogs(val)
        });


        // update data MOM
        const momTotal = JSON.parse(JSON.stringify(context.dataDocumentation))
        delete momTotal.errorLogs
        await handlerPutErrorKnowledge(momTotal)
        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil',
            showConfirmButton: false,
            timer: 1000
        })
    }

    const handlerPinned = () => {
        context.dataDocumentation.pin = !context.dataDocumentation.pin
        context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerLock = () => {
        context.dataDocumentation.privacy = context.dataDocumentation.privacy == "private" ? "public":"private"
        context.setDataDocumentation(context.dataDocumentation)
    }


  return (
    <nav className="fixed w-full bg-white shadow dark:bg-dark z-50">
    <div className="contain px-6 py-2">
        <div className="-mx-3 whitespace-nowrap scroll-hidden flex items-center justify-between">
            <div className="gap-1 grid grid-flow-col items-center">
                <a href={`/usr/workspaces/project/${context.dataDocumentation.name}?id=${context.dataDocumentation.projectID}`} className="text-2xl font-bold text-zinc-500 dark:text-white lg:text-sm cursor-pointer"><span className="font-extrabold text-green-500 text-4xl inline-block">G</span>Error Knowledge</a>
            </div>
            <div className="flex items-center gap-5">
                <button onClick={() => handlerPinned()} title="Pinned">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} className={`w-6 h-6 ${context.dataDocumentation.pin ? "fill-yellow-300 stroke-yellow-300":""}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </button>

                <button onClick={() => handlerLock()} title="Setting Privacy" className="flex items-center gap-1 capitalize text-sm text-zinc-500">
                    <svg fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${context.dataDocumentation.privacy == "private" ? "":"hidden"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <svg fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${context.dataDocumentation.privacy == "public" ? "":"hidden"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {context.dataDocumentation.privacy}
                </button>
                <button title="Color"><FaPalette className="w-4 h-4"/></button>
                <button title="Print"><FaPrint className="w-4 h-4"/></button>
                <button title="Collaboration"><FaUserPlus className="w-4 h-4"/></button>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex -space-x-2.5">
                        <span className="w-8 h-8 border rounded-full bg-zinc-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase">Z</span>
                        <span className="w-8 h-8 border rounded-full bg-red-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase">C</span>
                        <span className="w-8 h-8 border rounded-full bg-yellow-500 border-zinc-300 flex items-center justify-center font-semibold text-sm text-white uppercase">D</span>
                        <span className="flex items-center justify-center w-8 h-8 font-semibold border rounded-full bg-zinc-50 text-zinc-800 border-zinc-300">+3</span>
                    </div>
                </div>
                <button onClick={() => handlerSave()} className="bg-primary rounded-md text-white px-2 py-1 font-semibold">
                    {lang("save")}
                </button>
            </div>
        </div>
    </div>
</nav>
  )
}
