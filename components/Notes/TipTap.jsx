import { EditorContent,   BubbleMenu } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaBold, FaCode, FaItalic, FaStrikethrough, FaUnderline } from 'react-icons/fa'
export default function TipTap({editor, addClass}){
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
    }
  };

  const handlerKey = e => {
    const Editor = e.target.editor
    const { to } = Editor.state.selection
    const text = Editor.view.state.doc.textBetween(1, to)

    // if (text.includes('/')) {
    //   setOpen(true)
    // } else {
    //   setOpen(false)
    // }

    // if(e.key == "/"){
    //   setOpen(true)
    // }
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  const handlerBubbleComponent = event => {
    const input = document.getElementById("editorContent")
    const element = document.getElementById("bubbleComponent")
    const inputRect = input.getBoundingClientRect();
    const x = inputRect.left + event.target.editor.state.selection.head * 7;
    const y = inputRect.top + inputRect.height;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  }

  if(editor)
  return (
    <div ref={dropRef} className="relative">
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white shadow-lg flex items-center rounded-md text-sm">
          <button
            onClick={() => editor.commands.toggleHighlight()}
            className={`${editor.isActive('highlight') ? 'bg-blue-50' : ''} p-2 border-r`}
          >
            Highlight
          </button>
          <button
            onClick={setLink}
            className={`${editor.isActive('link') ? 'bg-blue-50' : ''} p-2 border-r`}
          >
            Link
          </button>
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
            className={editor.isActive('bold') ? "bg-blue-50 p-2":"p-2"}
          >
            <FaBold className="w-5 h-5"/>
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
            className={editor.isActive('italic') ? "bg-blue-50 p-2":"p-2"}
          >
            <FaItalic className="w-5 h-5"/>
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
            className={editor.isActive('strike') ? "bg-blue-50 p-2":"p-2"}
          >
            <FaStrikethrough className="w-5 h-5"/>
          </button>
          <button
          title="Underline (Ctrl + U)"
            onClick={() => editor.commands.toggleUnderline()}
            className={editor.isActive('underline') ? "bg-blue-50 p-2":"p-2"}
          >
            <FaUnderline className="w-5 h-5"/>
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
            <FaCode className="w-5 h-5"/>
          </button>
        </BubbleMenu>
        <div id='bubbleComponent' className={`bg-white fixed shadow-md w-56 p-2 ${open ? "block":"hidden"}`}>
          ashaksas
        </div>
        <EditorContent id="editorContent" onInput={e => handlerBubbleComponent(e)} onKeyDown={e => handlerKey(e)} className={`outline-none`} editor={editor}/>
    </div>
  )
}