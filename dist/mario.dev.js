"use strict";

kaboom({
  global: true,
  fullscreen: true,
  scale: 1.1,
  debug: true,
  font: "sink",
  background: [0, 0, 0, 1]
});
var MOVE_SPEED = 250;
var JUMP_FORCE = 860;
var FULL_DEATH = 900;
var MOVE_MUSHROOM = {
  right: 250,
  left: -250,
  isCollision: false
};
var heart = 1;
var coins = 0;
loadSprite('surprize', './img/surprize.png');
loadSprite('mushroom', './img/mushroom.png');
loadSprite('brick', './img/brick.png');
loadSprite('mario', './img/mario.png');
loadSprite('pipe', './img/pipe.png');
loadSprite('gombo', './img/gombo.png');
loadSprite('coin', './img/coin.png');
loadSprite('hat', './img/hat.png');
loadSprite('unboxed', './img/unboxed.png');
loadSprite('broken-brick', './img/broken-brick.png');
scene("game", function () {
  gravity(2400);
  layers(["bg", "game", "ui"], "game");
  var player = add([sprite("mario"), pos(80, 0), scale(1.3), body(), rotate(0), area()]);
  var maps = ['                                                                                               ', '                                                                                               ', '                                                                                               ', '                                                                                               ', '                                             ==%==                ====                          ==       ', '          =                                                                                    ', '                                                                                                ', '                                                                                                ', '     %  =?=%=                 +         +            +              %===%====%====%             ', '                              +         +            +                                          ', '                  ^  ^  +     +   ^     +    ^  ^    +                                          ', '========================================================      ==================================='];
  var levelConf = {
    width: 33,
    height: 50,
    '=': function _() {
      return [sprite("brick"), area(), solid(), "broken-break"];
    },
    '_': function _() {
      return [sprite("hat"), area(), solid(), scale(3)];
    },
    '$': function $() {
      return [sprite("coin"), area(), "coin"];
    },
    '-': function _() {
      return [sprite("broken-brick"), area(), "broken-brick", scale(1.2), lifespan(0.1)];
    },
    '}': function _() {
      return [sprite("unboxed"), area(), solid()];
    },
    '%': function _() {
      return [sprite("surprize"), area(), solid(), "coin-surprize"];
    },
    '?': function _() {
      return [sprite("surprize"), area(), solid(), "mushroom-surprize"];
    },
    '+': function _() {
      return [sprite("pipe"), area(), scale(3), solid(), "pipe"];
    },
    '^': function _() {
      return [sprite("gombo"), scale(1.3), "gombo", solid(), area(), body()];
    },
    '#': function _() {
      return [sprite("mushroom"), area(), solid(), body(), "mushroom"];
    }
  };
  action("mushroom", function (m) {
    m.move(rand(MOVE_MUSHROOM.isCollision ? MOVE_MUSHROOM.left : MOVE_MUSHROOM.right), 0);
    m.collides("pipe", function () {
      return MOVE_MUSHROOM.isCollision = true;
    });
  });
  action("gombo", function (m) {
    m.move(-rand(100), 0);
  });
  player.action(function () {
    camPos(player.pos);

    if (player.pos.y >= FULL_DEATH) {
      go("lose", {
        heart: heart,
        coins: coins
      });
    }
  });

  function Big() {
    player.scale.x = 2;
    player.scale.y = 2;
    setTimeout(function () {
      player.scale.x = 1.3;
      player.scale.y = 1.3;
    }, 5000);
  }

  player.collides("mushroom", function (m) {
    Big();
    destroy(m);
  });
  player.collides("coin", function (c) {
    coins++;
    coinsText.text = "c: " + coins;
    destroy(c);
  });
  player.collides("gombo", function (g) {
    if (player.grounded()) {
      heart--;
      go("lose", {
        heart: heart,
        coins: coins
      });
    } else {
      destroy(g);
    }
  });
  player.on("headbutt", function (obj) {
    if (obj.is("coin-surprize")) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }

    if (obj.is("mushroom-surprize")) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 0.7));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }

    if (obj.is("broken-break")) {
      gameLevel.spawn('-', obj.gridPos.sub(0, 0.1));
      destroy(obj);
    }
  });
  var heartText = add([text("h: " + heart), pos(30, 30), fixed(), scale(2.5), layer("ui")]);
  var coinsText = add([text("c: " + coins), pos(110, 30), fixed(), scale(2.5), layer("ui")]);
  keyDown('left', function () {
    player.move(-MOVE_SPEED, 0);
  });
  keyDown("right", function () {
    player.move(MOVE_SPEED, 0);
  });
  keyDown("up", function () {
    if (player.grounded()) {
      player.jump(JUMP_FORCE);
    }
  });
  keyPress("space", function () {
    if (player.grounded()) {
      player.jump(JUMP_FORCE);
    }
  });
  var gameLevel = addLevel(maps, levelConf);
});
scene("lose", function (_ref) {
  var heart = _ref.heart;
  add([text("You heart: " + heart), origin("center"), scale(2.5), pos(width() / 2, height() / 2)]);
  add([text("The End Game!"), origin("center"), scale(2.5), pos(width() / 2, height() / 2.5)]);
  keyPress("space", function () {
    return go("game");
  });
  mouseClick(function () {
    return go("game");
  });
});
go("game");