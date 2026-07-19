var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87cefa',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var enemy;
var platforms;
var spadesArr;
var score = 0;
var gameOver = false;
var moveRight = true;
var checkpoint;
var cursors;

var scoreText;
var timeText;
var rulesText;
var textGameMessage;
var textGameMessageF5;

var boxArr;
var box_jumpArr;
var box_tntArr;
var consumableArr;

function preload ()
{
    this.load.on("loaderror", function (file) {
        if (window.__diagLogError) {
            window.__diagLogError("LOADERROR: " + file.key + " -> " + file.src);
        }
    });

    this.load.image('box', 'assets/img/hd/box.png');
    this.load.image('apple', 'assets/img/hd/apple.png');
    this.load.image('box_jump', 'assets/img/hd/box_jump.png');
    this.load.image('box_tnt', 'assets/img/hd/box_tnt.png');
    this.load.image('ground', 'assets/img/platform.png');
    this.load.image('ground_little', 'assets/img/platform_little.png');
    this.load.spritesheet('crash', 'assets/img/hd/crash_new.png', { frameWidth: 140, frameHeight: 150 });
    this.load.image('enemy', 'assets/img/enemy.png');
    this.load.image('spades', 'assets/img/void.png');
    this.load.image('checkpoint', 'assets/img/checkpoint.png');
}

function makeStaticImage(scene, x, y, key, scale) {
    var img = scene.add.image(x, y, key);
    if (scale) img.setScale(scale);
    scene.physics.add.existing(img, true);
    if (scale) img.body.updateFromGameObject();
    return img;
}

function makeDynamicImage(scene, x, y, key) {
    var img = scene.add.image(x, y, key);
    scene.physics.add.existing(img, false);
    return img;
}

function create ()
{
    platforms = [];
    spadesArr = [];
    boxArr = [];
    consumableArr = [];
    box_jumpArr = [];
    box_tntArr = [];

    platforms.push(makeStaticImage(this, -60, 568, 'ground', 2));
    platforms.push(makeStaticImage(this, 987, 568, 'ground', 2));
    platforms.push(makeStaticImage(this, 460, 568, 'ground_little', 2));

    spadesArr.push(makeStaticImage(this, 400, 600, 'spades', 2));

    checkpoint = makeStaticImage(this, 782, 534, 'checkpoint');

    player = this.add.sprite(100, 450, 'crash');
    this.physics.add.existing(player, false);
    player.body.setCollideWorldBounds(true);
    player.setScale(0.3);
    player.body.setSize(100, 140).setOffset(20, 8);

    enemy = makeDynamicImage(this, 600, 525, 'enemy');
    enemy.body.setCollideWorldBounds(true);

    boxArr.push(makeStaticImage(this, 200, 525, 'box'));
    boxArr.push(makeStaticImage(this, 200, 502, 'box'));
    boxArr.push(makeStaticImage(this, 200, 479, 'box'));

    consumableArr.push(makeStaticImage(this, 300, 450, 'apple'));
    consumableArr.push(makeStaticImage(this, 300, 427, 'apple'));

    box_jumpArr.push(makeStaticImage(this, 300, 525, 'box_jump'));

    box_tntArr.push(makeStaticImage(this, 460, 525, 'box_tnt'));
    box_tntArr.push(makeStaticImage(this, 200, 456, 'box_tnt'));

    scoreText = this.add.text(16, 16, 'Wumpa: 0', { fontSize: '32px', fill: '#000' });
    timeText = this.add.text(630, 16, 'Time: 0', { fontSize: '32px', fill: '#000' });
    rulesText = this.add.text(320, 16, 'Collect all Wumpa Fruit!', { fontSize: '16px', fill: '#000' });

    textGameMessage = this.add.text(350, 260);
    textGameMessageF5 = this.add.text(300, 280);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy, hitEnemy, null, this);

    this.physics.add.collider(consumableArr, platforms);
    this.physics.add.collider(boxArr, platforms);
    this.physics.add.collider(box_jumpArr, platforms);
    this.physics.add.collider(box_tntArr, platforms);

    this.physics.add.collider(player, box_jumpArr, hitJump, null, this);
    this.physics.add.collider(player, box_tntArr, hitTnt, null, this);
    this.physics.add.collider(player, spadesArr, hitSpades, null, this);
    this.physics.add.collider(player, checkpoint, playerWin, null, this);

    this.physics.add.overlap(player, consumableArr, collectConsumable, null, this);
    this.physics.add.overlap(player, boxArr, collectBox, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('crash', { start: 0, end: 6 }),
        frameRate: 14,
        repeat: -1
    });

    this.anims.create({
        key: 'default',
        frames: [ { key: 'crash', frame: 0 } ],
        frameRate: 20
    });
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (moveRight == true)
    {
        setTimeout(() => {
            enemy.body.setVelocityX(+50);
            moveRight = false
        }, 2000);
    }
    else if (moveRight == false)
    {
        setTimeout(() => {
            enemy.body.setVelocityX(-50);
            moveRight = true
        }, 2000);
    }

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-160);
        player.setFlipX(true);
        player.anims.play('run', true);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(160);
        player.setFlipX(false);
        player.anims.play('run', true);
    }
    else
    {
        player.body.setVelocityX(0);
        player.anims.play('default');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.setVelocityY(-230);
    }
}

function collectBox (player, box)
{
    box.disableBody(true, true);
    score += 5;
    scoreText.setText('Wumpa: ' + score);
}

function collectConsumable (player, item)
{
    item.disableBody(true, true);
    score += 1;
    scoreText.setText('Wumpa: ' + score);
}

function hitTnt (player, box)
{
    box.setTint(0xff0000);
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('default');
    gameEnd();
}

function hitJump (player, box)
{
    player.body.setVelocityY(-280);
    player.anims.play('default');
}

function hitEnemy (player, enemy)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('default');
    gameEnd();
}

function hitSpades (player, spade)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('default');
    gameEnd();
}

function gameEnd(){
    textGameMessage.setText('GAME OVER');
    textGameMessageF5.setText('PRESS F5 TO RESTART');
    gameOver = true;
}

function playerWin (player, ckeckpoint){
    if (score > 16)
    {
        this.physics.pause();
        player.anims.play('default');
        textGameMessage.setText('WELL DONE, YOU WON!');
        gameOver = true;
    }
}
