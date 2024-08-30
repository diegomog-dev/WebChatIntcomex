import './App.css';
import './css/chat.css';
import io from 'socket.io-client';
import { useState, useEffect } from "react";
import imgUser from './images/7309681.jpg';

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
              body: `<div><p>Nombre del Producto: ${product.product_name}</p>
                    <p>SKU: ${product.sku}</p>
                    <p>MPN: ${product.mpn}</p>
                    <p>Atributos: ${attributes}</p></div>`
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
      <header>
        <h1>WebChat Intcomex</h1>
      </header>
      
      <main>
        <div className='instructions'>
          <p>Por favor, escribe la consulta sobre productos que quieres realizar. 
            Escribe el nombre de la categoría o subcategoría que quieres consultar, seguido de la cantidad de productos y, 
            finalmente, el número de la página, todo separado por una coma. Sigue el siguiente ejemplo: Industrial, 10, 1.
          </p>
        </div>
        <div id='all-messages'>
          {messages.map((message, index) => (
            <div key={index}>
              <div className='message'>
                <div className='image-container'>
                  <img src={imgUser} alt='imgUser'/>
                </div>
                <div className='message-body'>
                  <div className='user-info'>
                    <span className='username'>{message.from} </span>              
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: message.body }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='send-message'>
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={e => setMessage(e.target.value)} value={message}/>
            <button className='btn secondary'>Enviar</button>
          </form>
        </div>
      </main>            
    </div>
  );
}

export default App;
