import LayoutChat from "@components/_ChatV1/LayoutChat";
import PanelList from "@components/_ChatV1/PanelList";

export default function HalamanChat({ profileData, roomId }) {

  return (
    <LayoutChat roomId={roomId} profileData={profileData} title={`All Chat`} desc={""}>
      <PanelList roomId={roomId} profileData={profileData}/>
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