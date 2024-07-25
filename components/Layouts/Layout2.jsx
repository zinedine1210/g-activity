import { useContext } from "react"
import Seo from "../seo"
import Navbar2 from "../Templates/Navbar2"
import ModalWorkspace from "../Workspaces/ModalWorkspace"
import { MyContext } from "../../context/MyProvider"
import SidebarMenu from "./SidebarMenu"

export default function Layout2({children, title, desc, image, profileData}) {
  const context = useContext(MyContext)
  return (
    <>
      <Seo 
        title={title}
        description={desc}
        image={image ? image:null}
      />

      <section>
        <div className="flex h-screen overflow-hidden">
          <SidebarMenu profileData={profileData}/>
          <div className="overflow-y-auto w-full relative">
            <Navbar2 profileData={profileData}/>
            {children}
          </div>
        </div>
        {
          context.activeWorkspace ? 
            <ModalWorkspace profileData={profileData}/>
          :""
        }
      </section>
    </>
  )
}
