import { useContext, useEffect } from "react";
import { useRouter } from 'next/router'
import NotesEditor from "../../../components/Notes/NotesEditor";
import { MyContext } from "../../../context/MyProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NoteRepository from "../../../repositories/NoteRepository";

function HalamanNote(props) {
  const context = useContext(MyContext)
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function getData(){
      const result = await NoteRepository.getNoteByID({xa:JSON.parse(localStorage.getItem("XA")), id:id})
      console.log("result notes", result);
      const members = await NoteRepository.getTeam({xa:JSON.parse(localStorage.getItem("XA")), id:id, type:1})
      console.log("result note members", members);
      result.data.assigns = members.data
      context.setDataDocumentation(result.data)
    }

    context.setDataDocumentation(null);
    if(id){
      getData()
    }
  },[id])

  if(context.dataDocumentation)
  return (
    <NotesEditor data={context.dataDocumentation}/>
  )
}


export async function getServerSideProps({ locale, query }) {

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      query
      // Will be passed to the page component as props
    }
  };
}

export default HalamanNote