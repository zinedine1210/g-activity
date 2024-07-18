import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AuthRepository from '../repositories/AuthRepository';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
      let getXA = localStorage.getItem("XA")

      try {
        getXA = JSON.parse(getXA)
      } catch (e) {
        console.error("JSON parse error:", e)
        localStorage.removeItem("XA")
        Swal.fire({
          icon: "info",
          title: "Logout",
          text: "Your session has expired",
          timer: 1200
        })
        localStorage.setItem("profileData", "logout")
        setProfileData("logout")
        return router.push("/")
      }

      const localProfile = localStorage.getItem("profileData") == undefined ? JSON.parse(localStorage.getItem("profileData")) : undefined

      if (localProfile) {
        setProfileData(localProfile)
      } else {
        if (getXA) {
          const fetchProfileData = async () => {
            // Fetch profile data here
            const data = await AuthRepository.getStatus({ param: "user", XA: getXA })
            // console.log(data)
            if (data.status == -1 && data.message == "Token Expired") {
              localStorage.removeItem("XA")
              Swal.fire({
                icon: "info",
                title: "Logout",
                text: "Your session has expired",
                timer: 1200
              })
              localStorage.setItem("profileData", "logout")
              router.push("/")
              setProfileData("logout")
            } else if (data.type == "failed") {
              Swal.fire({
                icon: "warning",
                title: "Maintenance"
              })
              router.push("/")
              localStorage.setItem("profileData", "failed")
              setProfileData("failed")
            } else {
              // console.log(data)
              localStorage.setItem("profileData", JSON.stringify(data))
              setProfileData(data)
            }
          }

          if (!profileData) {
            fetchProfileData();
          }
        } else {
          setProfileData("logout")
          localStorage.setItem("profileData", "logout")
          router.push("/")
        }
      }

    }, []);

    if (profileData) {
      return (
        <WrappedComponent profileData={profileData} {...props} />
      );
    } else {
      return <Loading />
    }
  };
};

function Loading() {
  return (
    <div className='dark:bg-dark w-full h-screen flex items-center justify-center'>
      <div className='flex items-center gap-5'>
        <div className="loader"></div>
        <div>
          <h1 className='text-3xl font-bold'>Loading...</h1>
          <p className='text-xl'>Mohon tunggu, sedang memuat akun Anda</p>
        </div>
      </div>
    </div>
  )
}

function FailedLoading() {
  return (
    <section className='bg-white flex items-center justify-center w-screen h-screen'>
      asjkajsk
    </section>
  )
}

export default withAuth;