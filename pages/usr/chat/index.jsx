import LayoutChat from "@components/Chat/LayoutChat";
import PanelList from "@components/Chat/PanelList";

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