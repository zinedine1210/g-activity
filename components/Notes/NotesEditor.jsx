import { Suspense, useContext, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { useTranslation } from "react-i18next";
import Layout from "../Layouts/Layout";
import { MyContext, urlData } from "../../context/MyProvider";
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import NavbarNote from "../Templates/NavbarNote";
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
import TipTap from "../Notes/TipTap";
import Image from "@tiptap/extension-image"
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { getYDocInstance, cleanUpYDocInstance } from '@components/YDoc/ydoc';
import NoteRepository from "../../repositories/NoteRepository";


lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

export default function NotesEditor(props) {
  const ydoc = getYDocInstance();
  const {t} = useTranslation("common")
  const context = useContext(MyContext)
  const [provider, setProvider] = useState(null)
  
  useEffect(() => {
    if (!provider) {
      setProvider(new WebrtcProvider(props.data.id, ydoc))
    }
    context.setDataDocumentation(props.data)
    return () => {
      cleanUpYDocInstance(ydoc, props.data.id);
    };
  }, [props.data.id])

  
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
      Collaboration.configure({
        document:ydoc
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection:true
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily.configure({
        types: ['textStyle'],
      })
    ],
    onBlur:({editor}) => {
      handlerEditor(editor.getHTML())
    },
    onUpdate:({editor}) => {
    },
    autofocus:true
  })

  useEffect(() => {
    if (editor && props.data.content) {
      editor.commands.setContent(props.data.content);
    }
  }, [editor, props.data.content])

  const handlerEditor = (value) => {
    props.data.content = value
  }


  const handlerChange = value => {
    context.dataDocumentation.title = value
    context.setDataDocumentation(context.dataDocumentation)
  }
  
  useBeforeunload( e => {
    // NoteRepository.putNote({ data:context.dataDocumentation, id:context.dataDocumentation.id, xa:JSON.parse(localStorage.getItem("XA")) })
    return "Really?"
  })

  if(context.dataDocumentation && editor)
  return (
    <Layout title={"NOTES EDITOR"} desc="DESKRIPSI NOTES EDITOR" lang={t}>
      <NavbarNote lang={t} editor={editor} profileData={props.profileData}/>
      <Suspense fallback={"Loading"}>
        <div className="w-full h-screen overflow-y-scroll pt-20 pb-56 bg-zinc-100 dark:bg-darkSecondary">
          <div className="bg-white px-5 md:px-20 py-10 shadow-md rounded-lg w-full md:w-1/2 mx-auto relative">
            <h1 role={"textbox"} spellCheck="false" onBlur={(e) => handlerChange(e.target.textContent)} maxLength={10} contentEditable data-placeholder={"Judul Catatan"} className={`editable-text text-4xl font-semibold mb-10`}>{context.dataDocumentation.title}</h1>
            <TipTap editor={editor} />
            <span className="absolute bottom-3 right-5 text-xs text-zinc-500 dark:text-zinc-200">Diedit 12.30</span>
          </div>
        </div>
      </Suspense>
    </Layout>
  )
}