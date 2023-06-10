import 'phaser';

import lev1 from './assets/lev1.png';
import lev2 from './assets/lev2.png';
import lev3 from './assets/lev3.png';

export default class Map extends Phaser.Scene {
    lev1!: Phaser.GameObjects.Image;
    lev2!: Phaser.GameObjects.Image;
    lev3!: Phaser.GameObjects.Image;

    constructor() {
        super('map');
    }
    preload() {
        this.load.image('lev1', lev1)
        this.load.image('lev2', lev2)
        this.load.image('lev3', lev3)
    }
    create() {
        this.scene.bringToTop();
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.cameras.main.setBackgroundColor('#536872');

        this.lev1 = this.add.image(centerX - 500, centerY, 'lev1')
        this.lev1.setScale(4)
        .setInteractive()
        .on('pointerover', () => this.lev1.setAlpha(0.4))
        .on('pointerout', () => this.lev1.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('level1')
        });

        //this.lev1.input.on('pointerdown', () => this.scene.start('level2'));
        this.lev2 = this.add.image(centerX, centerY, 'lev2')
        this.lev2.setScale(4)
        .setInteractive()
        .on('pointerover', () => this.lev2.setAlpha(0.4))
        .on('pointerout', () => this.lev2.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('level2')
        });

        this.lev3 = this.add.image(centerX + 500, centerY, 'lev3')
        this.lev3.setScale(4)
        .setInteractive()
        .on('pointerover', () => this.lev3.setAlpha(0.4))
        .on('pointerout', () => this.lev3.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('level3')
        });
    }
}
