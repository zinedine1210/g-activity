import { useRouter } from 'next/router'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Suspense, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Layout from "../../../components/Layouts/Layout";
import EditorMOM from "../../../components/MOM/EditorMOM";
import NavbarMOM from "../../../components/Templates/NavbarMOM";
import { MyContext } from "../../../context/MyProvider";
import { getSizeWindow } from "../../../utils/function";
import MomRepository from "../../../repositories/MomRepository";


function MinuteOfMeeting(props) {
    const {t} = useTranslation("common")
    const [size, setSize] = useState(1)
    const context = useContext(MyContext)
    const router = useRouter();
    const { id } = router.query;
    

  console.log("emang id apa??", id)

    useEffect(() => {
      async function getData(){
        console.log("disini bangg load lagi")
        console.log(props.query)
        const result = await MomRepository.getMomByID({xa:JSON.parse(localStorage.getItem("XA")), id:id})
        console.log("result mom", result);
        const members = await MomRepository.getTeam({xa:JSON.parse(localStorage.getItem("XA")), id:id, type:1})
        console.log("result mom members", members);
        const participant = await MomRepository.getParticipant({xa:JSON.parse(localStorage.getItem("XA")), momID:id})
        console.log("participant",participant);
        result.data.assigns = members.data
        result.data.participants = participant.data
        result.data.header = [
          {
            "name": "Meeting Result",
            "id": "1678516541022736888695",
            "align": "start",
            "type": "freeText"
          },
          {
            "name": "Target Date",
            "id": "1678516541022488185986",
            "align": "start",
            "type": "datetime"
          },
          {
            "name": "PIC",
            "id": "1678516541022295981233",
            "align": "start",
            "type": "mention"
          },
          {
            "name": "Stated By",
            "id": "1678516541022063365596",
            "align": "start",
            "type": "mention"
          }
        ]
        
        if(result.status != -1){
          context.setDataDocumentation(result.data)
        }
      }
      context.setDataDocumentation(null);
      if(id){
        getData()
      }
    }, [id])


    const handlerAddSize = () => {
      const sizenow = context.dataDocumentation.size
      if(sizenow == 3){
        return alert("Invalid")
      }
      setSize(size + 1)
    }

    const handlerDeleteSize = () => {
      const sizenow = context.dataDocumentation.size
      if(sizenow == 1){
        return alert("Invalid")
      }
      setSize(size - 1)
    }

    return (
      <Layout title={"NOTES EDITOR"} desc="DESKRIPSI NOTES EDITOR" lang={t}>
        <NavbarMOM lang={t}/>
        <Suspense fallback={"Loading"}>
          {
            context.dataDocumentation ?
              <div className="w-full h-screen overflow-y-scroll pt-20 pb-56 bg-zinc-100 dark:bg-darkSecondary">
                <div className={`bg-white px-5 md:px-20 py-10 shadow-md rounded-lg mx-auto relative ${getSizeWindow(size)}`}>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button className="flex items-center justify-center rounded-md w-8 h-8 hover:bg-blue-100 p-2 transition-all duration-300" onClick={() => handlerDeleteSize()}>
                      <FaArrowRight className="w-5 h-5 mr-0.5"/>
                      <FaArrowLeft className="w-5 h-5"/>
                    </button>
                    <button className="flex items-center justify-center rounded-md w-8 h-8 hover:bg-blue-100 p-2 transition-all duration-300" onClick={() => handlerAddSize()}>
                      <FaArrowLeft className="w-5 h-5"/>
                      <FaArrowRight className="w-5 h-5 ml-0.5"/>
                    </button>
                  </div>
                  <EditorMOM />
                </div>
              </div>
            :""
          }
        </Suspense>
      </Layout>
    )
}

export async function getServerSideProps({ locale, query }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        query:query
        // Will be passed to the page component as props
      }
    };
  }
  
export default MinuteOfMeeting
