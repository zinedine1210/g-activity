export default function Pre_NumberingList(props) {
    const {property} = props

  return (
    <div style={{marginLeft:(property.tab - 1) * 25+'px'}} className="mb-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-zinc-500">{property.hasOwnProperty("number") ? property.number :"--"}.</span>
        <h1 className="text-base text-zinc-500 dark:text-zinc-300 px-2" dangerouslySetInnerHTML={{__html:property.text ? property.text:"-"}}></h1>
      </div>
    </div>
  )
}
