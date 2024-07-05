import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Layout2 from "../../components/Layouts/Layout2"

function User(props) {
  const { profileData } = props
  console.log(profileData);
  return (
    <Layout2 title={"HALAMAN DOCUMENTATION"} profileData={profileData}>
      <section className="min-h-screen contain px-2 md:px-56 pt-32">
        <h1 className="text-3xl font-bold">Welcome to <span className="font-extrabold text-green-500">G</span>Activity</h1>
        <h1 className="mt-5 mb-10">Build an Application</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Link href={"/usr/documentation"}>
          <div className="w-full relative h-44 from-red-500 via-pink-600 to-red-800 transition-all duration-300 ease-in-out hover:from-red-400 hover:via-pink-500 hover:to-red-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Documentation</h1>
              <p className="text-sm text-white">Create a documentation website</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">2</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link>
          <Link href={"/usr/mom"}>
          <div className="w-full relative h-44 from-green-500 via-lime-600 to-green-800 transition-all duration-300 ease-in-out hover:from-green-400 hover:via-lime-500 hover:to-green-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Minute of Meeting</h1>
              <p className="text-sm text-white">Create a mom</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">6</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link>
          <Link href={"/usr/note"}>
          <div className="w-full relative h-44 from-blue-500 via-cyan-600 to-blue-800 transition-all duration-300 ease-in-out hover:from-blue-400 hover:via-cyan-500 hover:to-blue-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Note</h1>
              <p className="text-sm text-white">Create a note</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">10</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link>
          <Link href={"/usr/error-knowladge"}>
          <div className="w-full relative h-44 from-orange-500 via-amber-600 to-orange-800 transition-all duration-300 ease-in-out hover:from-orange-400 hover:via-amber-500 hover:to-orange-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Error Knowladge</h1>
              <p className="text-sm text-white">Create a note of error Knowladge</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">6</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link>
          <Link href={"/usr/task"}>
          <div className="w-full relative h-44 from-purple-500 via-indigo-600 to-purple-800 transition-all duration-300 ease-in-out hover:from-purple-400 hover:via-indigo-500 hover:to-purple-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Task</h1>
              <p className="text-sm text-white">Create a mom</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">6</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link>
          {/* <Link href={"/usr/quality-control"}>
          <div className="w-full relative h-44 from-zinc-500 via-zinc-600 to-zinc-800 transition-all duration-300 ease-in-out hover:from-zinc-400 hover:via-zinc-500 hover:to-zinc-700 rounded-md bg-gradient-to-br p-3">
            <div>
              <h1 className="font-extrabold text-lg text-white">Quality Control</h1>
              <p className="text-sm text-white">Create a project</p>
            </div>
            <div className="text-xs absolute bottom-2 left-3 text-white flex gap-1">
              Last Edit 12/11/2023
            </div>
            <div className="text-xs absolute bottom-1 right-3 text-white flex gap-1">
              <span className="font-semibold text-6xl">12</span>
              <div className="self-end mb-1">
                <h1>Project</h1>
                <h1>Created</h1>
              </div>
            </div>
          </div>
          </Link> */}
        </div>

        <h1 className="mt-5 mb-10">Start with the basic</h1>

      </section>
    </Layout2>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    }
  };
}

export default User