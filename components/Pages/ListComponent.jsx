import Image from "next/image";
import React from "react";

export default function ListComponent(props) {
    const {item, lang} = props

    const handleDragStart = (e, item) => {
      e.dataTransfer.setData('application/json', JSON.stringify(item));
    };

  return (
    <li className="block" draggable onDragStart={(e) => handleDragStart(e, item)} onDragOver={(e) => e.preventDefault()}>
      <div className="flex items-center gap-2 cursor-pointer justify-between transition-all rounded-md hover:bg-blue-200 hover:dark:bg-darkSecondary p-1 duration-300 ease-in-out group">
        <h1 className="capitalize text-zinc-500 dark:text-zinc-300 flex items-center gap-2">
        <Image src={`/images${item.image}`} alt={item.image} width={30} height={30} />
        {lang(item.type)}
        </h1>
      </div>
    </li>
  )
}