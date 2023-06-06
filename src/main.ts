import 'phaser';
import player from './assets/player.png';
import { Player } from './player';
import Level1 from "./levels/level1.ts";
import Level2 from "./levels/level2.ts";
import Level3 from "./levels/level3.ts";

type Keys = {
    jump: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
}
class TestScene extends Phaser.Scene {
    player!: Player;
    ghost!: Phaser.GameObjects.Sprite;
    w!: number
    h!: number
    keys!: Keys
    obstacles!: (Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body })[];



    constructor() {
        super('test');
    }
    preload() {
        this.load.image('player', player);
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
    setUp() {
        this.addKeys();
        this.w = this.game.config.width as number;
        this.h = this.game.config.height as number;
        this.player = new Player(this, this.w / 2, this.h / 2, 'player').setScale(0.5);
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.physics.world.setBounds(0, 0, this.w, this.h);
        this.player.setCollideWorldBounds(true);
    }
    addGhost() {
        this.ghost = this.add.sprite(this.player.x, this.player.y, 'player').setScale(0.5).setAlpha(0.25);
        this.time.addEvent({
            delay: 1,
            callback: () => {
                let x = this.player.x;
                let y = this.player.y;
                this.time.delayedCall(500, () => {
                    this.ghost.x = x;
                    this.ghost.y = y;
                })
            },
            loop: true
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
    create() {
        this.setUp();
        //get rid of this if you don't want the ghost
        this.addGhost();
        this.obstacles = [];
        this.obstacles.push(this.add.rectangle(this.w / 2, this.h - 2 * this.player!.displayHeight, this.w * 0.6, 100, 0x00ff00) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body } );
        this.obstacles.push(this.add.rectangle(this.w / 2, 50, this.w, 100, 0x00ff00) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body });
        this.obstacles.push(this.add.rectangle(this.w / 2, this.h-50, this.w, 100, 0x00ff00) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body });
        this.obstacles.push(this.add.rectangle(0, 100, 100, this.h-200, 0x00ff00).setOrigin(0) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body });
        this.obstacles.push(this.add.rectangle(this.w-100, 100, 100, this.h-200, 0x00ff00).setOrigin(0) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body });

        this.obstacles.forEach((obstacle) => {

            this.physics.add.existing(obstacle);
            obstacle.body.setImmovable(true);
            this.physics.add.collider(this.player, obstacle);
        })
    }
    update() {
        // this.player.update();
        this.checkPlayerState();
    }
}

let game = new Phaser.Game({
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input: {
        keyboard: true,
    },
    parent: 'app',
    title: "CMPM120 Final",
    scene: [TestScene, Level1, Level2, Level3]
})

declare global {
    interface Window { game: Phaser.Game }
}

window.game = game;