(function() { // module pattern

  //-------------------------------------------------------------------------
  // POLYFILLS
  //-------------------------------------------------------------------------
  
  if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                   window.mozRequestAnimationFrame    || 
                                   window.oRequestAnimationFrame      || 
                                   window.msRequestAnimationFrame     || 
                                   function(callback, element) {
                                     window.setTimeout(callback, 1000 / 60);
                                   }
  }

  //-------------------------------------------------------------------------
  // UTILITIES
  //-------------------------------------------------------------------------
  
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }
  
  function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if ((request.readyState == 4) && (request.status == 200))
        onsuccess(request);
    }
    request.open("GET", url, true);
    request.send();
  }

  function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(((x1 + w1 - 1) < x2) ||
             ((x2 + w2 - 1) < x1) ||
             ((y1 + h1 - 1) < y2) ||
             ((y2 + h2 - 1) < y1))
  }
  
  //-------------------------------------------------------------------------
  // GAME CONSTANTS AND VARIABLES
  //-------------------------------------------------------------------------
  
  var MAP      = { tw: 64, th: 48 },
      TILE     = 32,
      METER    = TILE,
      GRAVITY  = 9.8 * 6, // default (exagerated) gravity
      MAXDX    = 15,      // default max horizontal speed (15 tiles per second)
      MAXDY    = 60,      // default max vertical speed   (60 tiles per second)
      ACCEL    = 1/2,     // default take 1/2 second to reach maxdx (horizontal acceleration)
      FRICTION = 1/6,     // default take 1/6 second to stop from maxdx (horizontal friction)
      IMPULSE  = 1500,    // default player jump impulse
      COLOR    = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
      COLORS   = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ],
      KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
      
  var fps      = 60,
      step     = 1/fps,
      canvas   = document.getElementById('canvas'),
      ctx      = canvas.getContext('2d'),
      width    = canvas.width  = MAP.tw * TILE,
      height   = canvas.height = MAP.th * TILE,
      actors   = [],
      treasure = [],
      cells    = [];

  var actors_by_uid = {};

  var t2p      = function(t)     { return t*TILE;                  },
      p2t      = function(p)     { return Math.floor(p/TILE);      },
      cell     = function(x,y)   { return tcell(p2t(x),p2t(y));    },
      tcell    = function(tx,ty) { return cells[tx + (ty*MAP.tw)]; };
  
  
  //-------------------------------------------------------------------------
  // UPDATE LOOP
  //-------------------------------------------------------------------------

  function moveLeft(actor)  { actor.left = true; }
  function moveRight(actor) { actor.right = true; }
  function startJump(actor) { actor.jump = true; }
  function stopLeft(actor)  { actor.left = false; }
  function stopRight(actor) { actor.right = false; }
  function endJump(actor)   { actor.jump = false; }

  function onkey(ev, key, down) {
  //var player = actors[0];
  //switch(key) {
  //  case KEY.LEFT:  moveLeft(player, down); ev.preventDefault(); return false;
  //  case KEY.RIGHT: moveRight(player,down); ev.preventDefault(); return false;
  //  case KEY.SPACE: doJump(player, down); ev.preventDefault(); return false;
  //}
  }
  
  function update(dt) {
    updateActors(dt);
    checkTreasure();
    spawnTreasure();
  }

  function updateActors(dt) {
      var i, j, n;
      var one, another;
      for(i=0, n=actors.length; i<n; i++) {
       updateEntity(actors[i], dt);
       for(j=i+1; j<n; j++) {
        one = actors[i];
        another = actors[j];
	if (overlap(one.x, one.y, TILE, TILE, another.x, another.y, TILE, TILE)) {
          if (one.y < another.y && one.dy > 0)
            killActor(one, another);
          if (one.y > another.y && another.dy > 0)
            killActor(another, one);
        }
      }
    }
  }

  function spawnTreasure() {
    if (Math.random() > 0.9 && Math.random() > 0.9 && treasure.length < 10) {
      var x = Math.floor(Math.random() * MAP.tw);
      var y = Math.floor(Math.random() * MAP.th);
      while (tcell(x, y)) {
        x = Math.floor(Math.random() * MAP.tw);
        y = Math.floor(Math.random() * MAP.th);
      }
      t = setupEntity({x:t2p(x), y:t2p(y), type:'treasure', properties: {}});
      treasure.push(t);
    }
  }

  function get_actor(uid) {
    return actors_by_uid[uid];
  }

  function spawnActor(uid) {
    if (get_actor(uid))
      return;
    var x = Math.floor(Math.random() * MAP.tw);
    var y = Math.floor(Math.random() * MAP.th);
    while (tcell(x, y)) {
      x = Math.floor(Math.random() * MAP.tw);
      y = Math.floor(Math.random() * MAP.th);
    }
    a = setupEntity({x:t2p(x), y:t2p(y), type:'player', uid: uid, properties: {}});
    actors_by_uid[uid] = a;
    actors.push(a);
  }

  function hideActor(actor) {
    if (actor)
      actor.killed = true;
  }

  function checkTreasure() {
    var i,n,t;
    var actor;
    for(i=0,n=actors.length; i<n; i++) {
      actor = actors[i];
      for(N=treasure.length; N>0; N--) {
        t = treasure[N-1];
        if (!t.collected && overlap(actor.x, actor.y, actor.size, actor.size, t.x, t.y, TILE, TILE)) {
          collectTreasure(actor, t);
          treasure.splice(N-1,1);
        }
      }
    }
  }

  function killActor(killer, actor) {

    var x = Math.floor(Math.random() * MAP.tw);
    var y = Math.floor(Math.random() * MAP.th);
    while (tcell(x, y)) {
      x = Math.floor(Math.random() * MAP.tw);
      y = Math.floor(Math.random() * MAP.th);
    }
    actor.x = t2p(x);
    actor.y = t2p(y);
    actor.dx = actor.dy = 0;
    actor.collected -= 2;
    actor.collected = actor.collected > 0? actor.collected : 0;
    notify('killed', actor.uid, {
      killer:killer.uid
    });
    notify('collected', actor.uid, {
      collected: actor.collected
    });
  }

  function collectTreasure(actor, t) {
    actor.collected++;
    t.collected = true;
    notify('collected', actor.uid, {
      collected: actor.collected
    });
  }

  function updateEntity(entity, dt) {
    var wasleft    = entity.dx  < 0,
        wasright   = entity.dx  > 0,
        falling    = entity.falling,
        friction   = entity.friction * (falling ? 0.5 : 1),
        accel      = entity.accel    * (falling ? 0.5 : 1);
  
    entity.ddx = 0;
    entity.ddy = entity.gravity;
  
    if (entity.left)
      entity.ddx = entity.ddx - accel;
    else if (wasleft)
      entity.ddx = entity.ddx + friction;
  
    if (entity.right)
      entity.ddx = entity.ddx + accel;
    else if (wasright)
      entity.ddx = entity.ddx - friction;
  
    if (entity.jump && !entity.jumping && !falling) {
      entity.ddy = entity.ddy - entity.impulse; // an instant big force impulse
      entity.jumping = true;
    }
  
    entity.x  = entity.x  + (dt * entity.dx);
    entity.y  = entity.y  + (dt * entity.dy);
    entity.dx = bound(entity.dx + (dt * entity.ddx), -entity.maxdx, entity.maxdx);
    entity.dy = bound(entity.dy + (dt * entity.ddy), -entity.maxdy, entity.maxdy);
  
    if ((wasleft  && (entity.dx > 0)) ||
        (wasright && (entity.dx < 0))) {
      entity.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }
  
    var tx        = p2t(entity.x),
        ty        = p2t(entity.y),
        nx        = entity.x%TILE,
        ny        = entity.y%TILE,
        cell      = tcell(tx,     ty),
        cellright = tcell(tx + 1, ty),
        celldown  = tcell(tx,     ty + 1),
        celldiag  = tcell(tx + 1, ty + 1);
  
    if (entity.dy > 0) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        entity.y = t2p(ty);
        entity.dy = 0;
        entity.falling = false;
        entity.jumping = false;
        ny = 0;
      }
    }
    else if (entity.dy < 0) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        entity.y = t2p(ty + 1);
        entity.dy = 0;
        cell      = celldown;
        cellright = celldiag;
        ny        = 0;
      }
    }
  
    if (entity.dx > 0) {
      if ((cellright && !cell) ||
          (celldiag  && !celldown && ny)) {
        entity.x = t2p(tx);
        entity.dx = 0;
      }
    }
    else if (entity.dx < 0) {
      if ((cell     && !cellright) ||
          (celldown && !celldiag && ny)) {
        entity.x = t2p(tx + 1);
        entity.dx = 0;
      }
    }

    entity.falling = ! (celldown || (nx && celldiag));
  
  }

  //-------------------------------------------------------------------------
  // RENDERING
  //-------------------------------------------------------------------------
  
  function render(ctx, frame, dt) {
    ctx.clearRect(0, 0, width, height);
    renderMap(ctx);
    renderTreasure(ctx, frame);
    renderActors(ctx, dt);
  }

  function renderMap(ctx) {
    var x, y, cell;
    for(y = 0 ; y < MAP.th ; y++) {
      for(x = 0 ; x < MAP.tw ; x++) {
        cell = tcell(x, y);
        if (cell) {
          ctx.fillStyle = COLORS[cell - 1];
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
    }
  }

  function renderActors(ctx, dt) {
    var i, n, actor, hue;
    for(i=0, n=actors.length; i<n; i++) {
      actor = actors[i];
      if(actor.killed) continue;
      saturation = actor.collected/30;
      saturation = (saturation > 1.0)? 1.0 : saturation;
      ctx.fillStyle = 'hsl(' + actor.hue + ', ' + (30 + 70*saturation) + '%, 50%)';
      ctx.fillRect(actor.x + (actor.dx * dt), actor.y + (actor.dy * dt), actor.size, actor.size);
    }
  }

  function renderTreasure(ctx, frame) {
    ctx.fillStyle   = COLOR.GOLD;
    ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60);
    var n, max, t;
    for(n = 0, max = treasure.length ; n < max ; n++) {
      t = treasure[n];
      if (!t.collected)
        ctx.fillRect(t.x, t.y + TILE/3, TILE, TILE*2/3);
    }
    ctx.globalAlpha = 1;
  }

  function tweenTreasure(frame, duration) {
    var half  = duration/2
        pulse = frame%duration;
    return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
  }

  //-------------------------------------------------------------------------
  // LOAD THE MAP
  //-------------------------------------------------------------------------
  
  function setup(map) {
    var data    = map.layers[0].data,
        objects = map.layers[1].objects,
        n, obj, entity;

    for(n = 0 ; n < objects.length ; n++) {
      obj = objects[n];
      entity = setupEntity(obj);
      switch(obj.type) {
      case "player"   : actors.push(entity); break;
      case "treasure" : treasure.push(entity); break;
      }
    }

    cells = data;
  }

  function setupEntity(obj) {
    var entity = {};
    entity.x        = obj.x;
    entity.y        = obj.y;
    entity.dx       = 0;
    entity.dy       = 0;
    entity.size     = TILE;
    entity.uid      = obj.uid;
    entity.hue      = 180.0*Math.random();
    entity.gravity  = METER * (obj.properties.gravity || GRAVITY);
    entity.maxdx    = METER * (obj.properties.maxdx   || MAXDX);
    entity.maxdy    = METER * (obj.properties.maxdy   || MAXDY);
    entity.impulse  = METER * (obj.properties.impulse || IMPULSE);
    entity.accel    = entity.maxdx / (obj.properties.accel    || ACCEL);
    entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);
    entity.player   = obj.type == "player";
    entity.treasure = obj.type == "treasure";
    entity.left     = obj.properties.left;
    entity.right    = obj.properties.right;
    entity.start    = { x: obj.x, y: obj.y }
    entity.killed = entity.collected = 0;
    return entity;
  }

  //-------------------------------------------------------------------------
  // THE GAME LOOP
  //-------------------------------------------------------------------------
  
  var counter = 0, dt = 0, now,
      last = timestamp(),
      fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  
  function frame() {
    fpsmeter.tickStart();
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
      dt = dt - step;
      update(step);
    }
    render(ctx, counter, dt);
    last = now;
    counter++;
    fpsmeter.tick();
    requestAnimationFrame(frame, canvas);
  }
  
  document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
  document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

  get("level.json", function(req) {
    setup(JSON.parse(req.responseText));
    frame();
  });

  window.get_actor = get_actor;
  window.moveLeft = moveLeft;
  window.moveRight = moveRight;
  window.startJump = startJump;
  window.stopLeft = stopLeft;
  window.stopRight = stopRight;
  window.endJump  = endJump;
  window.spawnActor = spawnActor;
  window.hideActor = hideActor;
  window.actors = actors;
})();

