class Map extends Phaser.Scene {
    constructor() {
        super('map');
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('lev1', 'lev1.png')
        this.load.image('lev2', 'lev2.png')
        this.load.image('lev3', 'lev3.png')
    }
    create() {

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        previousScene = this.scene.key;

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
