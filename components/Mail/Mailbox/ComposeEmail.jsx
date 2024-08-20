import React, { useContext, useState, useEffect } from 'react'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
import CollectionData from "@repositories/CollectionData"
import EmailInput from '@components/Mail/Mailbox/EmailInput';
import 'react-quill/dist/quill.snow.css';
import AttachmentList from '@components/Mail/Mailbox/AttachmentList';
import { convertDateString } from '@utils/function'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ComposeMail({
    account
}) {
    const router = useRouter()
    const { pathname, query } = router;
    const context = useContext(MyContext)
    const [dataTo, setDataTo] = useState([]);
    const [dataCc, setDataCc] = useState(null);
    const [dataBcc, setDataBcc] = useState(null);
    const [dataSubject, setDataSubject] = useState("");
    const [dataBodyMail, setDataBodyMail] = useState("");
    const [isLoader, setIsLoader] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const hash = router.asPath.split('#')[1];
    const filterUID = hash || '#Inbox';


    useEffect(() => {
        let toData;

        if (context.mailReply != "New") {
            if (filterUID == "Inbox") {
                toData = extractEmails(context.detailMailData.From)
            }

            if (filterUID == "Sent") {
                toData = extractEmails(context.detailMailData.To)
            }

            let subjectMail = context.detailMailData.Subject ? context.detailMailData.Subject : ""

            if (context.mailReply == "Reply") {
                setDataSubject(`Re: ${subjectMail}`)
                const originalBody = context.detailMailData.Body ? context.detailMailData.Body : "";
                const replyHeader = `On ${convertDateString(context.detailMailData.Date, "full")}, ${toData} wrote: <br /><br />`;
                setDataBodyMail(context.detailMailData.Body ? replyHeader + originalBody : "")
            }

            if (context.mailReply == "Forward") {
                setDataSubject(`Fwd: ${subjectMail}`)
                const originalBody = context.detailMailData.Body ? context.detailMailData.Body : "";
                let replyHeader = `-------- Original Message -------- <br />
                 Subject: ${subjectMail} <br/>
                 Date: ${convertDateString(context.detailMailData.Date, "full")} <br/>
                 From: ${extractEmails(context.detailMailData.From)} <br/>
                 To: ${extractEmails(context.detailMailData.To)} <br/>
                 `;

                if(context.detailMailData.Cc && context.detailMailData.Cc.length > 0){
                    replyHeader += `Cc: ${extractEmails(context.detailMailData.Cc)} <br/>`
                }

                if(context.detailMailData.Bcc && context.detailMailData.Bcc.length > 0){
                    replyHeader += `Bcc: ${extractEmails(context.detailMailData.Bcc)} <br/>`
                }

                replyHeader += `<br /><br />`

                setDataBodyMail(context.detailMailData.Body ? replyHeader + originalBody : "")
                if(context.detailMailData.Attachments?.length > 0){
                    setAttachments(context.detailMailData.Attachments)
                }
                console.log("context.detail", context.detailMailData)                
            }
        }
    }, [context.mailReply]);

    // Fungsi untuk mengekstrak email
    const extractEmails = (data) => {
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        let emails = data
        if (Array.isArray(data)) {
            emails = data.map(item => {
                const match = item.match(emailRegex);
                return match ? match[0] : null;
            }).filter(Boolean);
        } else if (typeof data === 'string') {
            emails = data.match(emailRegex)
        } else {
            // console.log("Data bukan array atau string:", data);
        }


        return emails
    };

    const toolbarOptions = [
        {
            title: "Back",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                </svg>
            ),
            action: () => {
                context.setData({ ...context, mailRightPanel: 'tableMail' })
            }
        }
    ];

    const loaderComponent = (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path> </svg>)

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const uploadedFiles = files.map((file) => ({
            filename: file.name,
            size: file.size,
            file: file, // Menyimpan file asli untuk dikirim nanti
        }));
        setAttachments((prevAttachments) => [...prevAttachments, ...uploadedFiles]);
    };

    const handleRemoveAttachment = (index) => {
        setAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
    };

    const handleSendEmail = async () => {
        console.log("filterUID", filterUID)
        console.log("dataTo", dataTo)


        if (!isLoader) {
            if (!dataTo || dataTo.length == 0) {
                return Notify("Email receiver must be filled", "info")
            }
            setIsLoader(true)
            console.log('ini send email ')
            console.log("tes")
            console.log(account)

            let value = {
                "to": dataTo,
                "cc": dataCc,
                "bcc": dataBcc,
                "subject": dataSubject,
                "body_mail": dataBodyMail
                // "reply_to":"aldian.putra0594@gmail.com", // opsional(kalau tidak ada tidak usah kirim datanya) | kalau lebih dari satu jadi array ["aldian@gai.co.id","charly@gai.co.id"]
            }
            console.log("value", value)

            const formData = new FormData();

            for (const key in value) {
                formData.append(key, value[key]);
            }

            if (attachments.length > 0) {
                attachments.forEach((attachment) => {
                    formData.append('upload', attachment.file);
                });
            }

            // console.log("attachments", attachments)

            // console.log("formData", formData)

            // jika reply
            let result;
            if (context.mailReply == "Reply") {
                formData.append("email_id", context.detailMailData.id);
                result = await CollectionData.postFormData({ url: `reply_mail/${account['id']}/${filterUID}`, values: formData });
            } else {
                result = await CollectionData.postFormData({ url: `sent_mail/${account['id']}`, values: formData });
            }
            console.log("result result", result)
            setIsLoader(false)
            if (result.status == 0) {
                if (filterUID == "Sent") {
                    context.setData({
                        ...context,
                        // dataMailBox: [...context['dataMailBox']['emails'], result.data],
                        mailRightPanel: 'tableMail'
                    });
                } else {
                    context.setData({
                        ...context,
                        mailRightPanel: 'tableMail'
                    });
                }
                Notify("Success send email", "info")
            } else {
                Notify("error send email", "error")
            }
        }
    };

    const handleEmailsChange = (key, emails) => {
        if (key === 'To') {
            setDataTo(emails);
        } else if (key === 'Cc') {
            setDataCc(emails);
        } else if (key === 'Bcc') {
            setDataBcc(emails);
        }
    };

    const checkEmailInput = (key) => {
        let toData = []

        if (context.mailReply == "Reply") {
            if (key === 'To') {
                if (filterUID == "Inbox") {
                    toData = extractEmails(context.detailMailData.From)
                }

                if (filterUID == "Sent") {
                    toData = extractEmails(context.detailMailData.To)
                }
                console.log("detailMailData", context.detailMailData)
                console.log("toData", toData)
            }
            if (key === 'Cc') {
                toData = extractEmails(context.detailMailData.Cc)
            }

            if (key === 'Bcc') {
                toData = extractEmails(context.detailMailData.Bcc)
            }
        }
        return (
            <EmailInput
                label={key}
                defaultEmails={toData}
                onEmailsChange={(email) => handleEmailsChange(key, email)}
            />
        );
    };


    return (
        <>
            <div className="flex-1 px-2">
                <div className="h-16 flex items-center space-x-4">
                    {toolbarOptions.map((option, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                title={option.title}
                                className="text-gray-700 px-2 py-1 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition duration-100"
                                onClick={option.action}
                            >
                                {option.icon}
                            </button>
                        </div>
                    ))}
                    <h4 className="text-lg font-bold">{context.mailReply} Email</h4>
                </div>
                <div className="mb-6 space-y-2">
                    <div className='flex items-center space-x-2'>
                        <span className='text-sm font-semibold w-14'>To</span>
                        <div className='w-full'>
                            {checkEmailInput('To')}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <span className='text-sm font-semibold w-14'>Cc</span>
                        <div className='w-full'>
                            {checkEmailInput('Cc')}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <span className='text-sm font-semibold w-14'>Bcc</span>
                        <div className='w-full'>
                            {checkEmailInput('Bcc')}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <span className='text-sm font-semibold w-14'>Subject</span>
                        <div className='flex flex-wrap items-center border border-gray-300 bg-gray-50 p-2.5 rounded-lg space-x-2 w-full'>
                            <input type="text" onChange={(e) => setDataSubject(e.target.value)} placeholder='input subject' defaultValue={dataSubject} className="block w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 sm:text-sm flex-1" />
                        </div>
                    </div>
                    <div className='max-h-screen overflow-auto h-96'>
                        {/* <textarea id="body" onChange={(e) => setDataBodyMail(e.target.value)} className="w-full h-64 block rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 p-4 border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-base focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm" placeholder="Message..."></textarea> */}
                        <ReactQuill theme="snow" onChange={setDataBodyMail} value={dataBodyMail} className="h-80" />
                    </div>
                    {/* <div className="flex items-center space-x-2 my-2">
                        <div className="w-40 flex items-center justify-between text-gray-600 px-2 py-1.5  border border-gray-400 rounded-lg hover:bg-gray-200">
                            <div className="w-28 flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-sm truncate">Review.zip</span>
                            </div>
                            <button className="hover:text-gray-900" title="Remove">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="w-40 flex items-center justify-between text-gray-600 px-2 py-1.5  border border-gray-400 rounded-lg hover:bg-gray-200">
                            <div className="w-28 flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-sm truncate">Approve.zip</span>
                            </div>
                            <button className="hover:text-gray-900" title="Remove">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div> */}
                    <div>
                        {attachments.length > 0 && (
                            <div className="flex space-x-4 flex-wrap">
                                <AttachmentList
                                    attachments={attachments}
                                    removeAttachment={handleRemoveAttachment}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <button className="bg-blue-500 hover:bg-blue-700 rounded-lg px-12 py-1.5 text-gray-100 hover:shadow-xl transition duration-150" onClick={handleSendEmail}>{isLoader ? loaderComponent : 'Send'}</button>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" title="Attach Files">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                    />
                                </svg>
                            </label>
                            {/* <button title="Attach Files">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                            </button> */}
                        </div>
                        {/* <button className="mr-4 text-gray-700 hover:text-gray-900" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
