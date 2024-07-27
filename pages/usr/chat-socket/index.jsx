import LayoutChat from "@components/ChatSocket/LayoutChat";
import PanelList from "@components/ChatSocket/PanelList";

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