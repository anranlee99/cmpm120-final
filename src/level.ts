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

        this.pause = this.add.image(camera.width, camera.height-100, 'pause')
        this.pause.setDepth(1)
            .setInteractive()
            .on('pointerover', () => this.pause.setAlpha(0.4))
            .on('pointerout', () => this.pause.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.start('pause')
            });

        // Keep the image anchored to the top right corner during camera scroll
        camera.scrollX = 0; // Set the initial scroll position to 0
        camera.scrollY = 0;
        camera.setScroll(this.pause.width, 0);

        this.flag = this.physics.add.image(230/4, 350/4, 'flag');
        this.flag.body.allowGravity = false;
        this.flag.setDepth(1);
        this.flag.setScale(1);
        this.flag.setImmovable(true);

        this.map = this.make.tilemap({ key: this.levelOptions.levelKey });
        let groundTiles = this.map.addTilesetImage(this.levelOptions.tilesetName, this.levelOptions.tilesetKey)!;
        /*let wallLayer = */this.map.createLayer('walls', groundTiles, 0, 0)!;
        /*let miscLayer = */this.map.createLayer('misc', groundTiles, 0, 0)!;
        let groundLayer = this.map.createLayer('ground', groundTiles, 0, 0)! as Phaser.Tilemaps.TilemapLayer;
        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;

        let objLayer = this.map.getObjectLayer('objs')!
        let start = objLayer.objects.find(v => v.name == 'start')!

        this.w = this.game.config.width as number;
        this.h = this.game.config.height as number;
        this.addKeys();
        this.player = new Player(this, start.x!, start.y!, 'player')
        this.add.existing(this.player)
        this.physics.add.existing(this.player);
        this.player.body.setSize(this.player.body.width/2, this.player.body.height)

        groundLayer.forEachTile(tile => {
            if(tile.index != -1){
                let r = this.add.rectangle(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height).setAlpha(0).setOrigin(0.5)
                // let r = this.add.rectangle(tile.x, tile.y, tile.width, tile.height).setAlpha(0).setOrigin(0.5
           
            this.physics.add.existing(r, true)
            this.physics.add.collider(this.player, r)
        }
            
        })

        objLayer.objects.find(v => v.name == 'finish')! //?
        objLayer.objects.filter(obj => obj.name === 'spike'); //TODO: add collision w/player

        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player);
        console.log(camera)
        camera.setZoom(4);
        
        this.pause.setScale(0.25)
        this.pause.setX(camera.worldView.x + camera.worldView.width - this.pause.displayWidth)
        this.pause.setY(camera.worldView.y + this.pause.displayHeight)
        
        camera.setBackgroundColor('#ccccff');

    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.checkPlayerState();

        this.pause.setX(this.cameras.main.worldView.x + this.cameras.main.worldView.width - this.pause.displayWidth)
        this.pause.setY(this.cameras.main.worldView.y + this.pause.displayHeight)
    }
}
