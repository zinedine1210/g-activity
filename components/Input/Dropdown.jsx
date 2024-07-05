import { useState, useEffect, useRef } from 'react';

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <>
    
    
    <div ref={dropdownRef}>
      <button onClick={handleDropdownClick} className="border">{}</button>
      {isOpen && (
        <ul className="bg-white rounded-md shadow-md w-fit p-3">
          <li>
            <a href="#opsi 1">Opsi 1</a>
          </li>
          <li>
            <a href="#">Opsi 2</a>
          </li>
          <li>
            <a href="#">Opsi 3</a>
          </li>
        </ul>
      )}
    </div>
    </>
  );
}