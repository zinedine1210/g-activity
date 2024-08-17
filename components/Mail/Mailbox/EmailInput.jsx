import React, { useContext, useState, useEffect } from 'react'
const EmailInput = ({ onEmailsChange, label, defaultEmails = [] }) => {
    const [emails, setEmails] = useState(defaultEmails);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (onEmailsChange) {
            onEmailsChange(emails);
        }
    }, [emails, onEmailsChange]);

    const isValidEmail = (email) => {
        // Regex sederhana untuk memvalidasi format email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const email = inputValue.trim();
            if (email && isValidEmail(email) && !emails.includes(email)) {
                const newEmails = [...emails, email];
                setEmails(newEmails);
                if (onEmailsChange) {
                    onEmailsChange(newEmails);
                }
            } else if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue) {
            e.preventDefault();
            if (emails.length > 0) {
                const newEmails = emails.slice(0, -1);
                setEmails(newEmails);
                if (onEmailsChange) {
                    onEmailsChange(newEmails);
                }
            }
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        const newEmails = emails.filter(email => email !== emailToRemove);
        setEmails(newEmails);
        if (onEmailsChange) {
            onEmailsChange(newEmails);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center border border-gray-300 bg-gray-50 p-2.5 rounded-lg space-x-2">
                {emails.map((email, index) => (
                    <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
                        <span>{email}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveEmail(email)}
                            className="focus:outline-none text-white"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    name={label}
                    id={label}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 sm:text-sm flex-1"
                    placeholder={label ? label : "To"}
                />
            </div>
        </div>
    );
};

export default EmailInput;
