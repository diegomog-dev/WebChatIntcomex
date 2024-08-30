import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import realtimeServer from './realtimeServer.js'

const app = express();
const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), ()=>{
    console.log('Server started on port', app.get("port"));
});

realtimeServer(server);

app.use(cors());
app.use(morgan('dev'));