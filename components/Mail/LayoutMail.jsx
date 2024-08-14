import React, { useContext, useEffect, useState } from 'react'
import PanelSide from './PanelSide'
import MainChat from './MainChat'
import Seo from '@components/seo'
import SidebarMenu from '@components/Layouts/SidebarMenu'
import NotFound from '@components/NotFound/NotFound'

export default function LayoutChat({ children, profileData, title, desc, image, roomId }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (roomId) {
      setMounted(false)
      setTimeout(() => {
        setMounted(true)
      }, 200);
    }
  }, [roomId])

  const mountingMainChat = () => {
    if (mounted)
      return <MainChat roomId={roomId} profileData={profileData} />
  }

  // check profile data
  if (!profileData) {
    return <NotFound />
  }

  return (
    <>
      <Seo
        title={title}
        description={desc}
        image={image ? image : null}
      />
      <section className="w-full h-screen overflow-hidden flex">
        <SidebarMenu profileData={profileData} />
        <PanelSide profileData={profileData} />
        <div className="flex w-full">
          <div className='w-full border-r-2'>
            {children}
          </div>
          {/* <div className='w-full'>
            {
              mountingMainChat()
            }
          </div> */}
        </div>
      </section>
    </>
  )
}
