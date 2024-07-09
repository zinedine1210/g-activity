import { useEffect, forwardRef, useImperativeHandle } from 'react'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from "@tiptap/extension-text-align"
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { lowlight } from 'lowlight'
import Link from "@tiptap/extension-link"
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Image from "@tiptap/extension-image"
import MenuBar from "../../Notes/MenuBar"
import BubbleBar from '../../Notes/BubbleBar'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

const TipTapTask = forwardRef((props, ref) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link,
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily.configure({
        types: ['textStyle'],
      })
    ],
    onUpdate: ({ editor }) => {
      props.handlerEnter(editor.getHTML())
    },
    autofocus: true,
    content: props.value,
  })

  useImperativeHandle(ref, () => ({
    clearEditor: () => {
      editor.chain().clearContent().run();
    }
  }));


  if (editor)
    return (
      <div className='border rounded-md relative'>
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100, maxWidth: "none" }} className="rounded-md bg-white shadow-lg flex items-center w-fit gap-1">
          <BubbleBar editor={editor} />
        </BubbleMenu>
        <EditorContent className={`outline-none ${props.style}`} editor={editor} />
        <div className='absolute bottom-full bg-zinc-500 text-xs px-2 py-0.5 right-0 rounded-t-md text-white'>
          Select Text to Show Toolbar
        </div>
      </div>
    )
})

export default TipTapTask;
