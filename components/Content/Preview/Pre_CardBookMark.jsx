import useSWR from "swr"

const fetcher = async (url) => {
    const json = await fetch(url).then(res => res.json())
    console.log(json);
    return json
}

export default function Pre_CardBookMark({property, device}) {
    const { data, error, isLoading } = useSWR(`https://jsonlink.io/api/extract?url=${property.link}`, fetcher)

    if(error){
        return (
            <div className="flex items-center justify-center w-full py-10">
                <h1>Web Not Found</h1>
            </div>
        )
    }
    if(isLoading){
        return <div className="text-center font-semibold text-zinc-500 uppercase tracking-wider">Searching...</div>
    }

    if(data){
        return (
            <div className={`w-full bg-white dark:bg-darkPrimary shadow-md rounded-md mb-2 ${device == 3 ? "block":"flex"} h-full min-h-24 overflow-y-scroll relative`}>
                <div className={`${device == 3 ? "w-full":"w-3/4"} p-3 relative`}>
                    <h1 className="font-semibold text-lg">{data.title ? data.title : <span className="text-red-500">Not found</span>}</h1>
                    <p className="font-light text-base text-zinc-500 dark:text-zinc-300">{data.description ? data.description.length > 100 ? data.description.substring(0, 100)+"...":data.description:<span className="text-red-500">Not found</span>}</p>
                    <a href={data.url} target={"_blank"} className="font-light text-sm text-zinc-500 dark:text-zinc-300 hover:text-primary transition-all duration-300 mt-3 inline-block">{data.url ? data.url.length > 100 ? data.url.substring(0, 100)+"...":data.url:<span className="text-red-500">Not found</span>}</a>
                </div>
                {
                    data.images.length > 0 ?
                        <div className={`${device == 3 ? "w-full h-32":"w-1/4"} bg-origin-content bg-center`} style={{backgroundImage:`url(${data.images[0]})`}}>
                        </div>
                    :""
                }
            </div>
        )
    }
}
