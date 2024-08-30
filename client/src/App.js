import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from "react";

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit('chat_message', message);
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([...messages, newMessage])
    setMessage('');
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      if(message.isArray){
        const formattedMessages = message.body.map(product => {
          const attributes = product.attributesList.length > 0 
              ? product.attributesList.map(attr => `${attr.characteristic_Name}: ${attr.value}`).join(', ')
              : 'No tiene atributos disponibles';
          
          return {
              from: message.from,
              body: `<div>Nombre del Producto: ${product.product_name}</div>
                    <div>SKU: ${product.sku}</div>
                    <div>MPN: ${product.mpn}</div>
                    <div>Atributos: ${attributes}</div>`
          };
      });

      setMessages([...messages, ...formattedMessages]);
      } else {
          setMessages([...messages, message]);
        }
      };
      socket.on('message_server', receiveMessage);
      return () => {
        socket.off('message', receiveMessage);
      }
  },[messages]);
  
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={e => setMessage(e.target.value)} value={message}/>
        <button>send</button>
      </form>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.from}: </p>
          <div dangerouslySetInnerHTML={{ __html: message.body }} />
        </div>
      ))}
    </div>
  );
}

export default App;
