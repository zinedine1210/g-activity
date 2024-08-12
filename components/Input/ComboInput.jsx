import { useState, useRef, useEffect } from 'react';

function ComboInput({ items, setItems, handleChange, options }) {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // const value = e.target.value.trim();
      // if (value) {
      //   setItems([...items, value]);
      //   e.target.value = '';
      //   setFocusedIndex(null);
      // }
    } else if ((e.key === 'Delete') && focusedIndex !== null) {
      const newItems = [...items];
      newItems.splice(focusedIndex, 1);
      setItems(newItems);
      if (newItems.length === 0) {
        inputRef.current.focus();
        setFocusedIndex(null);
      } else if (focusedIndex > 0) {
        setFocusedIndex(focusedIndex - 1);
      } else {
        setFocusedIndex(0);
      }
    } else if (e.key === 'ArrowLeft') {
        console.log(focusedIndex)
        if(focusedIndex !== null){
            if (focusedIndex > 0) {
              setFocusedIndex(focusedIndex - 1);
            } else {
              inputRef.current.focus();
              setFocusedIndex(null);
            }
        }else{
            setFocusedIndex(items.length - 1)
        }
    } else if (e.key === 'ArrowRight' && focusedIndex !== null) {
      if (focusedIndex < items.length - 1) {
        setFocusedIndex(focusedIndex + 1);
      } else {
        inputRef.current.focus();
        setFocusedIndex(null);
      }
    } else if (e.key === 'Delete' && focusedIndex === null) {
      if (items.length > 0) {
        const newItems = [...items];
        newItems.pop();
        setItems(newItems);
        if (newItems.length === 0) {
          inputRef.current.focus();
          setFocusedIndex(null);
        } else {
          setFocusedIndex(newItems.length - 1);
        }
      }
    }
  };

  const handleItemClick = (index) => {
    setFocusedIndex(index);
  };

  const handleInputClick = () => {
    setFocusedIndex(null)
  };

  useEffect(() => {
    if (focusedIndex !== null) {
      document.getElementById(`item-${focusedIndex}`).focus();
    }
  }, [focusedIndex]);

  const handleCreate = (value) => {
    if (value) {
      setItems([...items, value]);
      inputRef.current.value = '';
      handleChange("")
      setFocusedIndex(null);
    }
  }

  const isActive = options.length > 0

  return (
    <div className='flex items-center gap-1 flex-wrap relative'>
        {items.map((item, index) => (
            <button
              key={index}
              id={`item-${index}`}
              type='button'
              onClick={() => handleItemClick(index)}
              onKeyDown={handleKeyDown}
              className='py-0.5 px-4 rounded-full bg-zinc-100 border-2 border-zinc-500 focus:border-blue-500 focus:bg-blue-100 text-sm outline-none'
            >
            {item.label}
            </button>
        ))}
        <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            onChange={e => handleChange(e.target.value)}
            className='outline-none bg-transparent placeholder:text-zinc-500 px-3 py-2'
            placeholder='Type for search'
        />
        
        {isActive && (
          <div className='absolute top-full right-0 w-full h-auto max-h-56 overflow-y-auto py-2 shadow-xl backdrop-blur-md rounded-xl border'>
            {
              options.map((item, index) => {
                return (
                  <button onClick={() => handleCreate(item)} className='w-full text-start py-2 px-5 hover:bg-blue-50 duration-300' key={index}>
                    {item.label}
                  </button>
                )
              })
            }
          </div>
        )}
    </div>
  );
}

export default ComboInput;
