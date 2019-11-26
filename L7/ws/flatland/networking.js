window.addEventListener('load', function() {
  window.ws = new WebSocket('ws://pi.iem.pw.edu.pl:7070/ws');
  ws.onmessage = function(msg) {
    var parsed = JSON.parse(msg.data);
    var uid = parsed.uid;
    var actor = get_actor(uid);
    if (parsed.type == 'start-jump')
      startJump(actor);
    if (parsed.type == 'end-jump')
      endJump(actor);

    if (parsed.type == 'move-left')
      moveLeft(actor);
    if (parsed.type == 'stop-left')
      stopLeft(actor);

    if (parsed.type == 'move-right')
      moveRight(actor);
    if (parsed.type == 'stop-right')
      stopRight(actor);

    if (parsed.type == 'login')
      logging.info("Player " + uid + " entered the game");

    if (parsed.type == "spawn")
      spawnActor(uid);
    if (parsed.type == "spawn-at")
      spawnActor(uid, parsed.x, parsed.y);

    if (parsed.type == 'logout') {
      hideActor(actor);
      logging.error("Player " + uid + " has left the game");
    }

    if (parsed.type == 'killed')
      logging.info(parsed.killer + " killed " + parsed.uid);
  }
  ws.onopen  = function() {
    logging.info("Connected to the WebSocket");
  }

  ws.onerror = function() {
    logging.error("Failed to connect to the WebSocket");
  }

  ws.onclose = function() {
    logging.error("Lost connection to the WebSocket");
  }

});

window.notify = function(type, uid, msg) {
  msg = msg || {};
  msg.type = type;
  msg.uid = uid;
  ws.send(JSON.stringify(msg));
}

window.addEventListener('beforeunload', function(){
  ws.close();
});
