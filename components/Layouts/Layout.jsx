import Seo from "../seo"

export default function Layout({children, title, desc, image, lang}) {
  return (
    <>
      <Seo 
        title={title}
        description={desc}
        image={image ? image:null}
      />

      <section>
        {children}
      </section>
    </>
  )
}
