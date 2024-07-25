import SubMenuWorkspace from '@components/Workspaces/SubMenuWorkspace'
import React, { useEffect, useState } from 'react'

export default function SubmenuComponent({
    pathname
}) {
    const [mounted, setMouted] = useState(false)
    let submenuComponentList = {
        "/usr/workspaces": <SubMenuWorkspace />
    }

    const callComponent = () => {
        for (const path in submenuComponentList) {
            if (pathname.startsWith(path)) {
              return submenuComponentList[path];
            }
        }
        return null; // Or a default component if needed
    }

    // useEffect(() => {
    //     if(!mounted){
    //         setTimeout(() => {
    //             setMouted(true)
    //         }, 3000);
    //     }
    // }, [mounted])
    
    if(callComponent())
  return (
    <div className={`max-w-80 min-w-80 w-full overflow-hidden border-r-2 duration-300 ease-in-out transition-all py-6`}>
        <button className='absolute top- -left-5'>X</button>
        {callComponent()}
    </div>
  )
}
