import { FaChartArea } from "react-icons/fa";
import LayoutAdmin from "../../components/Admin/Layout/LayoutAdmin";
import MainDashboard from "../../components/Admin/Dashboard/MainDashboard";

export default function DashboardAdmin({ profileData }) {
  return (
    <LayoutAdmin title={"Dashboard"} desc="Halaman Dashboard dari admin" profileData={profileData}>
        <div className="p-5">
            <header className="border-b pb-3 border-zinc-300 flex items-center gap-5">
                <FaChartArea className="text-4xl text-blue-500"/>
                <h1 className="text-2xl font-bold text-zinc-500">Dashboard</h1>
            </header>

            <section>
                <MainDashboard />
            </section>
        </div>
    </LayoutAdmin>
  )
}
