import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../../../context/MyProvider'
import SidebarAdmin from './SidebarAdmin'
import Seo from '../../seo'
import NavbarAdmin from './NavbarAdmin'
import { useRouter } from 'next/router'
import { Notify } from '@utils/scriptApp'
import Swal from 'sweetalert2'

export default function LayoutAdmin({ children, image, desc, title, profileData }) {
    const context = useContext(MyContext)
    const [active, setActive] = useState(null)
    const router = useRouter()


    useEffect(() => {
        if(!active){
            console.log(profileData)
            const bitws = profileData._bitws
            const featureaccess = profileData._feature
            console.log(router.pathname)
            let isdeny = false
            switch (router.pathname) {
                case "/admin/user":
                    isdeny = Number(featureaccess["_user"] & bitws["view"]) == 0 ? true:false
                    console.log(featureaccess["_user"] & bitws["view"])
                    if(isdeny){ // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/role":
                    isdeny = Number(featureaccess["_role"] & bitws["view"]) == 0 ? true:false
                    if(isdeny){ // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/feature":
                    isdeny = Number(featureaccess["_feature"] & bitws["view"]) == 0 ? true:false
                    if(isdeny){ // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
                case "/admin/enum":
                    isdeny = Number(featureaccess["_enum"] & bitws["view"]) == 0 ? true:false
                    if(isdeny){ // cek apakah dia memiliki akses ke menu ini pada view
                        Swal.fire({
                            title: "Unauthorize!!",
                            text: "You don't have permission to access this page",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 2000,
                            position: "top-right"
                        })
                        router.push("/usr")
                    }
                    break;
            
                default:
                    break;
            }
            setActive(true)
        }
    }, [active])

    if(active)
  return (
    <>
        <Seo
            title={title}
            description={desc}
            image={image ? image:null}
        />
        <section className='flex '>
            <navigation className='w-[400px] h-screen overflow-y-hidden p-5'>
                <SidebarAdmin profileData={profileData}/>
            </navigation>
            <div className='h-screen max-h-screen overflow-y-auto w-full'>
                <NavbarAdmin />
                {children}
            </div>
        </section>
    </>
  )
}
