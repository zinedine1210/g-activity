import { useContext } from "react"
import Seo from "../seo"
import Navbar2 from "../Templates/Navbar2"
import ModalWorkspace from "../Workspaces/ModalWorkspace"
import Drawer from "./Drawer"
import { MyContext } from "../../context/MyProvider"

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
        <Navbar2 profileData={profileData}/>
        <Drawer profileData={profileData}/>
        {children}
        {
          context.activeWorkspace ? 
            <ModalWorkspace profileData={profileData}/>
          :""
        }
      </section>
    </>
  )
}
