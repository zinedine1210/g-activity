export default function Title(props) {
  const handlerChange = (val) => {
    props.property.text = val
  }
  return (
    <div className="block mb-2">
      <h1 id={`property-1`} className="editable-text text-5xl font-extrabold" role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent)} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("untitled")}>{props.property.text}</h1>
    </div>
  )
}
