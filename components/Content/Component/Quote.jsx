import { marked } from "marked"

export default function Quote(props) {
    const handlerChange = (val) => {
      const mark = marked(val)
      props.property.text = mark
    }

  return (
    <div className="block">
      <div className="flex gap-2">
        <span className="font-semibold font-sans text-3xl text-zinc-500 self-start">"</span>
        <h1 id={`property-${props.property.index}`} className="editable-text text-xl text-zinc-500 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeQuote")} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
        <span className="font-semibold font-sans text-3xl text-zinc-500 self-end">"</span>
      </div>
    </div>
  )
}
