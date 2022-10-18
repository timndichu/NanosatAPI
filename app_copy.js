/**
 * app.js file is where our application is initialized
 */

//Express is a framework that makes spinning up a server much easier
const express = require('express');

//Creates an Express application 
const app = express();
var { WebSocket } = require('ws');

const appWs = require('express-ws')(app);
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

// const mainRoutes = require('./routes/main_routes');

app.use(express.json());


// io.on('connection', (socket)=> {
//     console.log('A user connected');
    
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//        console.log('A user disconnected');
//     });

//     socket.on('message', (message)=> {
//         console.log(message);
//         io.emit('message', `${socket.id.substr(0,2)} says ${message}`);
//     })
//  });

// app.use('/client', mainRoutes);

app.ws('/lightInfo', ws => {

    ws.on('message', (message)=> {
        console.log(message);
      ws.emit(message);
    })
});


app.use((req,res, next) => {
    console.log('It works :)');
    
})



//Based on this, we can open up a port/connection to where our server will be 
const Port = process.env.PORT || 3000;



app.listen(Port, ()=>{
    console.log("Server started");
    console.log(`Port is ${Port}`);
});


