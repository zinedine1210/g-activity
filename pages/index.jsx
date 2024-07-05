import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Login from "../components/Pages/Login";
import Seo from "../components/seo"
import Image from "next/image";
import Link from "next/link";

export default function Auth(props) {
  const router = useRouter()
  const [mounted, setMouted] = useState(false)
  
  useEffect(() => {
    const getXA = JSON.parse(localStorage.getItem("XA"))
    if(getXA){
      console.log(props);
      if(props.profileData == "failed"){
        setMouted(true)
      }else{
        router.push("/usr")
      }
    }
  }, [])

  return (
    <>
      <Seo 
      title={"AUTH GACTIVITY"}
      description="HALAMAN AUTHENTIKASI UNTUK MASUK GACTIVITY"
      />
      <section className="h-screen max-h-screen w-full">
        <div className="flex justify-center items-end mx-auto fixed top-5 left-5">
          <img className="w-auto h-16" src="/images/gnusa.png" alt=""/>
          <h1 className="mb-1 font-bold text-2xl text-zinc-500 dark:text-white">Activity</h1>
        </div>
        {
          mounted ?
          <div className="w-full text-white bg-red-500 fixed top-0">
              <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                  <div className="flex">
                      <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current">
                          <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z">
                          </path>
                      </svg>

                      <p className="mx-3">Sorry the website is currently under maintenance, please be patient.</p>
                  </div>

                  <button onClick={() => setMouted(false)} className="p-1 transition-colors duration-300 transform rounded-md hover:bg-opacity-25 hover:bg-gray-600 focus:outline-none">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                  </button>
              </div>
          </div>
          :""
        }
        <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-dark">
          <div className="w-full max-w-lg px-10 py-16 m-auto mx-auto bg-white rounded-2xl shadow-2xl dark:bg-darkPrimary">
              
              <div className="mb-3">
                <h1 className="font-bold text-4xl">Sign In</h1>
                <p className="">Stay updated on your professional world</p>
              </div>

              <Login mounted={mounted}/>

              <div className="flex items-center justify-between mt-8">
                  <span className="w-1/5 border-b dark:border-zinc-600 lg:w-1/5"></span>

                  <Link href={`/coba2?id=${encodeURIComponent("zinedine ziddan")}`} className="text-xs text-center text-zinc-500 uppercase dark:text-zinc-400 hover:underline">
                      or with Social Media
                  </Link>

                  <span className="w-1/5 border-b dark:border-zinc-400 lg:w-1/5"></span>
              </div>

              <div className="flex items-center mt-6 -mx-2">
                  <button type="button" className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                      <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z">
                          </path>
                      </svg>

                      <span className="hidden mx-2 sm:inline">Continue with Google</span>
                  </button>

                  <a href="#" className="p-2 mx-2 text-sm font-medium text-zinc-500 transition-colors duration-300 transform bg-zinc-300 rounded-lg hover:bg-zinc-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="fill-current w-5 h-5">
                      <path d="M9.438 31.401c-0.63-0.422-1.193-0.938-1.656-1.536-0.516-0.615-0.984-1.266-1.422-1.938-1.021-1.495-1.818-3.125-2.375-4.849-0.667-2-0.99-3.917-0.99-5.792 0-2.094 0.453-3.922 1.339-5.458 0.651-1.198 1.625-2.203 2.797-2.906 1.135-0.708 2.453-1.094 3.786-1.12 0.469 0 0.974 0.068 1.51 0.198 0.385 0.109 0.854 0.281 1.427 0.495 0.729 0.281 1.13 0.453 1.266 0.495 0.427 0.156 0.786 0.224 1.068 0.224 0.214 0 0.516-0.068 0.859-0.172 0.193-0.068 0.557-0.188 1.078-0.411 0.516-0.188 0.922-0.349 1.245-0.469 0.495-0.146 0.974-0.281 1.401-0.349 0.521-0.078 1.036-0.104 1.531-0.063 0.948 0.063 1.813 0.266 2.589 0.557 1.359 0.547 2.458 1.401 3.276 2.615-0.349 0.214-0.667 0.458-0.969 0.734-0.651 0.573-1.198 1.25-1.641 2.005-0.573 1.026-0.865 2.188-0.859 3.359 0.021 1.443 0.391 2.714 1.12 3.813 0.521 0.802 1.208 1.484 2.047 2.047 0.417 0.281 0.776 0.474 1.12 0.604-0.161 0.5-0.333 0.984-0.536 1.464-0.464 1.078-1.016 2.109-1.667 3.083-0.578 0.839-1.031 1.464-1.375 1.88-0.536 0.635-1.052 1.12-1.573 1.458-0.573 0.38-1.25 0.583-1.938 0.583-0.469 0.021-0.932-0.042-1.38-0.167-0.385-0.13-0.766-0.271-1.141-0.432-0.391-0.177-0.792-0.333-1.203-0.453-0.51-0.135-1.031-0.198-1.552-0.198-0.536 0-1.057 0.068-1.547 0.193-0.417 0.12-0.818 0.26-1.214 0.432-0.557 0.234-0.927 0.391-1.141 0.458-0.427 0.125-0.87 0.203-1.318 0.229-0.693 0-1.339-0.198-1.979-0.599zM18.578 6.786c-0.906 0.453-1.771 0.646-2.63 0.583-0.135-0.865 0-1.75 0.359-2.719 0.318-0.828 0.745-1.573 1.333-2.24 0.609-0.693 1.344-1.266 2.172-1.677 0.88-0.453 1.719-0.698 2.521-0.734 0.104 0.906 0 1.797-0.333 2.76-0.307 0.854-0.76 1.641-1.333 2.344-0.583 0.693-1.302 1.266-2.115 1.682z"></path>
                    </svg>
                  </a>
                  
              </div>

          </div>
        </div>
      </section>
    </>
  )
}
