import { useEffect, useRef, useState } from "react"
import {FaChevronDown, FaTable} from "react-icons/fa"

export default function DropdownTable({editor}) {
    const dropdownRef = useRef(null)
    const [open, setOpen] = useState(false)

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


  return (
    <div ref={dropdownRef}>
        <button className="p-2 flex items-center gap-2 font-semibold" onClick={() => setOpen(!open)}>
            <FaTable />
            <FaChevronDown className={`${open ? "rotate-180":""} transition-all duration-300 w-2`}/>
        </button>
        <div className={`bg-white shadow-md rounded-md absolute z-20 ${open ? "block":"hidden"}`}>

            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                }
                className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}
            >
                Insert Table
            </button>
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Add Column Before
            </button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Add Column After
            </button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Delete Column
            </button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Add Row Before
            </button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>Add Row After</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Delete Row
            </button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>Delete Table</button>
            <button onClick={() => editor.chain().focus().mergeCells().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>Merge Cells</button>
            <button onClick={() => editor.chain().focus().splitCell().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>Split Cell</button>
            <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`} >
                Toggle Header Column
            </button>
            <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Toggle Header Row
            </button>
            <button onClick={() => editor.chain().focus().toggleHeaderCell().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Toggle Header Cell
            </button>
            <button onClick={() => editor.chain().focus().mergeOrSplit().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Merge Or Split
            </button>
            <button onClick={() => editor.chain().focus().setCellAttribute('colspan', 2).run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Set Cell Attribut
            </button>
            <button onClick={() => editor.chain().focus().fixTables().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Fix Table
            </button>
            <button onClick={() => editor.chain().focus().goToNextCell().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Go To Next Cell
            </button>
            <button onClick={() => editor.chain().focus().goToPreviousCell().run()} className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm`}>
                Go To Previous Cell
            </button>
        </div>
    </div>
  )
}
