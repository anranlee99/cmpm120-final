import pause from './assets/pause.png';
import touchLeft from './assets/left.png';
import touchRight from './assets/right.png';
import touchJump from './assets/jump.png';
import touchRewind from './assets/rewind.png';
// class TouchInput extends Phaser.GameObjects.Image
// {
//     isDown: boolean;
//     constructor(scene: Phaser.Scene , x: number, y: number, texture: string)
//     {
//         super(scene, x, y, texture);

//         this.setInteractive();
//         this.isDown = false;


//         this.on('pointerup', () => { this.pointerUp(); });
//         this.on('pointerout', () => { this.pointerUp(); });

//     }

//     pointerUp()
//     {
//         this.isDown = false;
//     }

// }

export default class HUD extends Phaser.Scene{
    w!: number;
    h!: number;
    left!: Phaser.GameObjects.Image;
    right!: Phaser.GameObjects.Image;
    jump!: Phaser.GameObjects.Image;
    rewind!: Phaser.GameObjects.Image;
    constructor(){
        super('HUD');
    } 
    preload() {
        this.load.image('pause', pause);

        this.load.image('touchleft', touchLeft);
        this.load.image('touchRight', touchRight);
        this.load.image('touchJump', touchJump);
        this.load.image('touchRewind', touchRewind);
    }
    create(){
        this.w = this.cameras.main.width;
        this.h = this.cameras.main.height;
        this.scene.bringToTop();
        console.log()
        let pause = this.add.image(0, 0, 'pause').setOrigin(0, 0).setInteractive()
        pause.setX(this.w - pause.width)
        .on('pointerdown', () => {
            this.scene.manager.getScenes().forEach((s) => {           
                if(s.scene.key != 'HUD'){
                    s.scene.pause()
                }
            })
            this.scene.launch('pause');
        })

        // this.left = new TouchInput(this, this.w * 0.1,this.h*0.85, 'touchleft').setOrigin(0.5)
        // this.left.setScale(this.h*0.1/this.left.displayHeight)

        // this.right = new TouchInput(this, this.left.x + this.left.displayWidth * 1.5,this.left.y, 'touchRight').setOrigin(0.5)
        // this.right.setScale(this.h*0.1/this.right.displayHeight)

        // this.jump = new TouchInput(this, this.w - this.left.x ,this.left.y, 'touchJump').setOrigin(0.5)
        // this.jump.setScale(this.h*0.1/this.jump.displayHeight)

        // this.rewind = new TouchInput(this, this.jump.x - this.jump.displayWidth * 1.5,this.jump.y, 'touchRewind').setOrigin(0.5)
        // this.rewind.setScale(this.h*0.1/this.rewind.displayHeight)
    }
    // getLeft(){
    //     return this.left
    // }
    // getRight(){
    //     return this.right
    // }
    // getJump(){
    //     return this.jump
    // }
    // getRewind(){
    //     return this.rewind
    // }
}