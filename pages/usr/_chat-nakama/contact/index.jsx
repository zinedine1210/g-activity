import LayoutChat from '@components/_ChatV1/LayoutChat'
import PanelContact from '@components/_ChatV1/PanelContact'
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