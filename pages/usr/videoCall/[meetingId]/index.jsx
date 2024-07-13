import MeetingRepository from '@repositories/MeetingRepository';
import { Notify } from '@utils/scriptApp';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const JitsiComponent = dynamic(() => import('@components/JitsiMeet/JitsiComponent'), { ssr: false });

export default function MeetingJitsi({ profileData, meetingId }) {
    const router = useRouter()
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [dataUser, setDataUser] = useState(null);
    const [dataMeet, setDataMeet] = useState(null);
    const [dataAudioOnly, setAudioOnly] = useState(null)

    const getDetailCall = async () => {
        const result = await MeetingRepository.detailMeetingById({
            xa: JSON.parse(localStorage.getItem("XA")),
            id: meetingId
        })

        if(result.status == 0){
            const data = result.data
            setDataMeet({
                "title": data?.title,
                "use_password": 1, // 0 no password, 1 use password
                "password": ""
            })
            setAudioOnly(false)
            setDataUser(profileData)
            setShowVideoCall(true)
        }else {
            Notify("Meeting Not found", "info")
            router.push("/usr/videoCall")
        }
    }
    

    useEffect(() => {
        if(!dataMeet){
            getDetailCall()
        }
    }, [meetingId])

    const handleLeaveMeet = () => {
        setShowVideoCall(false)
        setDataMeet(null)
        setDataUser(null)
        setAudioOnly(null)
        Notify("You leave the meeting", "info")
        // ubah status ke finish
        router.push("/usr/videoCall")
    }

  return (
    <section className='w-full h-screen flex items-center justify-center'>
        <div className='w-full h-full flex relative'>
            {/* <PanelSide profileData={profileData}/> */}
            {
                showVideoCall && <JitsiComponent
                    width="100%"
                    height="100%"
                    dataUser={dataUser}
                    dataMeet={dataMeet}
                    audioOnly={dataAudioOnly}
                    onConferenceLeft={handleLeaveMeet}
                />
            }
        </div>
    </section>
  )
}


export async function getServerSideProps({ query }) {
    return {
      props : {
        meetingId: query.meetingId ?? null
      }
    };
  }