import React, { useContext, useState, useEffect } from 'react'
import { Notify } from '@utils/scriptApp'
import { MyContext } from 'context/MyProvider'
import { useRouter } from 'next/router'
import CollectionData from "@repositories/CollectionData"
import EmailInput from '@components/Mail/Mailbox/EmailInput';

export default function ComposeMail({

}) {
    const router = useRouter()
    const { pathname, query } = router;
    const context = useContext(MyContext)

    const handleEmailsChange = (emails) => {
        console.log('Updated emails:', emails);
    };

    return (
        <>
            <div class="flex-1 px-2">
                <div class="h-16 flex items-center">
                    <h4 class="text-lg font-bold">New Email</h4>
                </div>
                <div class="mb-6 space-y-2">
                    <div>
                        {/* <input type="text" name="to" id="to" class="block w-full border disabled:cursor-not-allowed disabled:opacity-50 outline-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 sm:text-sm rounded-lg" placeholder="To" /> */}
                        <EmailInput label="To" onEmailsChange={handleEmailsChange} />
                    </div>
                    <div>
                        <input type="text" name="cc" id="cc" class="block w-full border disabled:cursor-not-allowed disabled:opacity-50 outline-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 sm:text-sm rounded-lg" placeholder="Cc" />
                    </div>
                    {/* <div>
                        <input type="text" name="bcc" id="bcc" class="block w-full border disabled:cursor-not-allowed disabled:opacity-50 outline-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 sm:text-sm rounded-lg" placeholder="Bcc" />
                    </div> */}
                    <div>
                        <textarea id="body" class="w-full h-64 block rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 p-4 border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-base focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm" placeholder="Message..."></textarea>
                    </div>
                    <div class="flex items-center space-x-2 my-2">
                        <div class="w-40 flex items-center justify-between text-gray-600 px-2 py-1.5  border border-gray-400 rounded-lg hover:bg-gray-200">
                            <div class="w-28 flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-sm truncate">Review.zip</span>
                            </div>
                            <button class="hover:text-gray-900" title="Remove">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="w-40 flex items-center justify-between text-gray-600 px-2 py-1.5  border border-gray-400 rounded-lg hover:bg-gray-200">
                            <div class="w-28 flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-sm truncate">Approve.zip</span>
                            </div>
                            <button class="hover:text-gray-900" title="Remove">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2">
                            <button class="bg-blue-500 hover:bg-blue-700 rounded-lg px-12 py-1.5 text-gray-100 hover:shadow-xl transition duration-150">Send</button>
                            <button title="Attach Files">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                            </button>
                        </div>
                        <button class="mr-4 text-gray-700 hover:text-gray-900" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
