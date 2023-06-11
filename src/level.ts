import 'phaser';
import portal from './assets/portal.png';
import pause from './assets/pause.png';
import docRun from './assets/docRun.png';
import docJump from './assets/docjump.png';
import doubleJump from './assets/doublejump.png';
import doc from './assets/doc.png';
import wallscrape from './assets/wallscrape.png';
import levelMusic from './assets/levelMusic.mp3';
import touchLeft from './assets/left.png';
import touchRight from './assets/right.png';
import touchJump from './assets/jump.png';
import touchRewind from './assets/rewind.png';
import { Player } from "./player.ts";

type LevelOptions = {
    levelKey: string,
    levelUrl: string,
    tilesetName: string,
    tilesetKey: string,
    tilesetUrl: string
}
type InputFacade = {
    isDown: boolean,
    on: (event: any, fn: Function, context?: any) => any,

}
type Input = {
    jump: InputFacade,
    left: InputFacade,
    right: InputFacade,
}

class TouchInput extends Phaser.GameObjects.Image
{
    isDown: boolean;
    constructor(scene: Phaser.Scene , x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);

        this.setInteractive();
        this.isDown = false;


        this.on('pointerup', () => { this.pointerUp(); });
        this.on('pointerout', () => { this.pointerUp(); });

    }

    pointerUp()
    {
        this.isDown = false;
    }

}

export default abstract class Level extends Phaser.Scene {
    levelOptions: LevelOptions;

    pause!: Phaser.GameObjects.Image;
    flag!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    map!: Phaser.Tilemaps.Tilemap;
    player!: Player;
    w!: number;
    h!: number;
    Input!: Input;
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
        this.load.image('touchLeft', touchLeft);
        this.load.image('touchRight', touchRight);
        this.load.image('touchJump', touchJump);
        this.load.image('touchRewind', touchRewind);
        
        
    }
    addKeys() {
        if(this.game.device.input.touch){
            let left = new TouchInput(this, this.w * 0.1, this.h*0.9, 'touchLeft')
            let right = new TouchInput(this, this.w * 0.3, this.h*0.9, 'touchRight')
            let jump = new TouchInput(this, this.w * 0.9, this.h*0.9, 'touchJump')
            this.Input = {
                jump: jump,
                left: left,
                right: right,
            }
        } else {
            this.Input = {
                jump: this.input.keyboard!.addKey('W'),
                left:this.input.keyboard!.addKey('A'),
                right: this.input.keyboard!.addKey('D'),
            }
        }
        this.Input.jump.on('down', () => {
            this.player.isJumpHeld = true;
        })
    }
    checkPlayerState() {

        if (this.Input.left.isDown) {
            this.player.movingLeft = true;
        } else {
            this.player.movingLeft = false;
        }
        if (this.Input.right.isDown) {
            this.player.movingRight = true;
        } else {
            this.player.movingRight = false;
        }


        this.player.update();
    }
    create(): void {
        this.scene.launch('HUD');
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

        this.add.existing(this.player)
        this.physics.add.existing(this.player);





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
                let r = this.add.rectangle(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height).setAlpha(0).setOrigin(0.5)
                this.physics.add.existing(r, true)
                this.physics.add.collider(this.player, r)
            }
        })


        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player, false, 0.5, 0.1);
        camera.setZoom(4)
        camera.setBackgroundColor('#ccccff');

    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.checkPlayerState();

    }
}
