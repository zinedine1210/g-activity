import LayoutChat from '@components/Chat/LayoutChat'
import PanelContact from '@components/Chat/PanelContact'
import React from 'react'

export default function HalamanContact({ profileData }) {
  return (
    <LayoutChat profileData={profileData} title={`Contact`} desc={""}>
      <PanelContact profileData={profileData}/>
    </LayoutChat>
  )
}
