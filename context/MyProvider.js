import { useState } from 'react';
import { createContext } from 'react';
export const urlData = "https://gactivity-zinedine1210.vercel.app/api"
// export const urlData = "http://localhost:3002"
// export const domainWebsite = "http://docu-builder.gnusa.id"
export const domainWebsite = "http://localhost:3000"

export const MyContext = createContext();

export function MyProvider({children}) {
    const [data, setData] = useState({
        "dataDocumentation":null,
        "realDocumentation":null,
        "drawer": null,
        "active":null,
        "breadcrumb":null,
        "activeWorkspace":false,
        "profileData":null,
        "activeDocumentation":false,
        "activeNote":false,
        "activeProject":false,
        "activeTask":null,
        "activeDrag":null,
        "workspaceData":null,
        "dataRoom": null,
        "dataTask":[],
        "dataComponents":[
            {
                "id":0,
                "description":"Just start writing with plain text",
                "type":"text",
                "image":"/text.png",
                "tab":1,
                "text":null
            },
            {
                "id":2,
                "description":"Just start writing with plain text",
                "type":"paragraph",
                "image":"/paragraph.png",
                "text":null
            },
            {
                "id":3,
                "type":"tip",
                "image":"/tip.png",
                "title":null,
                "description":"Make writing stand out",
                "text":null
            },
            {
                "id":4,
                "image":"/header1.png",
                "type":"header 1",
                "description":"Big section heading",
                "text":null
            },
            {
                "image":"/header2.png",
                "id":5,
                "type":"header 2",
                "description":"Medium section heading",
                "text":null
            },
            {
                "id":6,
                "image":"/header3.png",
                "type":"header 3",
                "description":"Small section heading",
                "text":null
            },
            {
                "id":7,
                "image":"/copy.png",
                "type":"copy",
                "description":"Capture a copy",
                "text":null,
                "caption":null
            },
            {
                "id":8,
                "image":"/quote.png",
                "type":"quote",
                "description":"Capture a quote",
                "text":null
            },
            {
                "id":9,
                "image":"/divider.png",
                "type":"divider",
                "description":"Visually divider block",
                "text":null
            },
            {
                "id":10,
                "image":"/link.png",
                "type":"link to a page",
                "description":"Link to an existing page",
                "text":null
            },
            {
                "id":11,
                "image":"/bulletedlist.png",
                "type":"bulleted list",
                "text":null,
                "tab":1,
                "description":"Create a simple bulleted list"
            },
            {
                "id":12,
                "type":"numbered list",
                "image":"/numberedlist.png",
                "number":null,
                "tab":1,
                "description":"Create list with numbering",
                "text":null
            },
            {
                "id":13,
                "image":"/images.png",
                "type":"image",
                "width":null,
                "height":null,
                "description":"Upload or embed with a link",
                "result":null,
                "align":"mr-auto"
            },
            {
                "id":14,
                "image":"/bookmark.png",
                "type":"web bookmark",
                "description":"Save a link as a visual bookmark",
                "link":null
            },
            {
                "id":15,
                "image":"/video.png",
                "type":"video",
                "width":null,
                "height":null,
                "description":"Visually divider block",
                "align":"mr-auto",
                "link":null
            }
        ]
    })

    const setDataDocumentation = (newData) => {
        setData({
            ...data,
            dataDocumentation:newData
        })
    }

    return (
        <MyContext.Provider value={{ 
            ...data,
            setDataDocumentation,
            setData
        }}>
            {children}
        </MyContext.Provider>
    );
}