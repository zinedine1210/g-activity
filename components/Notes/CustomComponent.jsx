import React from 'react'

export default function CustomComponent() {

    const MyCustomNode = Node.create({
        name: 'myCustomNode',
        content: 'text*',
        group: 'block',
        draggable: true,
        parseHTML() {
            return [{ tag: 'div.my-custom-node' }];
        },
        renderHTML({ HTMLAttributes }) {
            return ['div', mergeAttributes({ class: 'my-custom-node' }, HTMLAttributes), 0];
        },
        addAttributes() {
            return {
            width: {
                default: '100px',
                parseHTML: element => element.getAttribute('width'),
                renderHTML: attributes => ({ style: `width: ${attributes.width}` })
            },
            
            height: {
                default: '100px',
                parseHTML: element => element.getAttribute('height'),
                renderHTML: attributes => ({ style: `height: ${attributes.height}` })
            }
            };
        }
        });
  return (
    <div>CustomComponent</div>
  )
}
