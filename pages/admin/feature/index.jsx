import { FaStar } from "react-icons/fa";
import LayoutAdmin from "../../../components/Admin/Layout/LayoutAdmin";
import MainFeature from "../../../components/Admin/Features/MainFeature";

export default function FeatureAdmin({ profileData }) {
  return (
    <LayoutAdmin title={"Feature Collection"} desc="Halaman Dashboard dari admin" profileData={profileData}>
        <div className="p-5">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-3">
                <FaStar className="text-3xl text-orange-500"/>
                <h1 className="text-xl font-bold text-zinc-500">Features</h1>
            </header>

            <section>
                <MainFeature />
            </section>
        </div>
    </LayoutAdmin>
  )
}
