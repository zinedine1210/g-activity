import { toast } from 'react-toastify';
import React from 'react';

const notifyChat = ({label, msg}) => {
  toast(
    <div className="flex flex-col p-2">
      <span className="font-bold text-blue-500">{label}</span>
      <span className="text-gray-700">{msg}</span>
    </div>
  );
};

export default notifyChat;
