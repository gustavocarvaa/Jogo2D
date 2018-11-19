var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game',{ preload: preload, create: create, update: update});
var joe;
var fly;
var bullets;
var bullet;
var bulletTime = 0;
var fireButton;
var cursors;
var enemies;
var timer = 0;
var total = 0;
//Criando states
//var GameState = {
	function preload(){
		this.load.image('background', 'assets/images/cenario.jpg');
		this.load.spritesheet('joe', 'assets/images/bat_joe.png', 101, 140, 5);
		this.load.image('bullet', 'assets/images/bullet.png');
		this.load.image('enemies', 'assets/images/enemy.jpg');
	}
	function create(){
		this.background = this.game.add.sprite(0, 0, 'background');
		this.background.width = window.innerWidth;
		this.background.height = window.innerHeight;

		joe = this.game.add.sprite(20, this.game.world.centerY, 'joe');
		fly = joe.animations.add('fly');
		joe.animations.play('fly', 10.5, true);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		createEnemies();

		this.physics.arcade.enable(joe);
		//joe.anchor.setTo(0.5, 0.5);
		joe.body.collideWorldBounds = true;


		this.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

		createBullets();


		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		cursors = game.input.keyboard.createCursorKeys();
		

	}

	function update(){
	joe.body.velocity.x = 0;
    joe.body.velocity.y = 0;
    joe.body.angularVelocity = 0;    
    
    if (cursors.up.isDown)
    {
        this.physics.arcade.velocityFromAngle(joe.angle-90, 500, joe.body.velocity);
    }
    else if (cursors.down.isDown)
    {
        this.physics.arcade.velocityFromAngle(joe.angle+90, 500, joe.body.velocity);
    }
		if (fireButton.isDown)
    {
        fireBullet();
    }

    if (total < 200 && game.time.now > timer)
    {
        createEnemies();
    }

    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
	}
//};

	function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(joe.x + 100, joe.y + 90);
            //bullet.body.velocity.y = -400;
            game.physics.arcade.velocityFromRotation(joe.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 200;
        }
    }

}

	function createEnemies(){
		var enemies = game.add.sprite((window.innerWidth), game.world.randomY, 'enemies');
		enemies.enableBody = true;
		//Permite que os enemies andem pelo mapa
		var tween = game.add.tween(enemies).to({ x: -window.innerWidth }, 20000, Phaser.Easing.Linear.None, true);
		
		total++;
    	timer = game.time.now + 2000;
	}


function createBullets() {
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
}

// Called if the bullet hits one of the enemies
function collisionHandler (bullets, enemies) {

    bullets.kill();
    enemies.kill();
    enemies.damage();

}
