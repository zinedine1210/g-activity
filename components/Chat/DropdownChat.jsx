import { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function DropdownChat({
    label="",
    options
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 hover:bg-zinc-500/20 rounded-md flex items-center justify-center">
                {label}
            </button>
            <div className={`${isOpen ? "visible opacity-100 translate-y-0":"translate-y-10 opacity-0 invisible"} transition-all duration-300 ease-in-out backdrop-blur-xl w-fit py-1 rounded-md shadow-xl absolute top-full right-0`}>
                {
                    options && options.map((opt, index) => {
                        return (
                            <button key={index} onClick={() => opt.action()} className="w-full py-2 px-5 text-sm hover:bg-blue-200 whitespace-nowrap text-start font-semibold flex items-center gap-2">
                                {opt.icon}
                                {opt.label}
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}
