import { useEffect, useRef, useState } from 'react'

export default function CardAssign({item}) {
    const [open, setOpen] = useState(false)
    const dropRef = useRef(null)

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

  return (
    <div className='relative' ref={dropRef}>
        <span onClick={() => setOpen(true)} className={`${open ? "ring-blue-500":"ring-zinc-200"} cursor-help w-10 h-10 border ring-2 ring-offset-1 rounded-full relative bg-zinc-500 border-zinc-300 flex items-center justify-center text-xl text-white uppercase group font-bold`}>
            {item.uid_docs.username.charAt(0)}
        </span>

        <div className={`bg-white w-fit p-2 absolute shadow-md ${open ? "":"hidden"}`}>
            <div className="max-w-md p-2 sm:flex sm:space-x-4 bg-gray-50 text-gray-800">
                <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-20 sm:w-20 sm:mb-0">
                    <img src="https://source.unsplash.com/100x100/?portrait?1" alt="" className="object-cover object-center w-full h-full rounded bg-gray-500" />
                </div>
                <div className="flex flex-col space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">{item.uid_docs.fullname}</h2>
                        <span className="text-sm text-gray-600">{item.uid_docs.username}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                        <span className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-label="Email address" className="w-4 h-4">
                                <path fill="currentColor" d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"></path>
                            </svg>
                            <span className="text-gray-600">{item.uid_docs.email}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-label="Phonenumber" className="w-4 h-4">
                                <path fill="currentColor" d="M449.366,89.648l-.685-.428L362.088,46.559,268.625,171.176l43,57.337a88.529,88.529,0,0,1-83.115,83.114l-57.336-43L46.558,362.088l42.306,85.869.356.725.429.684a25.085,25.085,0,0,0,21.393,11.857h22.344A327.836,327.836,0,0,0,461.222,133.386V111.041A25.084,25.084,0,0,0,449.366,89.648Zm-20.144,43.738c0,163.125-132.712,295.837-295.836,295.837h-18.08L87,371.76l84.18-63.135,46.867,35.149h5.333a120.535,120.535,0,0,0,120.4-120.4v-5.333l-35.149-46.866L371.759,87l57.463,28.311Z"></path>
                            </svg>
                            <span className="text-gray-600">+25 381 77 983</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
