import { useContext, useEffect } from "react";
import NotesEditor from "../../../components/Notes/NotesEditor";
import { MyContext } from "../../../context/MyProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NoteRepository from "../../../repositories/NoteRepository";

function HalamanNote(props) {
  const context = useContext(MyContext)

  useEffect(() => {
    async function getData(){
      const result = await NoteRepository.getNoteByID({xa:JSON.parse(localStorage.getItem("XA")), id:props.query.id})
      console.log("notes", result);
      const members = await NoteRepository.getTeam({xa:JSON.parse(localStorage.getItem("XA")), id:props.query.id, type:1})
      console.log(members);
      result.data.assigns = members.data.data
      context.setDataDocumentation(result.data)
    }

    if(!context.dataDocumentation){
      getData()
    }
  },[])

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