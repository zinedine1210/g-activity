import LayoutAdmin from "../../../components/Admin/Layout/LayoutAdmin";
import MainEnum from "../../../components/Admin/Enum/MainEnum"
import { BsListCheck } from "react-icons/bs";

export default function RoleAdmin({ profileData }) {
  
  return (
    <LayoutAdmin title={"Enum"} desc="Halaman Pengaturan Enum" profileData={profileData}>
        <div className="p-5">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-3">
                <BsListCheck className="text-3xl text-blue-500"/>
                <h1 className="text-xl font-bold text-zinc-500">Enum</h1>
            </header>

            <section>
                <MainEnum profileData={profileData}/>
            </section>
        </div>
    </LayoutAdmin>
  )
}
