import Seo from "../seo"
import SidebarMenu from "./SidebarMenu"

export default function Layout({children, title, desc, image, lang, profileData}) {
  return (
    <>
      <Seo 
        title={title}
        description={desc}
        image={image ? image:null}
      />

      <section className="flex w-full h-screen overflow-hidden">
        {/* <SidebarMenu profileData={profileData}/> */}
        <div className="w-full">
          {children}
        </div>
      </section>
    </>
  )
}
