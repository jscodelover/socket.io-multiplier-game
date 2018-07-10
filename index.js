const express = require("express");
const http = require("http");

const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app).listen(port);
const io = require("socket.io")(server);

app.use(express.static("./public"));

const players_rocket_info = {};
var shipId = 0;

io.on('connection', socket => {
    console.log('server',socket.id);
    players_rocket_info['ship'+(++shipId)] = {
      id : socket.id,
      left : 6,
      top : 50
    }

    io.emit('rocket_creator', players_rocket_info);

    socket.on("position_change", rocketInfo => {
        console.log('server', rocketInfo);
        let changed_Ship_id ;
        for(let r in players_rocket_info)
        {
            let rocket_id = players_rocket_info[r]
            if(rocketInfo.id === rocket_id.id)
              changed_Ship_id = r;
        }
        players_rocket_info[changed_Ship_id] = {...rocketInfo};
        socket.broadcast.emit("position", rocketInfo);
    });
});

console.log(`Starting socket app on port ${port}`);
