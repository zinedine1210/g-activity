import { marked } from "marked"

export default function Tip(props) {
  const handlerChange = (val, type) => {
    const mark = marked(val)
    props.property[type] = mark
  }

  return (
    <div className="border-l-4 px-5 py-3 border-primary dark:border-dark bg-blue-100 dark:bg-darkPrimary rounded-md">
        <h1 className="flex items-center gap-2 font-semibold mb-2">
            <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <p id={`property-${props.property.index}`} className="editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "title")} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeTitle")} dangerouslySetInnerHTML={{__html:props.property.title}}></p>
        </h1>

        <p className="editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.innerHTML, "text")} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeSomething")} dangerouslySetInnerHTML={{__html:props.property.text}}></p>
    </div>
  )
}
