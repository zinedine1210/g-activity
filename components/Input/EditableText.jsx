export default function EditableText(props) {
  const text = `text-`+props.text

  return (
    <h1 role={"textbox"} spellCheck="false" onBlur={(e) => props.handlerChange(e.target.textContent)} maxLength={10} autoFocus={props.autoFocus} contentEditable data-placeholder={props.placeholder} className={`editable-text ${text}`}>{props.value}</h1>
  )
}
