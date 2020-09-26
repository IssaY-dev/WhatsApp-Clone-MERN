import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from "pusher-js";
import axios from "./axios";


function App() {
  const [messages, setMesseges] = useState([]);

  useEffect(() => {
    axios.get('./messages/sync')
      .then(response => {
        setMesseges(response.data);
      })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('b0b08e5c641e52653b10', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      setMesseges([...messages, newMessages]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      <div className='app__body'>
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
