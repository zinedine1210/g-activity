import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import { FaChevronDown } from "react-icons/fa"

const Dropdown = ({ listAccounts, currentAccount }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter()

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAccountSwitch = (account) => {
        setDropdownOpen(false);
        router.push(`/usr/mail?uid=${account['id']}#INBOX`)
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative mt-4 w-48 bg-gray-600 py-2 rounded" ref={dropdownRef}>
            <div className='px-2'>
                <button
                    onClick={toggleDropdown}
                    className="text-gray-100 flex items-center justify-center w-full space-x-2 transition duration-150 overflow-hidden"
                >
                    <span className="p-1 truncate">{currentAccount?.username ? currentAccount.username : null}</span>
                    <FaChevronDown className={`${dropdownOpen ? "rotate-180" : ""} transition-all duration-300 w-2`} />
                </button>
            </div>
            {dropdownOpen && (
                <div className="absolute mt-2 bg-white shadow-lg rounded border border-gray-200 inline-block min-w-full">
                    {console.log(listAccounts, "listAccounts")}
                    <ul className="list-none m-0 p-0">
                        {listAccounts && listAccounts.length > 0 ? listAccounts.map((account, index) => (
                            <li
                                key={index}
                                onClick={() => handleAccountSwitch(account)}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 truncate"
                            >
                                {account.username}
                            </li>
                        )) : null}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
