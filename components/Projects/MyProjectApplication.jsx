import { urlData } from "../../context/MyProvider";
import { fetcherData } from "../../utils/function";
import { useDocumentation, useMom, useNote } from "../../utils/swr"
import CardDocumentation from "../Projects/CardDocumentation"
import useSWR from "swr"
import CardNote from "./CardNote";
import SkeletonCardApplication from "./SkeletonCardApplication";
import CardMOM from "../Projects/CardMOM"


export default function MyProjectApplication({ data, profileData }) {
    const dataDocumentation = useDocumentation(1, JSON.parse(localStorage.getItem("XA")), data.id)
    const dataNote = useNote(1, JSON.parse(localStorage.getItem("XA")), data.id)
    const dataMOM = useMom(1, JSON.parse(localStorage.getItem("XA")), data.id)
    const dataErrorKnowledge = useSWR(`${urlData}/errorKnowledge?projectID=1677590624521760359869`, fetcherData)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-20">
            {
                (profileData['_bitws']['view'] & profileData['_feature']['ga_documentation']) ? <>{
                    dataDocumentation ? !dataDocumentation.isLoading ? dataDocumentation?.data?.data.map((item, key) => {
                        return <CardDocumentation key={key} item={item} profileData={profileData} />
                    })
                        :
                        new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                        :new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                }</> : null
            }

            {
                (profileData['_bitws']['view'] & profileData['_feature']['ga_note']) ? <>  {
                    dataNote ? !dataNote.isLoading ? dataNote?.data?.data.map((item, key) => {
                        return <CardNote key={key} item={item} profileData={profileData} />
                    })
                        :
                        new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                        :
                        new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                }</> : null
            }

            {
                (profileData['_bitws']['view'] & profileData['_feature']['ga_mom']) ? <> {
                    dataMOM ? !dataMOM.isLoading ? dataMOM?.data?.data.map((item, key) => {
                        return <CardMOM key={key} item={item} profileData={profileData} />
                    })
                        :
                        new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                        :new Array(4).fill("mantap").map((item, key) => {
                            return <SkeletonCardApplication key={key} />
                        })
                }</> : null
            }
        </div>
    )
}