import express from 'express'
import { WebSocketServer,WebSocket } from 'ws'

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });
const users = new Map<string,WebSocket>();


wss.on('connection',(ws,req) => {
    const userId = req.url?.split('?id=')[1];
    console.log(userId)
    users.set(userId || "",ws);
    

    ws.on('message', (data,isBinary) => {
        if(typeof data == 'object'){
            const {message , receiverId} = JSON.parse(data.toString());
            const receiverWs = users.get(receiverId);
            if(receiverWs){
                receiverWs.send(JSON.stringify({message : message}))
            }else{
                console.log("no user")
            }
        }
    })
    ws.on('error',(err) => {
        console.log(err)
    })
    ws.on('close', () => { 
        console.log(`Connection closed for user: ${userId}`);
        if(userId){
            users.delete(userId)
        }
    })
})