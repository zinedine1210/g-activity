import { data } from 'autoprefixer';
import { useEffect, useRef } from 'react';

const JitsiComponent = ({ width, height, dataUser, dataMeet, audioOnly, onConferenceLeft, configOverwrite }) => {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    let interfaceOverwrite = {
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'etherpad', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
      ]
    }
    if (audioOnly) {
      interfaceOverwrite = {
        ...interfaceOverwrite,
        TOOLBAR_BUTTONS: [
          'microphone', 'hangup', 'fullscreen', 'fodeviceselection', 'info', 'security'
        ]
      }
    }
    interfaceOverwrite['SHOW_PROMOTIONAL_CLOSE_PAGE'] = false

    const loadJitsiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        const domain = 'meet.gnusa.id';
        const options = {
          roomName: dataMeet.title || 'DefaultRoomName', // Nama room default jika tidak ada props
          width: width || '100%',
          height: height || 700,
          parentNode: jitsiContainerRef.current,
          interfaceConfigOverwrite: interfaceOverwrite,
          configOverwrite: {
            ...configOverwrite,
            prejoinPageEnabled: false,
            startWithVideoMuted: audioOnly,
            disableVideoBackground: audioOnly,
            disableVideo: audioOnly,
            startWithAudioMuted: false,
          },
        };
        const api = new JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        // Set the display name
        console.log("dataUser", dataUser)
        if (dataUser && dataUser.username) {
          console.log("disini broo")
          api.executeCommand('displayName', dataUser.username);
        }


        api.addEventListener('videoConferenceJoined', () => {
          // Set the password
          if (dataMeet && dataMeet.use_password == 1) {
            api.executeCommand('password', dataMeet.password);
          }
        });


        api.addEventListener('videoConferenceLeft', () => {
          console.log("sini kahh??")
          if (onConferenceLeft) {
            onConferenceLeft();
          }
        });

        api.addEventListener('participantLeft', () => {
          console.log("disini bro end meeting ??")
          const participants = api.getParticipantsInfo();
          if (participants.length === 0 && onEndMeeting) {
            onConferenceLeft();
          }
        });


        // Event listeners and other API methods can be called here
      };
      document.body.appendChild(script);
    };

    loadJitsiScript();

    return () => {
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }
    };
  }, [width, height, dataUser, dataMeet, audioOnly, onConferenceLeft, configOverwrite]);

  return (
      <div ref={jitsiContainerRef} className='w-full h-full' />
  );
};

export default JitsiComponent;
