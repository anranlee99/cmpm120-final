import 'phaser';
import portal from './assets/portal.png';
import pause from './assets/pause.png';
import docRun from './assets/docRun.png';
import docJump from './assets/docjump.png';
import doubleJump from './assets/doublejump.png';
import doc from './assets/doc.png';
import wallscrape from './assets/wallscrape.png';
import levelMusic from './assets/levelMusic.mp3';
import { Player } from "./player.ts";

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
        this.load.audio('levelMusic', levelMusic);
        this.load.tilemapTiledJSON(this.levelOptions.levelKey, this.levelOptions.levelUrl);

        this.load.spritesheet(this.levelOptions.tilesetKey, this.levelOptions.tilesetUrl, { frameWidth: 16, frameHeight: 16 });

        this.load.image('flag', portal);
        this.load.image('pause', pause);
        this.load.spritesheet('docRun', docRun, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('doc', doc, {
            frameWidth: 12,
            frameHeight: 32,
        });
        this.load.spritesheet('docJump', docJump, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('doubleJump', doubleJump, { frameWidth: 16, frameHeight: 32 });
        this.load.image('wallscrape', wallscrape);
        
        
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
    checkPlayerState() {

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
        //@ts-ignore
        this.sound.getAll().forEach(s => s.destroy())
        this.sound.play('levelMusic', { loop: true, volume: 0.25});
        
        let camera = this.cameras.main;
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
        this.player = new Player(this, start.x!, start.y!, ['doc', 'docRun', 'docJump', 'doubleJump', 'wallscrape'])
        this.player.anims.create({
            key: 'docRun',
            frames: this.anims.generateFrameNumbers('docrun', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        })
        this.add.existing(this.player)
        this.physics.add.existing(this.player);

        this.pause = this.add.image(camera.width, camera.height - 100, 'pause')
        this.pause.setDepth(1)
            .setInteractive()
            .on('pointerover', () => this.pause.setAlpha(0.4))
            .on('pointerout', () => this.pause.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.pause()
                this.scene.run('pause')
            });



        this.flag = this.physics.add.image(230 / 4, 350 / 4, 'flag');
        this.flag.body.allowGravity = false;
        this.flag.setDepth(1);
        this.flag.setScale(1);
        this.flag.setImmovable(true);

        this.physics.add.collider(this.player, this.flag, () => {
            //TODO: add level transition
            this.scene.start('level2')
        });

        groundLayer.forEachTile(tile => {
            if (tile.index != -1) {
                console.log(tile)
                let r = this.add.rectangle(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height).setAlpha(0).setOrigin(0.5)
                this.physics.add.existing(r, true)
                this.physics.add.collider(this.player, r)
            }
        })


        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player, false, 0.5, 0.1);
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
