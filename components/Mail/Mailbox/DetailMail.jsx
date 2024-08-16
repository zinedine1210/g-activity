import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MyContext } from "context/MyProvider";
import { convertDateMail } from '@utils/function'
import AttachmentList from '@components/Mail/Mailbox/AttachmentList';


const EmailDetail = () => {
  const { detailMailData } = useContext(MyContext)
  const context = useContext(MyContext)
  const topEmailRef = useRef(null);

  // console.log("context detail", detailMailData)

  useEffect(() => {
    if (topEmailRef.current) {
      topEmailRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const toolbarOptions = [
    {
      title: "Back",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
        </svg>
      ),
      action: () => {
        console.log('Back clicked');
        context.setData({ ...context, mailRightPanel: 'tableMail' })
      }
    },
    // {
    //   title: "Refresh",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    //       />
    //     </svg>
    //   ),
    //   action: () => {
    //     console.log('Refresh clicked');
    //   }
    // },
    {
      title: "Archive",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
          />
        </svg>
      ),
      action: () => {
        console.log('Archive clicked');
      }
    },
    {
      title: "Mark As Spam",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      action: () => {
        console.log('Mark As Spam clicked');
      }
    },
    {
      title: "Delete",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      action: () => {
        console.log('Delete clicked');
      }
    },
    // {
    //   title: "Mark As Read",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
    //       />
    //     </svg>
    //   ),
    //   action: () => {
    //     console.log('Mark As Read clicked');
    //   }
    // },
    // {
    //   title: "Mark As Unread",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    //       />
    //     </svg>
    //   ),
    //   action: () => {
    //     console.log('Mark As Unread clicked');
    //   }
    // },
    // {
    //   title: "Add Star",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    //       />
    //     </svg>
    //   ),
    //   action: () => {
    //     console.log('Add Star clicked');
    //   }
    // },
  ];

  let fromData = detailMailData.From.match(/(.*?)<(.*?)>/);
  let name = fromData[1].trim();
  let email = fromData[2].trim();

  const EmailBody = ({ body }) => {
    return (
      <div className="py-6 pl-2 text-gray-700" dangerouslySetInnerHTML={{ __html: body.replace(/\r\n/g, "<br />") }} />
    );
  };

  return (
    <>
      <div className="h-16 flex items-center justify-between" ref={topEmailRef}>
        <div className="flex items-center">
          {toolbarOptions.map((option, index) => (
            <div key={index} className="flex items-center">
              <button
                title={option.title}
                className="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition duration-100"
                onClick={option.action}
              >
                {option.icon}
              </button>
              {index === 0 || index === 3 ? (
                <span className="bg-gray-300 h-6 w-[.5px] mx-3"></span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="px-2 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="bg-gray-200 text-gray-400 p-1.5 rounded-lg" title="Previous Email">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-lg transition duration-150" title="Nex Email">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-lg text-gray-800 font-bold pb-2 mb-4 border-b-2">{detailMailData['Subject']}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className='rounded-full border border-gray-600 h-10 w-10 flex justify-center items-center p-2'>
              <FaUser className="w-8 h-8 text-blue-700" />
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-xs text-gray-400">From: {email}</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">{convertDateMail(detailMailData.Date, "datetime")}  Jan 30, 2022, 10:23 AM</span>
        </div>
        <EmailBody body={detailMailData.Body} />
        {
          detailMailData.Attachments && detailMailData.Attachments.length > 0 && <div className="border-t-2 flex space-x-4 py-4"><AttachmentList attachments={detailMailData.Attachments} /></div>
        }
        <div className="mt-8 flex items-center space-x-4">
          <button className="w-32 flex items-center justify-center space-x-2 py-1.5 text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <span>Reply</span>
          </button>
          <button className="w-32 flex items-center justify-center space-x-2 py-1.5 text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            <span>Forward</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailDetail;
