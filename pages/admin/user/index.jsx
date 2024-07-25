import { FaUser } from "react-icons/fa";
import LayoutAdmin from "../../../components/Admin/Layout/LayoutAdmin";
import MainUser from "../../../components/Admin/User/MainUser";
import Layout2 from "@components/Layouts/Layout2";

export default function UserAdmin({ profileData }) {
  return (
    <Layout2 title={"User Collection"} desc="Halaman User Collection" profileData={profileData}>
        <div className="p-10">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-3">
                <FaUser className="text-3xl text-blue-500"/>
                <h1 className="text-xl font-bold text-zinc-500">Users</h1>
            </header>

            <section>
                <MainUser profileData={profileData}/>
            </section>
        </div>
    </Layout2>
  )
}
