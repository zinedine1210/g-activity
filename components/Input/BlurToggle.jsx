import React, { useState } from 'react';

const BlurToggle = ({ data }) => {
  const [isBlurred, setIsBlurred] = useState(true);

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  return (
    <div 
      onClick={toggleBlur} 
      className={`inline-block cursor-pointer transition ${isBlurred ? 'blur-sm' : 'blur-none'}`}
    >
      {data}
    </div>
  );
};

export default BlurToggle;
