import 'phaser';
import dashStill from './assets/dashstill.png';
import portal from './assets/portal.png';
import pause from './assets/pause.png';
import {Player} from "./player.ts";

type LevelOptions = {
    levelKey: string,
    levelUrl: string,
    tilesetName: string,
    tilesetKey: string,
    tilesetUrl: string
}
type Keys = {
    jump: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
}
export default abstract class Level extends Phaser.Scene {
    levelOptions: LevelOptions;

    pause!: Phaser.GameObjects.Image;
    flag!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    map!: Phaser.Tilemaps.Tilemap;
    player!: Player;
    w!: number;
    h!: number;
    keys!: Keys;
    constructor(key: string, levelOptions: LevelOptions) {
        super(key);

        this.levelOptions = levelOptions
    }

    preload(): void {
        this.load.tilemapTiledJSON(this.levelOptions.levelKey, this.levelOptions.levelUrl);

        this.load.spritesheet(this.levelOptions.tilesetKey, this.levelOptions.tilesetUrl, { frameWidth: 16, frameHeight: 16 });

        this.load.image('player', dashStill);
        this.load.image('flag', portal);
        this.load.image('pause', pause);
    }
    addKeys() {
        this.keys = {
            jump: this.input.keyboard!.addKey('W'),
            left: this.input.keyboard!.addKey('A'),
            right: this.input.keyboard!.addKey('D'),
        }
        this.keys.jump = this.input.keyboard!.addKey('W');
        this.keys.left = this.input.keyboard!.addKey('A');
        this.keys.right = this.input.keyboard!.addKey('D');
        this.keys.jump!.on('down', () => {
            this.player.isJumpHeld = true;
        })
    }
    checkPlayerState(){

        if (this.keys.left.isDown) {
            this.player.movingLeft = true;
        } else {
            this.player.movingLeft = false;
        }
        if (this.keys.right.isDown) {
            this.player.movingRight = true;
        } else {
            this.player.movingRight = false;
        }


        this.player.update();
    }
    create(): void {
        
        let camera = this.cameras.main;

        this.pause = this.add.image(camera.width * 4 - 500, camera.height * 4 - 500, 'pause')
        this.pause.setDepth(1)
            .setInteractive()
            .on('pointerover', () => this.pause.setAlpha(0.4))
            .on('pointerout', () => this.pause.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.start('pause')
            });
        this.pause.setScale(1);
        this.pause.setOrigin(1, 0);

        // Keep the image anchored to the top right corner during camera scroll
        camera.scrollX = 0; // Set the initial scroll position to 0
        camera.scrollY = 0;
        camera.setScroll(this.pause.width, 0);

        this.flag = this.physics.add.image(230, 350, 'flag');
        this.flag.body.allowGravity = false;
        this.flag.setDepth(1);
        this.flag.setScale(4);
        this.flag.setImmovable(true);

        this.map = this.make.tilemap({ key: this.levelOptions.levelKey });
        let groundTiles = this.map.addTilesetImage(this.levelOptions.tilesetName, this.levelOptions.tilesetKey)!;
        let wallLayer = this.map.createLayer('walls', groundTiles, 0, 0)!;
        wallLayer.setScale(4);
        // wallLayer.setDepth(0);
        let miscLayer = this.map.createLayer('misc', groundTiles, 0, 0)!;
        miscLayer.setScale(4);
        // miscLayer.setDepth(2);
        let groundLayer = this.map.createLayer('ground', groundTiles, 0, 0)!;
        groundLayer.setScale(4);
        // the player will collide with this layer
        groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries of our game world
        this.physics.world.bounds.width = groundLayer.width * 4;
        this.physics.world.bounds.height = groundLayer.height * 4;

        let objLayer = this.map.getObjectLayer('objs')!
        let start = objLayer.objects.find(v => v.name == 'start')!

        this.w = this.game.config.width as number;
        this.h = this.game.config.height as number;
        this.addKeys();
        this.player = new Player(this, start.x!, start.y!, 'player').setScale(5)
        
        this.add.existing(this.player)
        this.physics.add.existing(this.player);
        this.physics.world.setBounds(0, 0, this.w, this.h);
        this.player.setCollideWorldBounds(true);

        /* let finish = */ objLayer.objects.find(v => v.name == 'finish')!

        this.physics.add.collider(groundLayer, this.player)

        /* let spikes = */ objLayer.objects.filter(obj => obj.name === 'spike');
        // this.physics.add.overlap(this.player, spikes, this.handleSpikeCollision, null, this);

        camera.setBounds(0, 0, this.map.widthInPixels * 4, this.map.heightInPixels * 4);
        camera.startFollow(this.player);
        camera.setBackgroundColor('#ccccff');
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.checkPlayerState();
        // TODO: make the pause button not have world coordinates
    }
}
