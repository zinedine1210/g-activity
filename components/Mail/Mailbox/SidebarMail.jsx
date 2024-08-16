import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MyContext } from 'context/MyProvider'

export default function SidebarMail() {
    const router = useRouter();
    const { pathname, query } = router;
    const context = useContext(MyContext);

    // Extract hash from URL
    const hash = router.asPath.split('#')[1] || 'INBOX';

    const setUrlRoute = (keyFilter) => {
        const newUrl = `${pathname}?${new URLSearchParams(query).toString()}#${keyFilter}`;
        router.push(newUrl, undefined, { shallow: true });
    }

    const setMailRightPanel = () =>{
        context.setData({ ...context, mailRightPanel: 'tableMail' })
    }

    const menuItems = [
        {
            title: "Inbox",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
            ),
            action: () => setUrlRoute("INBOX"),
            // badge: "3"
        },
        // {
        //     title: "Starred",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        //         </svg>
        //     ),
        //     action: () => setUrlRoute("starred")
        // },
        // {
        //     title: "Snoozed",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        //         </svg>
        //     ),
        //     action: () => setUrlRoute("snoozed")
        // },
        // {
        //     title: "Important",
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
        //         </svg>
        //     ),
        //     action: () => setUrlRoute("important")
        // },
        {
            title: "Sent",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
            ),
            action: () => setUrlRoute("Sent")
        },
        {
            title: "Drafts",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            ),
            action: () => setUrlRoute("Drafts"),
            // badge: "1"
        },
        {
            title: "Junk",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            ),
            action: () => setUrlRoute("Junk")
        },
        {
            title: "Trash",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            ),
            action: () => setUrlRoute("Trash")
        },
    ];

    return (
        <div className="px-2 pt-4 pb-8 border-r border-gray-300 h-screen">
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <a
                            className={`hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 text-gray-700 ${hash.toLowerCase()  === item.title.toLowerCase() ? 'bg-gray-500 bg-opacity-30 text-blue-600' : ''} flex items-center justify-between py-1.5 px-4 rounded cursor-pointer`}
                            onClick={() => {
                                setMailRightPanel(); // Panggil fungsi pertama
                                item.action(); // Panggil fungsi kedua (item.action)
                            }}
                        >
                            <span className="flex items-center space-x-3">
                                {item.icon}
                                <span className="text-sm font-medium">{item.title}</span>
                            </span>
                            {item.badge && (
                                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
