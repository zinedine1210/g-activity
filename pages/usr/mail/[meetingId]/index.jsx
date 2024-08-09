import Seo from '@components/seo';
import MailRepository from '@repositories/MailRepository';
import { Notify } from '@utils/scriptApp';
import { MyContext } from 'context/MyProvider';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'

const JitsiComponent = dynamic(() => import('@components/JitsiMeet/JitsiComponent'), { ssr: false });

export default function MailJitsi({ profileData, meetingId }) {
    const router = useRouter()
    const context = useContext(MyContext)
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [dataUser, setDataUser] = useState(null);
    const [dataMeet, setDataMeet] = useState(null);
    const [dataAudioOnly, setAudioOnly] = useState(null)

    const getDetailCall = async () => {
        const result = await MailRepository.detailMailById({
            xa: JSON.parse(localStorage.getItem("XA")),
            id: meetingId
        })

        if(result.status == 0){
            const data = result.data
            setDataMeet({
                "title": data?.title,
                "use_password": data?.passcode ? 1 : 0, // 0 no password, 1 use password
                "password": data?.passcode
            })
            setAudioOnly(false)
            setDataUser(profileData)
            setShowVideoCall(true)
        }else {
            Notify("Mail Not found", "info")
            router.push("/usr/videoCall")
        }
    }
    

    useEffect(() => {
        if(!dataMeet){
            getDetailCall()
        }
    }, [meetingId])

    const handleLeaveMeet = async () => {
        setShowVideoCall(false)
        setDataMeet(null)
        setDataUser(null)
        setAudioOnly(null)
        // ubah status ke finish
        if(dataUser.id == profileData.id){
            const result = await MailRepository.setStatusMail({
                xa: JSON.parse(localStorage.getItem("XA")),
                id: meetingId,
                data: {
                    status: 3
                }
            })
            if(result.status == 0){
                if(context.dataMail){
                    let typemeet = 1
                    if(dataMeet?.meet){
                        typemeet = 2
                    }
                    const findIndex = context.dataMail[typemeet].findIndex(res => res.id == meetingId)
                    context.dataMail[typemeet][findIndex] = result.data
                    context.setData({ ...context, dataMail: { ...context.dataMail, [typemeet]: context.dataMail[typemeet] } })
                }
                Notify("You leave the meeting", "info")
            }
        }
        router.push("/usr/videoCall")
    }

  return (
    <section className='w-full h-screen flex items-center justify-center'>
        <Seo 
            title={dataMeet?.title}
            description="Meet"
            />
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