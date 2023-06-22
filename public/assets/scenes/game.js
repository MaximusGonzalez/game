export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    //creo el mapa nivel
    const map = this.make.tilemap({ key: "nivel" });

    //creo los tilesets y los emparejo con sus respectibas imagenes (nombre de tileset en tiled y nombre de la imagen usada para crearlo)
    const tileset1 = map.addTilesetImage("Base Color", "Base Color");
    const tileset2 = map.addTilesetImage("Buildings", "Buildings");
    const tileset3 = map.addTilesetImage("Frontal Fog", "Frontal Fog");
    const tileset4 = map.addTilesetImage("Props-01", "Props-01");
    const tileset5 = map.addTilesetImage("Tiles", "Tiles");

    //creo backgrounds y los emparejo con sus respectivos tilesets (nombre de capa en tiled, nombre de tiled usado para crearla, x, y)
    //para mantenerlo simple se recomienda usar solo un tileset por capa. Mantener valores de x, y, en 0
    const backgroundLayer1 = map.createLayer("patrones1", tileset1, 0, 0);
    const backgroundLayer2 = map.createLayer("patrones2", tileset3, 0, 0);
    const backgroundLayer3 = map.createLayer("patrones3", tileset2, 0, 0);
    const backgroundLayer4 = map.createLayer("patrones4", tileset2, 0, 0);
    const backgroundLayer5 = map.createLayer("patrones5", tileset2, 0, 0);
    const backgroundLayer6 = map.createLayer("patrones6", tileset5, 0, 0);
    const backgroundLayer7 = map.createLayer("patrones7", tileset4, 0, 0);
    const backgroundLayer8 = map.createLayer("patrones8", tileset4, 0, 0);

    //añado coliders
    backgroundLayer6.setCollisionByProperty({ colider: true });
    this.physics.world.setBounds(0, 0, 2400, 360);

    //creo spawnpoint de objeto (nombre de capa en la que se encuentra el objeto en tiled, (obj) => obj.name === nombre del objeto en tiled)
    const spawnPoint = map.findObject(
      "objetos1",
      (obj) => obj.name === "personaje"
    );

    const zombieSpawn = map.findObject(
      "objetos1",
      (obj) => obj.name === "zombie"
    );

    // creo al jugador (x, y, son tomados del spawnpoint creado con spawnPoint.x, spawnPoint.y, nombre de imagen usada para el personaje)
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "dude")
      .setCollideWorldBounds(true)
      .setBounce(0.1);
    this.zombie = this.physics.add.sprite(
      zombieSpawn.x,
      zombieSpawn.y,
      "Zombie"
    );

    this.zombie.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createBullets();

    this.physics.add.collider(this.player, backgroundLayer6);
    this.physics.add.collider(this.zombie, backgroundLayer6);
    this.physics.add.overlap(
      this.zombie,
      this.bullets,
      this.dañoZombie,
      null,
      this
    );

    this.cameras.main.startFollow(this.player);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.setViewport(0, 0, 480, 240);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.input.on("pointerdown", this.shoot, this);
  }

  update() {
    //move left
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    }
    //stop
    else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-500);
    }
  }

  createBullets() {
    this.bullets = this.physics.add.group({
      inmovable: true,
      allowGravity: false,
    });

    this.bullets.createMultiple({
      classType: Phaser.Physics.Arcade.Sprite,
      key: "Bullet",
      frame: 0,
      visible: false,
      active: false,
      repeat: 5,
      setXY: {
        x: 400,
        y: 550,
      },
    });

    this.bullets.children.entries.forEach((bullet) => {
      bullet.setCollideWorldBounds(true);
      bullet.body.onWorldBounds = true;
      bullet.body.world.on(
        "worldbounds",
        function (body) {
          if (body.gameObject === this) {
            this.setActive(false);
            this.setVisible(false);
          }
        },
        bullet
      );
    });
  }

  dañoZombie(zombie, bullet) {
    bullet.destroy();
  }

  shoot(pointer) {
    console.log("🚀 ~ file: game.js:142 ~ Game ~ shoot ~ pointer:", pointer.x, pointer.y)
    console.log(this.cameras.main);
    
    let speed = 300;
    let newX = pointer.x;

    if(this.cameras.main._scrollX > pointer.x){
      newX+=this.cameras.main._scrollX;
    }

    // create bullet
    var bullet = this.bullets.get(this.player.x, this.player.y);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      this.physics.moveTo(bullet, newX, pointer.y+80, speed);
    }
  }
}
