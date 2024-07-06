import { useState } from "react"
import { BsEye, BsEyeSlash } from "react-icons/bs"

export default function PasswordInput({ label, value, name, handlerChange, isDisabled, isRequired = true }) {
  const [active, setActive] = useState(false)

  const isType = active ? "text" : "password"
  return (
    <div>
      <h1 className="font-semibold">{label}</h1>
      <div className="relative">
        <input type={isType} disabled={isDisabled} required={isRequired} name={name} onChange={e => handlerChange(e.target.value, e.target.name)} value={value} className="mt-2 block w-full placeholder-zinc-400/70 rounded-lg border peer transition-colors invalid:focus:border-red-400 invalid:focus:ring-red-300 invalid:focus:ring-opacity-40 invalid:border-red-200 border-zinc-200 bg-white px-5 py-2.5 text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-dark dark:bg-dark dark:text-white" autoComplete="off" />
        <button type="button" className="absolute top-1/2 -translate-y-1/2 right-5" onClick={() => setActive(!active)}>{!active ? <BsEye /> : <BsEyeSlash />}</button>
      </div>
    </div>
  )
}
