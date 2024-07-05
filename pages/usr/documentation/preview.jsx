import { useEffect, useState } from "react"
// import Preview from "../../../components/Content/Preview/Preview"
import Sidebar from "../../../components/Content/Preview/Sidebar"
import withAuth from "../../../components/withAuth"


function HalamanPreview(props) {
    const {profileData} = props
    const [data, setData] = useState(null)

    useEffect(() => {
        setData(JSON.parse(localStorage.getItem("value")))
    }, [])

  return (
    <>
        <section className="w-full flex">
            <div className="w-1/6 border bg-black">
                <Sidebar data={data}/>
            </div>
            <div className="w-5/6 flex gap-10 px-20 py-5">
                <div className="w-3/4">
                    {/* <Preview /> */}
                </div>
            </div>
        </section>
    </>
  )
}

export default withAuth(HalamanPreview)