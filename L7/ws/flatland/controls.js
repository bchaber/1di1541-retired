function set_status(s) {
  var el = document.getElementById("status");
  el.innerHTML = s;
}

function set_collected(s) {
  var el = document.getElementById("collected");
  el.innerHTML = s;
}

function add_message(m) {
  var ul = document.getElementById("messages");
  var li = document.createElement('li');
  li.innerHTML = m;
  ul.appendChild(li);
}

function send(msg) {
  ws.send(JSON.stringify(msg));
}

function setup() {
  var uid = null;
  window.ws = new WebSocket("ws://pi.iem.pw.edu.pl:7070/ws");
  ws.onopen = function() { set_status("Connected"); send({'type':'login'}); };
  ws.onclose = function() { set_status("Disconnected"); };
  ws.onmessage = function(msg) {
    parsed = JSON.parse(msg.data);
    if (parsed.type == 'collected' || parsed.type == 'killed')
      add_message(msg.data);
    if (uid == parsed.uid && parsed.type == 'collected')
      set_collected(parsed.collected);
    if (parsed.type == 'new-uid') {
      uid = parsed.uid;
      set_status("UID " + uid);
    }
  }

  KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  document.addEventListener("keydown", function(evt) {
    switch(evt.keyCode) {
      case KEY.LEFT:  send({'type':'move-left'});  evt.preventDefault(); return false;
      case KEY.RIGHT: send({'type':'move-right'}); evt.preventDefault(); return false;
      case KEY.UP: send({'type':'start-jump'}); evt.preventDefault(); return false;
    } 
  }, true);

  document.addEventListener("keyup", function(evt) {
    switch(evt.keyCode) {
      case KEY.LEFT:  send({'type':'stop-left'});  evt.preventDefault(); return false;
      case KEY.RIGHT: send({'type':'stop-right'}); evt.preventDefault(); return false;
      case KEY.UP: send({'type':'end-jump'});   evt.preventDefault(); return false;
    } 
  }, true);

  document.addEventListener("touchstart", function(evt) {
    start = [evt.touches[0].pageX, evt.touches[0].pageY];
    evt.preventDefault();
    return false;
  }, true);

  document.addEventListener("touchmove", function(evt) {
    stop = [evt.touches[0].pageX, evt.touches[0].pageY];
    dx = stop[0]-start[0];
    dy = stop[1]-start[1];
    if (dy < -100)
      send({'type':'start-jump'});
    if (dx >  100)
      send({'type':'move-right'});
    if (dx < -100)
      send({'type':'move-left'});
    evt.preventDefault();
    return false;
  }, true);
  document.addEventListener("touchmove", function(evt) {
    stop = [evt.touches[0].pageX, evt.touches[0].pageY];
    dx = stop[0]-start[0];
    dy = stop[1]-start[1];
    start = [evt.touches[0].pageX, evt.touches[0].pageY];
    if (dy > -100)
      send({'type':'end-jump'});
    if (dx <  100)
      send({'type':'stop-right'});
    if (dx > -100)
      send({'type':'stop-left'});
    evt.preventDefault();
    return false;
  }, true);
}

window.addEventListener('load', setup);
window.addEventListener('beforeunload', function(){
  send({'type':'logout'});
  ws.close();
});
