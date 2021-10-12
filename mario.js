kaboom({
    global: true,
    fullscreen: true,
    scale: 1.1,
    debug: true,
    font: "sink",
    background: [0, 0, 0, 1]
});

const MOVE_SPEED = 250;
const JUMP_FORCE = 860;
const FULL_DEATH = 900;
const MOVE_MUSHROOM = { right: 250, left: -250, isCollision: false }
let heart = 1;
let coins = 0;

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

scene("game", () => {

    gravity(2400);
    layers(["bg", "game", "ui",], "game");

    const player = add([
        sprite("mario"),
        pos(80, 0),
        scale(1.3),
        body(),
        rotate(0),
        area()
    ])

    const maps = [
        '                                                                                               ',
        '                                                                                               ',
        '                                                                                               ',
        '                                                                                               ',
        '                                             ==%==                ====                          ==       ',
        '          =                                                                                    ',
        '                                                                                                ',
        '                                                                                                ',
        '     %  =?=%=                 +         +            +              %===%====%====%             ',
        '                              +         +            +                                          ',
        '                  ^  ^  +     +   ^     +    ^  ^    +                                          ',
        '========================================================      ===================================',
    ];

    const levelConf = {
        width: 33,
        height: 50,
        '=': () => [sprite("brick"), area(), solid(), "broken-break"],
        '_': () => [sprite("hat"), area(), solid(), scale(3)],
        '$': () => [sprite("coin"), area(), "coin"],
        '-': () => [sprite("broken-brick"), area(), "broken-brick", scale(1.2), lifespan(0.1)],
        '}': () => [sprite("unboxed"), area(), solid()],
        '%': () => [sprite("surprize"), area(), solid(), "coin-surprize"],
        '?': () => [sprite("surprize"), area(), solid(), "mushroom-surprize"],
        '+': () => [sprite("pipe"), area(), scale(3), solid(), "pipe"],
        '^': () => [sprite("gombo"), scale(1.3), "gombo", solid(), area(), body()],
        '#': () => [sprite("mushroom"), area(), solid(), body(), "mushroom"],
    }

    action("mushroom", (m) => {
        m.move(rand(MOVE_MUSHROOM.isCollision ? MOVE_MUSHROOM.left : MOVE_MUSHROOM.right), 0);
        m.collides("pipe", () => MOVE_MUSHROOM.isCollision = true);
    })

    action("gombo", (m) => {
        m.move(-rand(100), 0);
    })

    player.action(() => {
        camPos(player.pos);
        if (player.pos.y >= FULL_DEATH) {
            go("lose", { heart, coins })
        }
    })

    function Big() {

        player.scale.x = (2);
        player.scale.y = (2);
        setTimeout(() => {
            player.scale.x = (1.3);
            player.scale.y = (1.3);
        }, 5000);
    }

    player.collides("mushroom", (m) => {
        Big();
        destroy(m);
    });

    player.collides("coin", (c) => {
        coins++;
        coinsText.text = "c: " + coins;
        destroy(c);
    });

    player.collides("gombo", (g) => {
        if (player.grounded()) {
            heart--;
            go("lose", { heart, coins })
        }
        else {
            destroy(g);
        }
    });

    player.on("headbutt", (obj) => {
        if (obj.is("coin-surprize")) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
        if (obj.is("mushroom-surprize")) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 0.7))
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
        if (obj.is("broken-break")) {
            gameLevel.spawn('-', obj.gridPos.sub(0, 0.1))
            destroy(obj);
        }
    })

    const heartText = add([
        text("h: " + heart),
        pos(30, 30),
        fixed(),
        scale(2.5),
        layer("ui"),
    ]);

    const coinsText = add([
        text("c: " + coins),
        pos(110, 30),
        fixed(),
        scale(2.5),
        layer("ui"),
    ]);

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown("right", () => {
        player.move(MOVE_SPEED, 0);
    })

    keyDown("up", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    })

    keyPress("space", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    })

    const gameLevel = addLevel(maps, levelConf)

})

scene("lose", ({ heart }) => {
    add([
        text("You heart: " + heart),
        origin("center"),
        scale(2.5),
        pos(width() / 2, height() / 2)
    ]);
    add([
        text("The End Game!"),
        origin("center"),
        scale(2.5),
        pos(width() / 2, height() / 2.5)
    ]);

    keyPress("space", () => go("game"));
    mouseClick(() => go("game"));
})

go("game");