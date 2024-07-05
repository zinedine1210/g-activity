import Swal from "sweetalert2"

export default function Copy(props) {
    const handlerChange = (val, type) => {
      props.property[type] = val
    }
    const handlerCopy = () => {
      navigator.clipboard.writeText(props.property.text).then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Text copied to clipboard',
          showConfirmButton: false,
          timer: 1000
        })
      })
    }
    const handlerKey = (e) => {
      if(e.key == "Enter"){
        e.preventDefault()
      }
    }

  return (
    <div>
      {/* <p className="editable-text text-xl font-semibold mb-1 text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={(e) => handlerKey(e)} onBlur={(e) => handlerChange(e.target.textContent, "caption")} maxLength={10} autoFocus={true} contentEditable data-placeholder={"Caption here"}>{props.property.caption}</p> */}
      <div className="border-l-4 px-5 py-3 border-primary dark:border-dark bg-blue-100 dark:bg-darkPrimary rounded-md flex items-center justify-between">
          <p id={`property-${props.property.index}`} className="editable-text text-base text-zinc-600 dark:text-zinc-300" role={"textbox"} spellCheck="false" onKeyDown={(e) => handlerKey(e)} onBlur={(e) => handlerChange(e.target.textContent, "text")} maxLength={10} autoFocus={true} contentEditable data-placeholder={props.lang("typeCopy")}>{props.property.text}</p>

          <button onClick={() => handlerCopy()}>
              <svg fill="none" stroke="currentColor" className="w-6 h-6 hover:stroke-primary transition-all duration-300 ease-in-out" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
              </svg>
          </button>
      </div>
    </div>
  )
}
