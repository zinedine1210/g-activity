export default function Pre_Quote(props) {
  const {device} = props
  return (
    <div className="block">
      <div className="flex gap-2">
        <span className={`${device == 1 ?"text-3xl":device == 2 ? "text-2xl":"text-xl"} font-semibold font-sans text-zinc-500 self-start`}>"</span>
        <h1 className={`${device == 1 ?"text-xl":device == 2 ? "text-base":"text-base"} text-zinc-500 dark:text-zinc-300`} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
        <span className={`${device == 1 ?"text-3xl":device == 2 ? "text-2xl":"text-xl"} font-semibold font-sans text-3xl text-zinc-500 self-end`}>"</span>
      </div>
    </div>
  )
}
