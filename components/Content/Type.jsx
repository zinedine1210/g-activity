import Title from "./Component/Title";
import Paragraph from "./Component/Paragraph"
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/MyProvider";
import Tip from "./Component/Tip";
import Header from "./Component/Header";
import Copy from "./Component/Copy";
import Quote from "./Component/Quote";
import NumberingList from "./Component/NumberingList";
import BulletedList from "./Component/BulletedList";
import Text from "./Component/Text";
import Image from "next/image";
import LinkPage from "./Component/LinkPage";
import EmbedImage from "./Component/EmbedImage";
import BookMark from "./Component/BookMark";
import Video from "./Component/Video";

export default function Type(props) {
    const { property, lang } = props
    const [add, setAdd] = useState(null)
    const [option, setOption] = useState(false)
    const [grid, setGrid] = useState(false)
    const context = useContext(MyContext)
    const dropRef = useRef(null)

    const handleOutsideClick = (event) => {
        if (dropRef.current && !dropRef.current.contains(event.target)) {
            setAdd(false);
            setOption(false);
            setGrid(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handlerDragOver = (e) => {
        e.preventDefault()
        if(e.target.classList.contains("dragable")){
            e.target.classList.add("drag-hover")
        }
    }
    
    const handlerDragLeave = (e) => {
        e.preventDefault()
        if(e.target.classList.contains("dragable")){
            e.target.classList.remove("drag-hover")
        }
    }

    // Title
    if(property.id == 1){
        return (
            <>
                <Title property={property} lang={lang} />
                {
                    props.itemLength <= 1 ?
                    <button onDrop={(e) => props.handleDrop(e, property, 'components')} onDragOver={(e) => handlerDragOver(e)} onDragLeave={(e) => handlerDragLeave(e)} type="button" className='dragable border-2 border-dashed rounded-lg text-center text-base block w-full py-5 font-semibold uppercase tracking-wider'>
                        Drop Components
                    </button>
                    :""
                }
            </>
        )
    }else{
        const lengthTab = property.tab ? property.tab - 1 : 0
        return (
            <div className="relative" ref={dropRef} style={{marginLeft:(lengthTab) * 25+'px'}}>
                <button draggable onDragStart={(e) => props.handleDragStart(e, property)} onDrop={(e) => props.handleDrop(e, property, 'components')} onDragOver={(e) => handlerDragOver(e)} onDragLeave={(e) => handlerDragLeave(e)} type="button" className='dragable block hover:border-2 rounded-md transition-all w-full text-start p-1 relative peer'>
                    {
                        property.id == 2 ?
                        <Paragraph lang={lang} property={property} handlerAddSection={(value, from) => props.handlerAddSection(value, from)}/>
                        :""
                    }
                    {
                        property.id == 0 ?
                        <Text lang={lang} property={property} handlerUpdateComponent={(value, from) => props.handlerUpdateComponent(value, from)} handlerAddSection={(value, from) => props.handlerAddSection(value, from)} setAdd={(value) => setAdd(value)}/>
                        :""
                    }
                    {
                        property.id == 3 ?
                        <Tip lang={lang} property={property}/>
                        :""
                    }
                    {
                        property.id == 4 || property.id == 5 || property.id == 6 ?
                        <Header lang={lang} property={property} handlerAddSection={(value, from) => props.handlerAddSection(value, from)}/>
                        :""
                    }
                    {
                        property.id == 7 ?
                        <Copy lang={lang} property={property}/>
                        :""
                    }
                    {
                        property.id == 8 ?
                        <Quote lang={lang} property={property}/>
                        :""
                    }
                    {
                        property.id == 9 ?
                        <div className="h-7 w-full flex items-center justify-center">
                            <span className="block bg-zinc-400 w-full h-0.5"></span>
                        </div>
                        :""
                    }
                    {
                        property.id == 10 ?
                        <LinkPage lang={lang} />
                        :""
                    }
                    {
                        property.id == 11 ?
                        <BulletedList lang={lang} property={property} handlerUpdateComponent={(value, from) => props.handlerUpdateComponent(value, from)} handlerAddSection={(value, from) => props.handlerAddSection(value, from)}/>
                        :""
                    }
                    {
                        property.id == 12 ?
                        <NumberingList lang={lang} pengaturanNumber={(property) => props.pengaturanNumber(property)} property={property} handlerUpdateComponent={(value, from) => props.handlerUpdateComponent(value, from)} handlerAddSection={(value, from) => props.handlerAddSection(value, from)}/>
                        :""
                    }
                    {
                        property.id == 13 ?
                        <EmbedImage lang={lang} property={property}/>
                        :""
                    }
                    {
                        property.id == 14?
                        <BookMark lang={lang} property={property}/>
                        :""
                    }
                    {
                        property.id == 15?
                        <Video lang={lang} property={property}/>
                        :""
                    }
                </button>


                {/* Add */}
                <div className={`${add ? "block absolute top-0 left-0":"hidden"} bg-white dark:bg-darkPrimary p-3 w-64 rounded-md shadow-md overflow-y-scroll max-h-96 z-20`}>
                    <ul className="space-y-2">
                        {
                            context.dataComponents.map((item, id) => {
                                return (
                                    <li onClick={() => add == "change" ? props.handlerUpdateComponent(item, property):props.handlerAddSection(item, property)} className="cursor-pointer flex items-center gap-2 hover:bg-secondary py-1 px-2 transition-all duration-300 ease-in-out rounded-md" key={id}>
                                        <Image src={`/images${item.image}`} alt={item.image} width={40} height={40}/>
                                        <div>
                                            <h1 className="text-sm font-semibold capitalize">{lang(item.type)}</h1>
                                            <p className="text-xs text-zinc-500">{lang(`${item.type}2`)}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className={`${grid ? "block absolute top-0 right-0":"hidden"} bg-white dark:bg-darkPrimary p-3 w-64 rounded-md shadow-md overflow-y-scroll max-h-96 z-20`}>
                    <ul className="space-y-2">
                        {
                            context.dataComponents.map((item, id) => {
                                return (
                                    <li onClick={() => props.handlerAddGrid(item, property)} className="cursor-pointer flex items-center gap-2 hover:bg-secondary py-1 px-2 transition-all duration-300 ease-in-out rounded-md" key={id}>
                                        <Image src={`/images${item.image}`} alt={item.image} width={40} height={40}/>
                                        <div>
                                            <h1 className="text-sm font-semibold capitalize">{lang(item.type)}</h1>
                                            <p className="text-xs text-zinc-500">{lang(`${item.type}2`)}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <ul className={`bg-white dark:bg-darkPrimary space-y-1 rounded-md shadow-md p-1 w-52 overflow-hidden max-h-72 z-20 ${option ? "block absolute top-0 left-0":"hidden"}`}>
                    <li><button onClick={() => props.handlerDelete(property)} className="w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 flex items-center gap-2">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    {lang("delete")}
                    </button>
                    </li>
                    <li><button onClick={() => props.handlerDuplicate(property)} className="w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 flex items-center gap-2">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    {lang("duplicate")}
                    </button>
                    </li>
                    <li><button onClick={() => {setAdd("change"); setOption(false)}} className="button-close w-full text-start py-1 px-2 rounded-md hover:bg-blue-100 transition-all duration-300 flex items-center gap-2">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    {lang("turn")}
                    </button>
                    </li>
                </ul>

                <span className={`${props.cols ? "top-1 -left-16":"-left-10 top-1/2 transform -translate-y-1/2 -translate-x-1/2"} absolute hover:opacity-100 invisible hover:visible peer-hover:visible peer-hover:opacity-100 opacity-0 transition-all duration-300 delay-100 grid grid-cols-2 gap-1 z-30`}>
                    <button className="block button-close" onClick={() => setAdd(add ? null:"add")}>
                        <svg fill="none" stroke="currentColor" className="w-7 h-7 hover:stroke-zinc-400 transition-all duration-300 stroke-zinc-600 dark:stroke-zinc-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    <button className="block button-close" onClick={() => setOption(!option)}>
                        <svg fill="none" stroke="currentColor" className="w-7 h-7 hover:stroke-zinc-400 transition-all duration-300 stroke-zinc-600 dark:stroke-zinc-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                    </button>
                </span>

                <button onClick={() => setGrid(!grid)} className={`${props.cols ? "hidden":"block"} button-close bg-white dark:bg-darkPrimary rounded-full shadow-md absolute top-1/2 cursor-pointer z-20 -right-0 transform -translate-y-1/2 translate-x-1/2 hover:opacity-100 invisible hover:visible peer-hover:visible peer-hover:opacity-100 opacity-0 transition-all duration-300 delay-100`}>
                    <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        )
    }

}
