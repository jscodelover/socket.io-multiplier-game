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
    players_rocket_info['ship'+(++shipId)] = {
      id : socket.id,
      left : 6,
      top : 50
    }

    io.emit('rocket_creator', players_rocket_info);

    socket.on("position_change", rocketInfo => {
        let changed_Ship_id = find_changed_id(rocketInfo);
        // for(let r in players_rocket_info)
        // {
        //     let rocket_id = players_rocket_info[r]
        //     if(rocketInfo.id === rocket_id.id)
        //       changed_Ship_id = r;
        // }
        players_rocket_info[changed_Ship_id] = {...rocketInfo};
        socket.broadcast.emit("position", rocketInfo);
    });

    socket.on('disconnect', function () {
        let removed_ship_id = find_changed_id(socket);
        delete players_rocket_info[removed_ship_id];
        io.emit('rocket_creator', players_rocket_info);
        socket.broadcast.emit('disconnected', socket.id);
    });

});

function find_changed_id(rocketInfo){
  let changed_Ship_id ;
  for(let r in players_rocket_info)
  {
      let rocket_id = players_rocket_info[r]
      if(rocketInfo.id === rocket_id.id)
        changed_Ship_id = r;
  }
  return changed_Ship_id
}

console.log(`Starting socket app on port ${port}`);
