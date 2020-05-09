 
require("dotenv").config()

var app = require('express')();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
users = [];
connections = [];

const port=process.env.SERVER_PORT || 4000;
server.listen(port);
console.log(`Server running... on ${port}`);


app.get('/', function(req, res) {

});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    socket.emit('message',{"url":process.env.VIDEO_URL})

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s socket connected', connections.length)
    });

    socket.on('pause',(data)=>{
        if (connections.indexOf(socket)==0){
        io.sockets.emit("pause",{msg:"pause"});
        }
    })

    socket.on("play",(data)=>{
        if (connections.indexOf(socket)==0){
        io.sockets.emit("play",{msg:"play"});
        }
    })

    socket.on("seekTo",(data)=>{
        if (connections.indexOf(socket)==0){
            console.log(data);
        
        connections.forEach((connection,index) => {
            
            if(index!=0){
                connection.emit("seekTo",{duration:data.duration});
            }
        });
        
        }
    })

    
});