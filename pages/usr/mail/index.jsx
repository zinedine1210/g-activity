import LayoutMail from "@components/Mail/LayoutMail";
import PanelList from "@components/Mail/PanelList";

export default function HalamanChat({ profileData, roomId }) {

  return (
    <LayoutMail roomId={roomId} profileData={profileData} title={`Mail`} desc={""}>
      <PanelList roomId={roomId} profileData={profileData}/>
    </LayoutMail>
  )
}

export async function getServerSideProps({ query }) {
  return {
    props : {
      roomId: query.roomId ?? null
    }
  };
}