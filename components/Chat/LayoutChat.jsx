import React from 'react'
import PanelSide from './PanelSide'
import MainChat from './MainChat'
import Seo from '@components/seo'

export default function LayoutChat({ children, profileData, title, desc, image }) {
  return (
    <>
      <Seo 
        title={title}
        description={desc}
        image={image ? image:null}
      />
      <section className="w-full h-screen overflow-hidden flex">
          <PanelSide profileData={profileData}/>
          <div className="flex w-full">
            <div className='w-1/3 border-r-2'>
              {children}
            </div>
            <MainChat profileData={profileData}/>
          </div>
      </section>
    </>
  )
}
