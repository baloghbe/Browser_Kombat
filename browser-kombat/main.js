//Application initialization
kaboom({
    width: 1280,
    height: 720,
    scale: 1,
})
//World texture initialization
//World sprites, animations
loadSprite("background","assets/background/background_layer_1.png")
loadSprite("trees","assets/background/background_layer_2.png")
loadSpriteAtlas("assets/oak_woods_tileset.png", {
    "ground-golden": {
        "x": 16,
        "y": 0,
        "width": 16,
        "height": 16,
    },
    "deep-ground": {
        "x": 16,
        "y": 32,
        "width": 16,
        "height": 16
    },
    "ground-silver": {
        "x": 150,
        "y": 0,
        "width": 16,
        "height": 16
    }
})
loadSprite("shop", "assets/shop_anim.png", {
    //Horizontal animation frames
    sliceX:6,
    //Vertical animation frames
    silceY: 1,
    //Animation specs
    anims: {
        "default":{
            from:0,
            to:5,
            speed:12,
            loop:true
        }
    }
})
loadSprite("fence", "assets/fence_1.png")
loadSprite("sign", "assets/sign.png")
//Player sprites, animations
//Player1
//Idle
loadSprite("idle-player1", "assets/idle-player1.png", {
    sliceX:8,
    silceY:1,
    anims: {
        "idle": {
            from:0,
            to:7,
            speed:12,
            loop:true
        }
    }
})
//Jump
loadSprite("jump-player1", "assets/jump-player1.png", {
    sliceX:2,
    silceY:1,
    anims: {
        "jump": {
            from:0,
            to:1,
            speed:2,
            loop:true
        }
    }
})
//Attack
loadSprite("attack-player1", "assets/attack-player1.png", {
    sliceX:6,
    silceY:1,
    anims: {
        "attack": {
            from:1,
            to:5,
            speed:18
        }
    }
})
//Run
loadSprite("run-player1", "assets/run-player1.png", {
    sliceX:8,
    silceY:1,
    anims: {
        "run": {
            from:0,
            to:7,
            speed:18
        }
    }
})
//Death
loadSprite("death-player1", "assets/death-player1.png", {
    sliceX:6,
    silceY:1,
    anims: {
        "death": {
            from:0,
            to:7,
            speed:10
        }
    }
})
//Player2
//Idle
loadSprite("idle-player2", "assets/idle-player2.png", {
    sliceX:4,
    silceY:1,
    anims: {
        "idle": {
            from:0,
            to:3,
            speed:8,
            loop:true
        }
    }
})
//Jump
loadSprite("jump-player2", "assets/jump-player2.png", {
    sliceX:2,
    silceY:1,
    anims: {
        "jump": {
            from:0,
            to:1,
            speed:2,
            loop:true
        }
    }
})
//Attack
loadSprite("attack-player2", "assets/attack-player2.png", {
    sliceX:4,
    silceY:1,
    anims: {
        "attack": {
            from:0,
            to:3,
            speed:18
        }
    }
})
//Run
loadSprite("run-player2", "assets/run-player2.png", {
    sliceX:8,
    silceY:1,
    anims: {
        "run": {
            from:0,
            to:7,
            speed:18
        }
    }
})
//Death
loadSprite("death-player2", "assets/death-player2.png", {
    sliceX:7,
    silceY:1,
    anims: {
        "death": {
            from:0,
            to:6,
            speed:10
        }
    }
})
scene("fight", () =>{
    const background = add([
        sprite("background"),
        scale(4)
    ])

    background.add([
        sprite("trees"),
    ])
    const groundTiles = addLevel([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "------#######-----------",
        "dddddddddddddddddddddddd",
        "dddddddddddddddddddddddd",
    ], {
        tileWidth:16,
        tileHeight:16,
        tiles: {
            "#": () => [
                sprite("ground-golden"),
                area(),
                body({isStatic:true})
            ],
            "-": () => [
                sprite("ground-silver"),
                area(),
                body({isStatic: true})
            ],
            "d": () => [
                sprite("deep-ground"),
                area(),
                body({isStatic:true})
            ]
        }
    })
    groundTiles.use(scale(4))

    const shop = add([
        sprite("shop"),
        pos(700,65),
        
    ])
    shop.use(scale(4))

    shop.play("default")

    //left invisible wall
    add([
        rect(16,720),
        area(),
        body({isStatic:true}),
        pos(-20,0)
    ])

    //right invisible wall
    add([
        rect(16,720),
        area(),
        body({isStatic:true}),
        pos(1280,0)
    ])

    background.add([
        sprite("fence"),
        pos(85, 125)
    ])

    background.add([
        sprite("fence"),
        pos(10,125)
    ])

    background.add([
        sprite("sign"),
        pos(290,115)
    ])

    function makePlayer(posX, posY, width, height, scaleFactor, id){
        return add([
            pos(posX,posY),
            scale(scaleFactor),
            area({shape: new Rect(vec2(0), width, height)}),
            anchor("center"),
            body({stickToPlatform: true}),
            {
                isCurrentlyJumping: false,
                health: 500,
                sprites: {
                    run: "run-" + id,
                    idle: "idle-" + id,
                    jump: "jump-" + id,
                    attack: "attack-" + id,
                    death: "death-" + id
                }
            }

        ])
    }

    setGravity(1200)

    const player1 = makePlayer(200, 100, 16, 42, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

    function run(player, speed, flipPlayer){
        if(player.health === 0){
            return
        }

        if(player.curAnim() !== "run" && !player.isCurrentlyJumping){
            player.use(sprite(player.sprites.run))
            player.play("run")
        }
        player.move(speed, 0)
        player.flipX = flipPlayer
    }

    function resetPlayerToIdle(player) {
        player.use(sprite(player.sprites.idle))
        player.play("idle")
    }
    onKeyDown("d", ()=> {
        run(player1, 500, false)
    })

    onKeyRelease("d", ()=>{
        if(player1.health !==0){
            resetPlayerToIdle(player1)
            player1.flipX =false
        }
    })

    onKeyDown("a", ()=> {
        run(player1, -500, true)
    })

    onKeyRelease("a", ()=>{
        if(player1.health !==0){
            resetPlayerToIdle(player1)
            player1.flipX =true
        }
    })
    function makeJump(player){
        if(player.health ===0){
            return
        }
        if(player.isGrounded()){
            const currentFlip = player.flipX
            player.jump()
            player.use(sprite(player.sprites.jump))
            player.flipx = currentFlip
            player.play("jump")
            player.isCurrentlyJumping = true
        }
       
    }
    function resetAfterJump(player) {
        if(player.isGrounded() && player.isCurrentlyJumping){
            player.isCurrentlyJumping = false
            if(player.curAnim() !== "idle"){
                resetPlayerToIdle(player)
            }
        }
    }

    onKeyDown("w", ()=> {
        makeJump(player1)
    })

    player1.onUpdate(() => resetAfterJump(player1))

    function attack(player, excludedKeys){
        if(player.health ===0){
            return
        }

        for (const key of excludedKeys){
            if(isKeyDown(key)){
                return
            }
        }

        const currentFlip = player.flipX
        if(player.curAnim() !== "attack"){
            player.use(sprite(player.sprites.attack))
            player.flipX = currentFlip
            const slashX = player.pos.x +30
            const slashXFlipped = player.pos.x -350
            const slashY = player.pos.y -200

            add([
                rect(300,300),
                area(),
                pos(currentFlip ? slashXFlipped: slashX, slashY),
                opacity(0),
                player.id + "attackHitbox"
            ])
            player.play("attack", {
                onEnd: () => {
                    resetPlayerToIdle(player)
                    player.flipX = currentFlip
                }
            })
        }


    }

    onKeyPress("space", () =>{
        attack(player1, ["a", "d", "w"] )
    })

    onKeyRelease("space", () => {
        destroyAll(player1.id + "attackHitbox")
    })

    const player2 = makePlayer(1000,200,16,52,4,"player2")
    player2.use(sprite(player2.sprites.idle))
    player2.play("idle")
    player2.flipX = true

    onKeyDown("right", ()=>{
        run(player2,500,false)
    })
    onKeyRelease("right", ()=>{
        if(player2.health !==0){
            resetPlayerToIdle(player2)
            player2.flipX=false
        }
    })
    onKeyDown("left", ()=>{
        run(player2,-500,true)
    })
    onKeyRelease("left", ()=>{
        if(player2.health !==0){
            resetPlayerToIdle(player2)
            player2.flipX=true
        }
    })
    onKeyDown("up", ()=>{
        makeJump(player2)
    })

    player2.onUpdate(()=> resetAfterJump(player2))

    onKeyPress("down", ()=> {
        attack(player2, ["left", "right", "up"])
    })
    onKeyRelease("down", ()=> {
        destroyAll(player2.id + "attackHitbox")
    })

    const counter = add([
        rect(100,100),
        pos(center().x, center().y-300),
        color(10,10,10),
        area(),
        anchor("center")
    ])
    const count = counter.add([
        text("60"),
        area(),
        anchor("center"),
        {
            timeleft: 60,
        }
    ])

    const winningText = add([
        text(""),
        area(),
        anchor("center"),
        pos(center())        
    ])

    let gameOver = false
    onKeyDown("enter", ()=> gameOver ? go("fight"): null)

    function declareWinner(winningText, player1, player2){
        if(player1.health >0 && player2.health>0 || player1.health ===0 && player2.health === 0){
            winningText.text = "Tie!"
        }else if (player1.health > 0 && player2.health ===0){
            winningText.text = "Player 1 won!"
            player.use(sprite(player2.sprites.death))
            player2.play("death")
        }else{
            winningText.text = "Player 2 won!"
            player1.use(sprite(player1.sprites.death))
            player1.play("death")
        }
    }

    const countInterval = setInterval(() => {
        if(count.timeLeft === 0){
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true

            return
        }
        count.timeLeft--
        count.text = count.timeLeft
    }, 1000)
})

go("fight")