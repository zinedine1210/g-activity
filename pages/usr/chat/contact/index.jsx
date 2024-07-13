import LayoutChat from '@components/Chat/LayoutChat'
import PanelContact from '@components/Chat/PanelContact'
import React from 'react'

export default function HalamanContact({ profileData, roomId }) {
  return (
    <LayoutChat roomId={roomId} profileData={profileData} title={`Contact`} desc={""}>
      <PanelContact roomId={roomId} profileData={profileData}/>
    </LayoutChat>
  )
}
export async function getServerSideProps({ query }) {
  return {
    props : {
      roomId: query.roomId ?? null
    }
  };
}