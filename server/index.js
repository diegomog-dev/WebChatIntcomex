import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import realtimeServer from './realtimeServer.js'
import path, { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), ()=>{
    console.log('Server started on port', app.get("port"));
});

realtimeServer(server);

app.use(express.static(join(__dirname,'../client/build')))

app.use(cors());
app.use(morgan('dev'));