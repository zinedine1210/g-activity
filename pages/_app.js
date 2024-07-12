import { ThemeProvider } from 'next-themes'
import '../styles/globals.scss'
import "../styles/pencil.css"
import "../styles/loading.css"
import "../styles/loadingchat.css"
import '@utils/noconsole';

// import "../build.css"
import {appWithTranslation} from "next-i18next"
import { useEffect, useState } from 'react'
import {MyProvider} from '../context/MyProvider'
import withAuth from '../components/withAuth'
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import { useRouter } from 'next/router'

// toastify
import "../utils/scriptApp"

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyApp({ Component, pageProps, profileData }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.configure({ easing: 'ease', speed:500, showSpinner:true });
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }
    
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)
    setMounted(true)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router, mounted])

  if(!mounted) return null
  return (
    <ThemeProvider enableSystem={true} attribute="class" defaultTheme='light'>
      <MyProvider>
        <ToastContainer />
        <Component {...pageProps} profileData={profileData} />
      </MyProvider>
    </ThemeProvider>
  )
}

export default appWithTranslation(withAuth(MyApp))