import { useContext, useEffect } from "react";
import { useRouter } from 'next/router'
import NotesEditor from "../../../components/Notes/NotesEditor";
import { MyContext } from "../../../context/MyProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NoteRepository from "../../../repositories/NoteRepository";
import NotFound from "@components/NotFound/NotFound";

function HalamanNote(props) {
  const context = useContext(MyContext)
  const router = useRouter();
  const { id } = router.query;
  const { profileData } = props

  useEffect(() => {
    async function getData() {
      const result = await NoteRepository.getNoteByID({ xa: JSON.parse(localStorage.getItem("XA")), id: id })
      if (result.status == 0) {
        console.log("result notes", result);
        const members = await NoteRepository.getTeam({ xa: JSON.parse(localStorage.getItem("XA")), id: id, type: 1 })
        console.log("result note members", members);
        result.data.assigns = members.data
        context.setDataDocumentation(result.data)
      }
    }

    context.setDataDocumentation(null);
    if (id) {
      getData()
    }
  }, [id])

  // check permission view note
  if ((profileData['_bitws']['view'] & profileData['_feature']['ga_note']) == 0) {
    return <NotFound />
  }

  if (context.dataDocumentation)
    return (
      <NotesEditor data={context.dataDocumentation} profileData={profileData} />
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