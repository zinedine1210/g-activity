import Link from "next/link"
import { HiHome } from "react-icons/hi"

export default function BreadCrumbPage({
    list
}) {
    
  return (
        <nav class="flex" aria-label="Breadcrumb" className="mb-5 ">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li>
                    <HiHome className="text-xl"/>
                </li>
                {
                    list && list.reverse().map((item, index) => {
                        return (
                            <li key={index}>
                                <div class="flex items-center">
                                    <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <Link href={`/documentation/${item.document_id}/${item.id}`}>
                                        <button type="button" class=" font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{item.title}</button>
                                    </Link>
                                </div>
                            </li>

                        )
                    })
                }
            </ol>
        </nav>
  )
}
