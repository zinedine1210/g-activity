
import { useContext } from "react";
import { useRouter } from 'next/router'
import Layout from "../../../components/Layouts/Layout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Suspense } from "react";
import Sidebar from "../../../components/Templates/Sidebar";
import Main from "../../../components/Content/Main";
import Tools from "../../../components/Content/Tools";
import { MyContext } from "../../../context/MyProvider";
import { useEffect } from "react";
import Navbar from "../../../components/Templates/Navbar";
import DocumentationRepository from "../../../repositories/DocumentationRepository";
import NotFound from "@components/NotFound/NotFound";

function Editor(props) {
  const { t } = useTranslation("common")
  const context = useContext(MyContext)
  const router = useRouter();
  const { id } = router.query;
  const { profileData } = props

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [id]);


  useEffect(() => {
    const getXA = JSON.parse(localStorage.getItem("XA"))
    async function getData() {
      const result = await DocumentationRepository.getDocumentationByID({ xa: getXA, id: id })
      if (result.status == 0) {
        console.log("result adalah", result)

        const members = await DocumentationRepository.getTeam({ id: id, type: 1, xa: JSON.parse(localStorage.getItem("XA")) })
        console.log("apakah ada memberss", members)
        console.log("id data", id)
        // dapatkan data utama documentation file dan member didalamnya
        result.data['assigns'] = members.data
        console.log("set data adalah apaa", context)
        result.data['pages'] = result.data.pages ? result.data.pages : []
        context.setDataDocumentation(result.data)
      }
    }

    context.setDataDocumentation(null);
    console.log("tak ada id", id)
    if (id) {
      getData()
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [id])



  // check permission view documentation
  if ((profileData['_bitws']['view'] & profileData['_feature']['ga_documentation']) == 0) {
    return <NotFound />
  }

  return (
    <Layout title="HOME" desc="HALAMAN UTAMA" lang={t} profileData={props.profileData}>
      <Navbar lang={t} profileData={props.profileData}/>
      {
        context.dataDocumentation &&
          <Suspense fallback={"Loading"}>
            <section className="flex bg-zinc-100 dark:bg-darkSecondary relative">
              <Sidebar lang={t} />
              <div className="w-full h-screen overflow-y-scroll pb-56">
                <Tools lang={t} />
                <Main lang={t} />
              </div>
            </section>
          </Suspense>
          
      }
    </Layout>
  )
}



export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      query: context.query
      // Will be passed to the page component as props
    }
  };
}

export default Editor