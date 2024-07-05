import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import React, { useState, useCallback, useEffect } from "react";

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D"
];
const names = [
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet"
];

const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

const getInitialUser = () => {
  return {
    name: getRandomName(),
    color: getRandomColor()
  };
};

// A new Y document
const ydoc = new Y.Doc();
// Registered with a WebRTC provider

// Textarea where user can write the text
export const TextEditor = () => {
    const provider = new WebrtcProvider("test5", ydoc);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().substring(0, 32);

    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CollaborationCursor.configure({
        provider: provider,
        onUpdate: (updatedUsers) => {
          setUsers(updatedUsers);
        },
        user: currentUser
      }),
      Collaboration.configure({
        document: ydoc
      })
    ],
    autofocus: "end"
  });

  useEffect(() => {
    if (editor && currentUser) {
      editor.chain().focus().user(currentUser).run();
    }
  }, [editor, currentUser]);

  return (
    <>
      <div className="editor">
        <EditorContent className="editor__content" editor={editor} />
        <div className="editor__footer">
          <div className={`editor__status editor__status--online`}>
            {users.length} user {users.length === 1 ? "" : "s"} online
          </div>
          <div className="editor__name">
            <button onClick={setName}>{currentUser.name}</button>
          </div>
        </div>
      </div>
    </>
  );
};
