import { useState } from "react"

export default function MainDashboard({ profileData }) {
    const [data, setData] = useState(null)

  return (
    <div className="py-10">
      <div className="bg-gradient-to-r from-blue-500 to-blue-200 py-20 px-16 rounded-xl shadow-xl relative">
        <h1 className="text-3xl text-white font-semibold">Welcome to Admin Panel, Your dashboard is ready!</h1>
        <p className="mt-5 text-white text-xl w-1/2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet at fugiat ipsum reiciendis inventore facilis doloremque magnam expedita, iusto voluptas?</p>
        <div className="flex items-center gap-2 mt-5">
          <button className="btn-secondary font-semibold">Back to client web</button>
        </div>
        <img src="/images/Admin-cuate.png" alt="Admin image" className="absolute -top-24 right-10 w-[400px] h-auto" />
      </div>
    </div>
  )
}
