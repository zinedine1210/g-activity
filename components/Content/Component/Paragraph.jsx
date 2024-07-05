import { marked } from "marked";

export default function Paragraph(props) {

  const handlerChange = (val) => {
    const mark = marked(val)
    props.property.text = mark
  }

  return (
    <div>
      <h1 id={`property-${props.property.index}`} className="editable-text text-base text-zinc-500 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeParagraph")} dangerouslySetInnerHTML={{__html:props.property.text}}></h1>
    </div>
  )
}
