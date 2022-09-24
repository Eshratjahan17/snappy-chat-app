import React, { useEffect, useState } from 'react';

const Chats = () => {
const [chats,setChats]=useState([]);
  useEffect(()=>{
  fetch("http://localhost:5000/api/chat")
    .then((res) => res.json())
    .then((data) => setChats(data));
  },[])
  return (
    <div>
      {chats.map((chat) => (
        <div>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default Chats;