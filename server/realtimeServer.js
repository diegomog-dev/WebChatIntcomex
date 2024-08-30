import { Server as SocketServer} from 'socket.io';
import reqApi from './api.js';

export default function httpServer(server){

    const io = new SocketServer(server,{
        cors: {
            origin: 'http://localhost:3000',
        }
    });

    io.on('connection', (socket)=>{
        console.log("Se ha conectado el usuario: " + socket.id);
        socket.on('chat_message', async (data) => {
            try {
                const [parameter, count, numberPage] = data.split(',');
                const request = await reqApi(parameter, count, numberPage);
    
                let response;
                if(request.isSuccess){
                    response = {
                        isArray: true,
                        body: request.result.products,
                        from: "Información del Servidor: "
                    };
                }else{
                    response = {
                        isArray: false,
                        body: request.errorMessages[0],
                        from: "Información del servidor: "
                    }
                }
                socket.emit('message_server', response);
                socket.broadcast.emit('message_server', response)
    
                console.log(request.result);
            } catch (error) {
                console.error('Error fetching API:', error);
            }
        }); 
    });    
}