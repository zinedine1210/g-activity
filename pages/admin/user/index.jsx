import { FaUser } from "react-icons/fa";
import LayoutAdmin from "../../../components/Admin/Layout/LayoutAdmin";
import MainUser from "../../../components/Admin/User/MainUser";

export default function UserAdmin({ profileData }) {
  return (
    <LayoutAdmin title={"User Collection"} desc="Halaman User Collection" profileData={profileData}>
        <div className="p-5">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-5">
                <FaUser className="text-4xl text-blue-500"/>
                <h1 className="text-2xl font-bold text-zinc-500">Users</h1>
            </header>

            <section>
                <MainUser />
            </section>
        </div>
    </LayoutAdmin>
  )
}
