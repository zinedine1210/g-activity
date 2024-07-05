import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSignOutAlt, FaUserEdit } from "react-icons/fa"
import { useContext } from "react";
import { MyContext } from "../../context/MyProvider";
import AuthRepository from "../../repositories/AuthRepository";
import { useWorkspaces } from "../../utils/swr";
import Swal from "sweetalert2";
import WorkspacesRepository from "../../repositories/WorkspacesRepository";
import { mutate } from "swr";


export default function Navbar2(props) {
  const context = useContext(MyContext)
  const [scroll, setScroll] = useState(false)
  const [navbar, setNavbar] = useState(false)
  const router = useRouter()
  const defaultLocale = router.locale
  const [language, setLanguage] = useState(defaultLocale)
  const {theme, setTheme} = useTheme()
  const dataInviteWorkspace = useWorkspaces(3, JSON.parse(localStorage.getItem("XA")))


    useEffect(() => {
        window.onscroll = function () {
            const header = document.getElementById("header")
            const fixedNav = header.offsetTop + 100
    
            if (window?.pageYOffset > fixedNav) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }
      }, [])

    const settingsLanguage = (value) => {
        if(value == "id"){
            router.push(router.asPath, router.asPath, {locale : "id"})
            setLanguage("id")
        }else if(value == "en"){
            router.push(router.asPath, router.asPath, {locale : "en"})
            setLanguage("en")
        }
    }

    const handlerLogout = async () => {
      const getXA = JSON.parse(localStorage.getItem("XA"))
      if(getXA){
        const result = await AuthRepository.postLogout({"XA":getXA})
        if(result.type == "success" || result.status == 0 || result.status == "Logged out"){
          localStorage.removeItem("XA")
          localStorage.removeItem("profileData")
          router.push("/")

          Swal.fire({
            icon:"info",
            title:"Logout",
            timer:1500,
            showConfirmButton:false
          })
        }
        console.log(result);
      }else{
        router.push("/")
      }
    }

    const handlerApprove = async (item) => {
        // console.log(item, profileData);
        if(item.hasOwnProperty("countMembers")){
            const find = item.countMembers.find(res => {
                return res.uid == props.profileData.id
            })
            
            const result = await WorkspacesRepository.acceptInvitation({xa:JSON.parse(localStorage.getItem("XA")), id:find.id, workspace_id:item.id})
            console.log(result);
            if(result.data.type == "success"){
                const newData = JSON.parse(JSON.stringify(item))
                delete newData.countMembers

                mutate([2, JSON.parse(localStorage.getItem("XA"))], cache => {
                    console.log(cache);
                    cache.data.push(newData)
                    return cache
                }, false)

                mutate([3, JSON.parse(localStorage.getItem("XA"))], cache => {
                    const deleteFind = cache.data.filter(res => {
                        return res.id != item.id
                    })
                    console.log(deleteFind);
                    cache.data = deleteFind
                    return cache
                }, false)

                context.setDataDocumentation(context.dataDocumentation)
                Swal.fire({
                    icon:"success",
                    title:"Successfully Approved",
                    text:"The workspace will be added to your page",
                    timer:1500,
                    showConfirmButton:false
                })
            }
        }
    }

    const dataInvite = dataInviteWorkspace?.data?.data ?? []
  return (
    <section id="header" className={`${navbar ? "bg-white dark:bg-darkPrimary" : "bg-white dark:bg-darkPrimary"} w-full z-40 border-b border-zinc-500 border-opacity-30 ${scroll ? "transition-transform fixed -top-20 translate-y-20 ease-in-out duration-500 navbar-fixed" : "absolute top-0 bg-white dark:bg-darkPrimary border-b border-zinc-500 border-opacity-30"}`}>
      <div className="my-4 px-3 md:px-5">
        <div className="md:hidden flex items-center justify-between">
          <button aria-label="menu" onClick={() => context.setData({...context, drawer:true})} className="bg-blue-500 w-10 h-10 rounded-md p-2">
            <svg className="w-3 h-3 stroke-black dark:stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div className={`flex gap-1`}>
            <span className="font-extrabold text-green-500 text-4xl block">G</span>
            <p className="self-end text-xs font-extrabold uppercase mb-1">Activity</p>
          </div>
          <div className="relative group">
              <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <div className="w-80 bg-white rounded-md shadow-lg dark:bg-dark p-2 invisible group-hover:visible absolute right-0 hover:visible group-hover:translate-y-0 translate-y-3 transition-all top-10 delay-300 opacity-0 group-hover:opacity-100">
                  <h1 className="font-semibold text-center mb-5 flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Notification</h1>
                  <div className="flex items-center justify-center gap-2 mb-5">
                      <button className="w-1/2 text-center text-sm border-b-2 border-primary pb-2">Undangan</button>
                      <button className="w-1/2 text-center text-sm border-b-2 border-zinc-100 pb-2">Tawaran</button>
                  </div>
                  <div className="w-full border-b pb-3 flex items-center gap-3 mb-1">
                      <span className="w-8 h-8 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
                      <p className="w-full text-xs text-zinc-600 dark:text-zinc-300">Akun anda telah teraktivasi, sekarang anda bisa mulai buat Workspace</p>
                  </div>
                  {
                    dataInvite.map((item, key) => {
                      return (
                        <div key={key} className="w-full border-b py-2 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <h1 className="text-sm font-bold">{item.name}</h1>
                            <button className="bg-blue-500 py-1 px-1 text-xs font-bold text-white rounded-md hover:bg-blue-300 transition-all duration-300" onClick={() => handlerApprove(item)}>Approve</button>
                          </div>
                          <p className="w-full text-xs text-zinc-600 dark:text-zinc-300">Anda menerima undangan ke dalam workspace <span className="font-bold">{item.name}</span></p>
                        </div>
                      )
                    })
                  }
                  <button className="text-center text-sm tracking-wider w-full mt-2">Lihat Semua</button>
              </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => context.setData({...context, drawer:true})} className="bg-blue-500 w-10 h-10 rounded-md p-2 text-white shadow-md"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg></button>
          <Link href={"/usr"}>
            <div className={`${scroll ? "hidden":"block"} flex gap-1`}>
              <span className="font-extrabold text-green-500 text-4xl block">G</span>
              <p className="self-end text-xs font-extrabold uppercase mb-1">Activity</p>
            </div>
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-8">
              {/* <h1 className="font-semibold text-zinc-500 capitalize dark:text-zinc-300">{router.asPath.split("?")[0]}</h1> */}
            </div>
            <div className="flex items-center gap-10">
              {/* <div className="flex items-center relative gap-2 group">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="font-semibold">{language == "id" ? "Indonesia":"Inggris"}</h1>
                <svg className="w-4 h-4 group-hover:rotate-180 transition-all duration-300 delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                <div className="bg-white rounded-md shadow-md dark:bg-dark p-2 invisible group-hover:visible absolute w-full hover:visible group-hover:translate-y-0 translate-y-3 transition-all top-10 delay-300">
                <button className="hover:bg-basic w-full rounded-md py-1 dark:hover:bg-darkPrimary text-start" onClick={() => settingsLanguage("id")}>Indonesia</button>
                <button className="hover:bg-basic w-full rounded-md py-1 dark:hover:bg-darkPrimary text-start" onClick={() => settingsLanguage("en")}>Inggris</button>
                </div>
              </div> */}
              <div className="relative group">
                  <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <div className="w-80 bg-white rounded-md shadow-lg dark:bg-dark p-2 invisible group-hover:visible absolute right-0 hover:visible group-hover:translate-y-0 translate-y-3 transition-all top-10 delay-300 opacity-0 group-hover:opacity-100">
                      <h1 className="font-semibold text-center mb-5 flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Notification</h1>
                      <div className="flex items-center justify-center gap-2 mb-5">
                          <button className="w-1/2 text-center text-sm border-b-2 border-primary pb-2">Undangan</button>
                          <button className="w-1/2 text-center text-sm border-b-2 border-zinc-100 pb-2">Tawaran</button>
                      </div>
                      <div className="w-full border-b pb-3 flex items-center gap-3 mb-1">
                          <span className="w-8 h-8 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
                          <p className="w-full text-xs text-zinc-600 dark:text-zinc-300">Akun anda telah teraktivasi, sekarang anda bisa mulai buat Workspace</p>
                      </div>
                      {
                        dataInvite.map((item, key) => {
                          return (
                            <div className="w-full border-b py-2 pb-3" key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <h1 className="text-sm font-bold">{item.name}</h1>
                                <button className="bg-blue-500 py-1 px-1 text-xs font-bold text-white rounded-md hover:bg-blue-300 transition-all duration-300" onClick={() => handlerApprove(item)}>Approve</button>
                              </div>
                              <p className="w-full text-xs text-zinc-600 dark:text-zinc-300">Anda menerima undangan ke dalam workspace <span className="font-bold">{item.name}</span></p>
                            </div>
                          )
                        })
                      }
                      <button className="text-center text-sm tracking-wider w-full mt-2">Lihat Semua</button>
                  </div>
              </div>
              <div className="flex items-center justify-center gap-3 relative">
                <svg onClick={() => setTheme("dark")} className={`w-7 h-7 absolute cursor-pointer peer ${theme == "light" ? "translate-y-0 opacity-100 visible":" translate-y-10 invisible opacity-0"} rotate-180 transition-all duration-500 ease-in-out`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
    
                {/* <!-- moon icon --> */}
                <svg onClick={() => setTheme("light")} className={`fill-white w-7 h-7 absolute cursor-pointer ${theme == "dark" ? "translate-y-0 opacity-100 visible":" translate-y-10 invisible opacity-0"} transition-all duration-500 ease-in-out`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
              </div>
              <div className="relative group">
                <Link href={"/usr/profile"}>
                  <div className="relative flex items-center gap-2 cursor-pointer group">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center uppercase text-white bg-zinc-500">{props.profileData.hasOwnProperty("username") ? props.profileData.username.charAt(0):""}</button>
                    <div>
                      <h1 className="text-sm first-letter:uppercase">{props.profileData.hasOwnProperty("username") ? props.profileData.username.length > 10 ? props.profileData.username.substring(0,10)+"...":props.profileData.username :""}</h1>
                      <p className="text-xs text-zinc-500 font-semibold dark:text-zinc-300">{props.profileData.hasOwnProperty("org_name") ? props.profileData.org_name :""}</p>
                    </div>
                  </div>
                </Link>
                <div className="bg-white dark:bg-dark w-44 rounded-md shadow-lg group-hover:visible invisible opacity-0 group-hover:opacity-100 absolute top-full right-0 transition-all duration-300 group-hover:translate-y-0 translate-y-10 delay-300 overflow-hidden py-1">
                  <button className="px-5 w-full text-start py-2 flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-darkSecondary transition-all duration-300">
                    <FaUserEdit />
                    <h1 className="text-sm">Profile</h1>
                  </button>
                  <button onClick={() => handlerLogout()} className="px-5 w-full text-start py-2 flex items-center gap-2 hover:bg-red-100 transition-all duration-300 text-red-500">
                    <FaSignOutAlt />
                    <h1 className="text-sm">Logout</h1>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
