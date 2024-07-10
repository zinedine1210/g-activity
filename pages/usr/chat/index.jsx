import LayoutChat from "@components/Chat/LayoutChat";
import PanelList from "@components/Chat/PanelList";
import { MyContext } from "context/MyProvider";
import { useContext } from "react";

export default function HalamanChat({ profileData }) {
    const context = useContext(MyContext)

  return (
    <LayoutChat profileData={profileData} title={`All Chat`} desc={""}>
      <PanelList profileData={profileData}/>
    </LayoutChat>
  )
}
