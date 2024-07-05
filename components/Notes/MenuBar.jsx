import { useCallback, useEffect, useRef, useState } from "react";
import { FaBold, FaItalic, FaStrikethrough, FaUndo, FaRedo, FaUnderline, FaCode, FaListOl, FaListUl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaFileCode, FaQuoteLeft, FaImage, FaChevronDown } from "react-icons/fa"
import DropdownTable from "./DropdownTable";

export default function MenuBar({ editor }){
  const [isOpen, setIsOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false)
  const [family, setFamily] = useState(false)
  const dropdownRef = useRef(null);
  const dropdownUpload = useRef(null)
  const dropdownFamily = useRef(null)

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (dropdownUpload.current && !dropdownUpload.current.contains(event.target)) {
      setOpenUpload(false);
    }
    if (dropdownFamily.current && !dropdownFamily.current.contains(event.target)) {
      setFamily(false);
    }
  };

  let FontFamily = ['cursive','Comic Sans MS','serif',"monoscape", "Inter"]

  const uploadImage = e => {
    e.preventDefault()
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image()
      img.src = e.target.result

      img.onload = function(){
        editor.chain().focus().setImage({ src: e.target.result }).run()
      }
    }
    reader.readAsDataURL(file);
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

    return (
      <>
      <div className="border-r-2 px-2">
        <button
          title="Undo (Ctrl + Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          className={'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
        >
          <FaUndo className={`${!editor.can().chain().focus().undo().run() ? "text-zinc-200":""} w-4 h-4`}/>
        </button>
        <button
        title="Redo (Ctrl + Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          className={'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
        >
          <FaRedo className={`${!editor.can().chain().focus().redo().run() ? "text-zinc-200":""} w-4 h-4`}/>
        </button>
      </div>
      <div ref={dropdownRef}>
        <button className={`${editor.isActive("heading") ? "border-2 border-blue-50 rounded-md text-blue-500":""} p-2 flex items-center gap-2 font-semibold text-sm`} onClick={() => setIsOpen(!isOpen)}>
          Heading
          {editor.isActive("heading", {level:1}) ? " 1":""}
          {editor.isActive("heading", {level:2}) ? " 2":""}
          {editor.isActive("heading", {level:3}) ? " 3":""}
          {editor.isActive("heading", {level:4}) ? " 4":""}
          {editor.isActive("heading", {level:5}) ? " 5":""}
          {editor.isActive("heading", {level:6}) ? " 6":""}
          <FaChevronDown className={`${isOpen ? "rotate-180":""} transition-all duration-300 w-2`}/>
        </button>
        <div className={`bg-white shadow-md rounded-md absolute z-20 ${isOpen ? "block":"hidden"}`}>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-2xl ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 1
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-xl ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 2
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-lg ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 3
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-base ${editor.isActive('heading', { level: 4 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 4
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm ${editor.isActive('heading', { level: 5 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 5
            </button>
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-xs ${editor.isActive('heading', { level: 6 }) ? 'bg-blue-50 text-blue-500' : ''}`}
            >
            Heading 6
            </button>
        </div>
      </div>
      <div ref={dropdownFamily}>
        <button className={`${editor.isActive("textStyle") ? "border-2 border-blue-50 rounded-md text-blue-500":""} p-2 flex items-center gap-2 font-semibold text-sm w-full`} onClick={() => setFamily(!family)}>
          {editor.isActive("textStyle") ? "":"Poppins"}
          {editor.isActive("textStyle", {fontFamily:"Inter"}) ? "Inter":""}
          {editor.isActive("textStyle", {fontFamily:"Comic Sans MS"}) ? "Comic Sans MS":""}
          {editor.isActive("textStyle", {fontFamily:"monoscape"}) ? "Monoscape":""}
          {editor.isActive("textStyle", {fontFamily:"cursive"}) ? "Cursive":""}
          {editor.isActive("textStyle", {fontFamily:"serif"}) ? "Serif":""}
          <FaChevronDown className={`${family ? "rotate-180":""} transition-all duration-300 w-2`}/>
        </button>
        <div className={`bg-white shadow-md rounded-md absolute z-20 ${family ? "block":"hidden"}`}>
            <button
              onClick={() => editor.chain().focus().unsetFontFamily().run()}
              className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm ${editor.isActive('textStyle') ? '' : 'hidden'}`}
              >
                Default
            </button>
            {FontFamily.map((item, key) => {
              return (
                <button
                key={key}
                onClick={() => editor.chain().focus().setFontFamily(item).run()}
                className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 font-semibold text-sm ${editor.isActive('textStyle', { fontFamily: item }) ? 'bg-blue-50 text-blue-500' : ''}`}
                >
                  {item}
                </button>
              )
            })}
        </div>
      </div>
      <button
      title="Bold (Ctrl + B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        <FaBold className="w-4 h-4"/>
      </button>
      <button
      title="Italic (Ctrl + I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase italic' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300 italic'}
      >
        <FaItalic className="w-4 h-4"/>
      </button>
      <button
      title="Strike Throught"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase line-through' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300 line-through'}
      >
        <FaStrikethrough className="w-4 h-4"/>
      </button>
      <button
      title="Underline (Ctrl + U)"
        onClick={() => editor.commands.toggleUnderline()}
        className={editor.isActive('underline') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase underline' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300 underline'}
      >
        <FaUnderline className="w-4 h-4"/>
      </button>
      <button
      title="Mark as Code (Ctrl + E)"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        <FaCode className="w-4 h-4"/>
      </button>
      <div className="border-l border-r px-2 flex items-center gap-1">
        <button
          onClick={() => editor.commands.setTextAlign('left')}
          className={editor.isActive({textAlign:"left"}) ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
        >
          <FaAlignLeft className="w-4 h-4"/>
        </button>
        <button
          onClick={() => editor.commands.setTextAlign('center')}
          className={editor.isActive({textAlign:"center"}) ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
        >
          <FaAlignCenter className="w-4 h-4"/>
        </button>
        <button
          onClick={() => editor.commands.setTextAlign('right')}
          className={editor.isActive({textAlign:"right"}) ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
        >
          <FaAlignRight className="w-4 h-4"/>
        </button>
      </div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        <FaListUl className="w-4 h-4"/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
      <FaListOl className="w-4 h-4"/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        <FaFileCode className="w-4 h-4"/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        <FaQuoteLeft className="w-4 h-4" />
      </button>
      <div ref={dropdownUpload}>
        <button
          onClick={() => setOpenUpload(!openUpload)}
          className="p-2 flex items-center gap-2"
        >
          <FaImage className="w-4 h-4"/>
          <FaChevronDown className={`${openUpload ? "rotate-180":""} transition-all duration-300 w-2`}/>
        </button>
        <div className={`bg-white shadow-md rounded-md absolute z-20 ${openUpload ? "block":"hidden"}`}>
            <label htmlFor="uploadimage"
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 text-sm`}
            >
              <input type="file" className="hidden" id="uploadimage" onChange={(e) => uploadImage(e)} />
              Upload dari komputer
            </label>
            <button
            onClick={addImage}
            className={`block w-full text-start hover:bg-blue-50 transition-all duration-300 first-letter:uppercase p-2 text-sm`}
            >
              Telusuri internet
            </button>
        </div>
      </div>
      {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Section
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button> */}
      {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'bg-blue-50 text-blue-500 font-semibold p-2 rounded-md first-letter:uppercase' : 'p-2 first-letter:uppercase rounded-md hover:bg-zinc-100 transition-all duration-300'}
      >
        paragraph
      </button> */}
      <DropdownTable editor={editor}/>
    </>
    )
  }