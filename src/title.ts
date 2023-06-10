import 'phaser';

import menuMusic from './assets/menuMusic.mp3';
import title from './assets/title.png';

export default class Title extends Phaser.Scene {
    title!: Phaser.GameObjects.Image

    constructor() {
        super('title');
    }
    preload() {
        this.load.audio('menuMusic', menuMusic);
        this.load.image('title', title);
    }
    create() {
        this.scene.bringToTop();
        //@ts-ignore
        this.sound.getAll().forEach(s => s.destroy())
        this.sound.play('menuMusic', {loop: true, volume: 0.5});
        this.cameras.main.setBackgroundColor('#1D4625');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.title = this.add.image(centerX, centerY - 100, 'title');
        this.title.setScale(3);

        const playText = this.add.text(centerX - 150, centerY + 300, 'PLAY', { fontSize: '80px', color: '#fff' });
        //playText.setDepth(1);
        playText.setInteractive();
        playText.on('pointerover', () => {
            playText.setStyle({ color: '#ff0' });
        });
        playText.on('pointerout', () => {
            playText.setStyle({ color: '#fff' });
        });
        playText.on('pointerdown', () => {
            this.scene.start('map');
        });
        this.tweens.add({
            targets: this.title,
            x: '+=' + 100,
            repeat: 2,
            yoyo: true,
            ease: 'Sine.inOut',
            duration: 100
        });
        // const space = this.add.image(200, 0, 'space');
        // //space.scale(.5);
        // space.setOrigin(0);
        // space.setDepth(0);

        // this.imageObject.background = this.back;
    }
}