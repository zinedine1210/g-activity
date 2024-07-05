// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json(
    {
      "documentation": [
        {
          "name": "Zinedine Web",
          "id": "123",
          "userID": "123",
          "pages": [
            {
              "page": "Getting Started",
              "rows": [
                {
                  "layout": "cols",
                  "cols": [
                    {
                      "type": "title",
                      "text": "Zinedine Web"
                    },
                    {
                      "type": "paragraph",
                      "text": "ini adalah paragraph"
                    }
                  ]
                },
                {
                  "layout": "cols",
                  "cols": [
                    {
                      "type": "title",
                      "text": "Zinedine Web"
                    },
                    {
                      "type": "paragraph",
                      "text": "ini adalah paragraph"
                    }
                  ]
                },
                {
                  "layout": "rows",
                  "type": "title",
                  "text": "Zinedine Web"
                }
              ],
              "child": [
                {
                  "page": "Instalation"
                }
              ]
            }
          ]
        }
      ],
      "user": [
        {
          "username": "admingnusa",
          "userID": "123",
          "email": "zidane.gnusa@gmail.com",
          "company": "Gateway Internusa",
          "password": "gnusa123"
        }
      ],
      "workspaces": [
        {
          "name": "Gateway Internusa",
          "description": "ini deskripsi",
          "privacy": "private",
          "id": "121313",
          "userID": "123",
          "type": "bisnis",
          "website": "https://gnusa.id",
          "logo": "/default.png",
          "members": [
            {
              "username": "Zinedine Ziddan Fahdlevy",
              "userID": "123",
              "email": "zidane.gnusa@gmail.com",
              "status": "Owner",
              "whatsapp": "089508781380"
            },
            {
              "email": "charly.gnusa@gmail.com",
              "status": "Pending"
            },
            {
              "username": "Mas Denis",
              "userID": "456",
              "email": "denisramdan92@gmail.com",
              "status": "Guest",
              "whatsapp": "089508781380"
            }
          ]
        },
        {
          "name": "Virtues",
          "website": "https://zidane.id",
          "type": "programming",
          "privacy": "public",
          "description": "asasasas",
          "members": [
            {
              "email": "zidane.gnusa@gmail.com",
              "status": "pending"
            },
            {
              "email": "ziddanfhdlvy12@gmail.com",
              "status": "pending"
            }
          ],
          "id": "1676020355376168723525",
          "userID": "123",
          "log": "/images/default.png"
        }
      ],
      "forum": [
        {
          "title": "Testing",
          "id": "1218013",
          "workspaceID": "121313",
          "conversation": [
            {
              "userID": "123",
              "comments": "Hallo semuanya!!",
              "time": "12/11/2023"
            }
          ],
          "members": [
            {
              "username": "Zinedine Ziddan Fahdlevy",
              "userID": "123",
              "email": "zidane.gnusa@gmail.com",
              "status": "Owner",
              "whatsapp": "089508781380"
            }
          ]
        }
      ],
      "projects": [
        {
          "name": "Android Sushimoo",
          "id": "12891829182",
          "workspaceID": "121313",
          "privacy": "Private",
          "members": [
            {
              "username": "Mas Denis",
              "userID": "456",
              "email": "denisramdan92@gmail.com",
              "status": "Owner",
              "whatsapp": "089508781380"
            }
          ]
        }
      ]
    }    
  )
}
