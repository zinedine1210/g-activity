import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Suspense, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EditorErrorKnowledge from "../../../components/ErrorKnowledge/EditorErrorKnowledge";
import NavbarErrorKnowledge from "../../../components/ErrorKnowledge/NavbarErrorKnowledge";
import Layout from "../../../components/Layouts/Layout";
import { MyContext, urlData } from "../../../context/MyProvider";


function ErrorKnowledge(props) {
    const {t} = useTranslation("common")
    const context = useContext(MyContext)

    useEffect(() => {
        console.log(props.data);
        context.setDataDocumentation(props.data)
    }, [])


    const handlerAddSize = () => {
      const sizenow = context.dataDocumentation.size
      if(sizenow == 3){
        return alert("Invalid")
      }
      context.dataDocumentation.size = sizenow + 1
      context.setDataDocumentation(context.dataDocumentation)
    }

    const handlerDeleteSize = () => {
      const sizenow = context.dataDocumentation.size
      if(sizenow == 1){
        return alert("Invalid")
      }
      context.dataDocumentation.size = sizenow - 1
      context.setDataDocumentation(context.dataDocumentation)
    }

    if(context.dataDocumentation){
    return (
      <Layout title={"ERROR KNOWLEDGE EDITOR"} desc="DESKRIPSI ERROR KNOWLEDGE" lang={t}>
        <NavbarErrorKnowledge lang={t}/>
        <Suspense fallback={"Loading"}>
          <div className="w-full h-screen overflow-y-scroll pt-20 pb-56 bg-zinc-100 dark:bg-darkSecondary">
            <div className={`bg-white px-5 md:px-20 py-10 shadow-md rounded-lg mx-auto relative w-1/2`}>
              <EditorErrorKnowledge />
            </div>
          </div>
        </Suspense>
      </Layout>
    )
    }
}

export async function getServerSideProps({ locale, query }) {
    const data = await fetch(`${urlData}/errorKnowledge?id=${query.id}`).then(res => res.json())
  
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        data:data[0]
        // Will be passed to the page component as props
      }
    };
  }
  
export default ErrorKnowledge
