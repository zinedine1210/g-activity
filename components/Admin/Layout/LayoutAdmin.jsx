import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../../../context/MyProvider'
import SidebarAdmin from './SidebarAdmin'
import Seo from '../../seo'
import NavbarAdmin from './NavbarAdmin'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

export default function LayoutAdmin({ children, image, desc, title, profileData }) {
    const context = useContext(MyContext)
    const [active, setActive] = useState(null)
    const router = useRouter()


    useEffect(() => {
        if(!active){
            if(!profileData._feature?._role){
                Swal.fire({
                    icon:"info",
                    title:"Unauthorize!!",
                    text:"You dont have permission to access this page",
                    position:"top-right",
                    timer:3000
                })
                router.push("/usr")
            }
        }
    }, [])
  return (
    <>
        <Seo
            title={title}
            description={desc}
            image={image ? image:null}
        />
        <section className='flex'>
            <navigation className='w-[500px] h-screen overflow-y-hidden p-5'>
                <SidebarAdmin />
            </navigation>
            <div className='h-screen max-h-screen overflow-y-auto w-full'>
                <NavbarAdmin />
                {children}
            </div>
        </section>
    </>
  )
}
