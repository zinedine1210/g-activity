import {G} from "../../globals/global.min.js"
import { useRouter } from "next/router"
import { useState } from "react"
import AuthRepository from "../../repositories/AuthRepository.js"
import Swal from "sweetalert2"

export default function Login({mounted}) {
    const Router = useRouter()
    const [username, setUsername] = useState(null)
    const [step, setStep] = useState(1)
    const [pass, setPass] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hide, setHide] = useState(false)


    const handlerSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        
        if(step == 1){
            setLoading(false)
            document.getElementById("password").focus()
            setStep(2)
        }else{
            // let uus = G().enc(JSON.stringify({
            //     'user': username,
            //     'pass': pass
            // }), 2, 6)
            // const pwd = G().rndStr(uus.length, 1, 6).substring(0, uus.length).replace(/\W/g, "")
    
            let payload = {
                'user': username,
                'pass': pass
            }

            const result = await AuthRepository.postLogin({"uspw":JSON.stringify(payload)})

            console.log("result adalah", result)
            if(!('status' in result)){
                console.log("masa kesini")
                setLoading(false)
                return Swal.fire({
                    icon:"warning",
                    title:"The service is currently undergoing maintenance. Please try again later",
                    timer:1500
                })
            }

            if(result.status == -1 || result.message == "Account not found"){
                Swal.fire({
                    icon:"warning",
                    title:"Account not found",
                    timer:1500
                })
            }else{
                localStorage.setItem("XA", JSON.stringify(result.token))
                Router.push("/usr")
                Swal.fire({
                    icon:"info",
                    title:"Login",
                    text:`Welcome ${username}`,
                    timer:1200
                })
            }
            setStep(1)
            setLoading(false)
        }
    }

    const handlerHideShow = () => {
        const el = document.getElementById("password")
        if(el.type === 'password') {
            el.type = 'text';
        } else {
            el.type = 'password';
        }
        setHide(hide ? false:true)
    }

  return (
    <form className="mt-6" onSubmit={(e) => handlerSubmit(e)}>
        <div className={`${step == 1? "translate-x-0":"translate-x-20 sr-only opacity-100"} transition-all`}>
            <label htmlFor="usernameInput" className="block text-sm text-zinc-800 dark:text-zinc-200">Username</label>
            <input type="text" disabled={mounted ? true:false} id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)} className="disabled:bg-zinc-200 block w-full px-4 py-2 mt-2 text-zinc-700 bg-white border rounded-lg dark:bg-dark dark:text-white dark:border-darkSecondary focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div className={`${step == 2? "translate-x-0":"translate-x-20 sr-only opacity-100"} transition-all`}>
            <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm text-zinc-800 dark:text-zinc-200">Password</label>
                <a href="#" className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline">Forget Password?</a>
            </div>

            <button className="absolute right-2 bottom-2 inline-block" type="button" onClick={() => handlerHideShow()}><svg className={`${hide ? "opacity-0 sr-only":"opacity-100"} transition-all duration-500 w-6 h-6 stroke-zinc-600 dark:stroke-zinc-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <svg className={`${hide ? "opacity-100":"opacity-0 sr-only"} transition-all duration-500 w-6 h-6 stroke-zinc-600 dark:stroke-zinc-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg></button>

            <input type="password" id="password" value={pass} onChange={(e) => setPass(e.target.value)} className="block w-full px-4 py-2 mt-2 text-zinc-700 bg-white border rounded-lg dark:bg-dark dark:text-white dark:border-darkSecondary focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>


        {
            !mounted ? loading ?
            <div role="status" className="w-full py-2">
                <svg aria-hidden="true" className="w-6 h-6 mx-auto text-zinc-200 animate-spin dark:text-zinc-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            :
            <div className={`flex items-center gap-2 mt-4`}>
                <button type="button" onClick={() => setStep(1)} className={`${step == 2 ? "w-20":"w-0 sr-only"} transition-all px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize duration-300 transform bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-zinc-300 focus:ring-opacity-50`}>
                Back
                </button>
                
                <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-darkSecondary rounded-lg hover:bg-dark focus:outline-none focus:ring focus:ring-dark focus:ring-opacity-50">
                    Sign In
                </button>
            </div>
            :
            <button disabled className="w-full px-6 py-2.5 mt-4 text-sm font-medium tracking-wide text-white capitalize focus:outline-none rounded-lg bg-zinc-600">
                Under Maintenance!
            </button>
        }
        <p className="mt-4 text-xs font-light text-center text-zinc-400"> Don't have an account? <a href="#" className="font-medium text-zinc-700 dark:text-zinc-200 hover:underline">Create One</a></p>
    </form>
  )
}
