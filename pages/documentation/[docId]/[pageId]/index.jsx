import MainPage from '@components/PublishDocumentation/MainPage'
import Page from '@components/PublishDocumentation/Page'
import Seo from '@components/seo'
import DocumentationRepository from '@repositories/DocumentationRepository'
import { MyContext } from 'context/MyProvider'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { FaUsers } from 'react-icons/fa'

async function getPage(docId) {
    let arr = null
    const result = await DocumentationRepository.getPageDocumentation({
      xa: JSON.parse(localStorage.getItem("XA")),
      id: docId
    })
    arr = result.data
  
    function buildTree(arr, parentId) {
      let tree = [];
      arr.forEach((val) => {
        if (val.pid === parentId) {
          let children = buildTree(arr, val.id);
          if (children.length) {
            val.child = children;
          }
          tree.push(val);
        }
      })
  
      return tree;
    }
  
    let finalData = buildTree(arr, 'ortu');

    arr.map(async (item) => {
        const breaddata = await getBreadCrumb(JSON.parse(JSON.stringify(finalData)), item)
        item.breadcrumb = breaddata
    })
    console.log(finalData, arr)
    return {
      finalData,
      result: arr
    }
}

const getBreadCrumb = async (data, value) => {
    let obj = []
    data.forEach((val) => {
      if (val.hasOwnProperty("child")) {
        const child = val.child
        delete val.child
        child.forEach(val2 => {
          obj.push(val2)
        })
      }
      obj.push(val)
    });

    let bread = []
    function getTree(value) {
      if (value.pid == "ortu") {
        bread.push(value)
      } else {
        bread.push(value)
        obj.forEach(val => {
          if (val.id == value.pid) {
            getTree(val)
          }
        })
      }
    }

    getTree(value)
    return bread
}

export default function HalamanPage({ profileData, pageId, docId }) {
    const { theme, setTheme } = useTheme()
    const context = useContext(MyContext)
    const statename = "publishDoc"
    const [loading, setLoading] = useState(0)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getDocInfo = async () => {
        const getXA = JSON.parse(localStorage.getItem("XA"))
        const result = await DocumentationRepository.getDocumentationByID({ xa: getXA, id: docId })
        // await delay(1000)
        setLoading(30)
        if (result.status == 0) {
            const members = await DocumentationRepository.getTeam({ id: docId, type: 1, xa: getXA })
            // await delay(1500)
            setLoading(60)
            result.data['assigns'] = members.data
            const pages = await getPage(docId)
            // structure pages
            // await delay(2000)
            setLoading(90)
            result.data['pages'] = pages.result ?? []
            result.data['pagesStructure'] = pages.finalData ?? []
            console.log(result.data)
            // await delay(500)
            setLoading(100)
            context.setData({ ...context, [statename]: { ...context[statename], [docId]: result.data } })
        }
    }

    useEffect(() => {
        if(!context[statename]?.[docId]){ // cek apakah doc ini pernah diload
            getDocInfo()
        }
    }, [docId])
    console.log(context?.[statename]?.[docId])



    if(Object.keys(context?.[statename]).length > 0 && loading == 100){
        return (
            <div className='w-screen h-screen overflow-hidden'>
                <Seo title={`Title`} 
                    />
                <div className='w-full border-b border-zinc-500 py-4 px-5'>
                    {/* navbar */}
                    <div className='w-full flex items-center gap-5 justify-between'>
                        <div className='flex items-center gap-5 w-full'>
                            <img src="/images/logo/logo.png" alt="logo" className='w-12 h-auto'/>
                            <div>
                                <h1 className='text-xl font-bold'>{context?.[statename]?.[docId]?.name}</h1>
                                {/* <p>Lorem ipsum dolor sit amet.</p> */}
                            </div>
                        </div>
                        <div className=' flex items-center gap-5 justify-end'>
                                <button className='text-zinc-500 '>
                                    <FaUsers className='text-3xl'/>
                                </button>
                                <button onClick={() => setTheme(theme == "light" ? "dark" : "light")}>
                                    <svg fill="none" stroke="currentColor" className={`${theme == "light" ? "block" : "hidden"} w-8 h-8`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                    </svg>
                                    <svg fill="none" stroke="currentColor" className={`${theme == "dark" ? "block" : "hidden"} w-8 h-8`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                </button>
                                <form class="flex items-center max-w-sm min-w-80 mx-auto w-full">   
                                    <label for="simple-search" class="sr-only">Search</label>
                                    <div class="relative w-full">
                                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <kbd class="px-2 py-1.5 text-xs font-semibold text-blue-800 bg-blue-100 border border-blue-200 rounded-lg dark:bg-blue-600 dark:text-blue-100 dark:border-blue-500">Ctrl+K</kbd>
                                        </div>
                                        <input type="text" id="simple-search" class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search topic.." required />
                                    </div>
                                    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                        <span class="sr-only">Search</span>
                                    </button>
                                </form>
                                <Link href={`/usr/documentation?id=${docId}`}>
                                    <button className='btn-primary'>Editor</button>
                                </Link>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center mx-auto container'>
                    <div className='w-full xl:w-1/4 h-screen overflow-y-auto py-10'>
                        <div className='w-full h-full flex-1 overflow-y-auto'>
                            {
                                context[statename]?.[docId].pagesStructure.map((page, index) => {
                                    return (
                                        <Page page={page} key={index}/>
                                    )
                                })
                            }
                        </div>
                        <footer></footer>
                    </div>
                    <MainPage/>
                </div>
            </div>
        )
    }else return (
        <div className='w-full flex items-center justify-center h-screen'>
            <h1 className='text-6xl text-blue-500 font-bold'>{loading}%</h1>
        </div>
    )
}


export async function getServerSideProps({ query }) {
    return {
      props : {
        pageId: query.pageId ?? null,
        docId: query.docId ?? null
      }
    };
  }