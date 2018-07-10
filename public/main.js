const socket = io();

var Rocket_ID, rocket;

socket.on("connect", () => {
   console.log('Start Playing !!!')
   console.log('client', socket.id);
   Rocket_ID = socket.id;
});

socket.on("disconnected", id => {
    alert(`Rocket with id ${id} is removed`);
});


socket.on('rocket_creator', rocketsInfo => {
    let spaceship;
    $("img").remove();
    for(let r in rocketsInfo)
    {
      let rocket =rocketsInfo[r];
      {
          $( "#gameboard" ).append( `<img id=${rocket.id} src="ship.png" style=" width: 70px; height: 70px;"" />` );
            spaceship = $("#" + rocket.id);
            spaceship.css({
              'position' : 'absolute',
              'left' : rocket.left,
              'top' : rocket.top
            });
      }
    }
    rocket = $('#'+Rocket_ID)
});
const direction={
        left : false,
        right : false,
        top : false,
        down : false
      };


socket.on('position', changedPosition => {
   rocket = $('#' + changedPosition.id);
   rocket.css({'left' : changedPosition.left, 'top' : changedPosition.top})
});

$(document).on('keydown',function(e){
  rocket = $('#'+Rocket_ID)
		if(e.keyCode===37)
		{	direction.left=true; }
		if(e.keyCode===38)
		{	direction.top=true; }
	    if(e.keyCode===39)
		{	direction.right=true; }
	    if(e.keyCode===40)
		{	direction.down=true; }
	});
	$(document).on('keyup', function(e){
        if(e.keyCode==37)
		{	direction.left=false; }
		if(e.keyCode==38)
		{	direction.top=false; }
	    if(e.keyCode==39)
		{	direction.right=false; }
	    if(e.keyCode==40)
		{	direction.down=false; }
	});
	const speed=5;
	function move()
	{
		if(direction.left===true)
		{	rocket.css('left', rocket.position().left-speed); }
		if(direction.top===true)
		{	rocket.css('top', rocket.position().top-speed); }
	    if(direction.right===true)
		{	rocket.css('left', rocket.position().left+speed); }
	    if(direction.down===true)
		{	rocket.css('top', rocket.position().top+speed); }
    if(direction.left || direction.right || direction.top || direction.down)
    {
        socket.emit("position_change", {
          id : Rocket_ID, ...rocket.position()
        });
    }
	}

	setInterval(move,50);
