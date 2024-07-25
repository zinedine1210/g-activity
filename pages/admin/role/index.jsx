import { FaUsers } from "react-icons/fa";
import MainRole from "../../../components/Admin/Role/MainRole";
import Layout2 from "@components/Layouts/Layout2";

export default function RoleAdmin({ profileData }) {
  return (
    <Layout2 title={"Role Setting"} desc="Halaman Pengaturan Role" profileData={profileData}>
        <div className="p-10">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-5">
                <FaUsers className="text-4xl text-blue-500"/>
                <h1 className="text-2xl font-bold text-zinc-500">Role</h1>
            </header>

            <section>
                <MainRole profileData={profileData}/>
            </section>
        </div>
    </Layout2>
  )
}
