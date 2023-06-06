class Settings extends Phaser.Scene {
    constructor() {
        super('settings');
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('resume', 'resume.png');
        this.load.image('audioon', 'audio_on.png');
        this.load.image('audiooff', 'audio_off.png');
    }
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.cameras.main.setBackgroundColor('#36454f');

        this.back = this.add.image(centerX - 900, centerY - 500, 'resume')
        .setInteractive()
        .on('pointerover', () => this.back.setAlpha(0.4))
        .on('pointerout', () => this.back.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('pause');
        });
        this.back.setFlipX(true);
        this.back.setScale(.8);

        this.audioon = this.add.image(centerX - 200, centerY, 'audioon')
        this.audioon.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.audioon.setAlpha(0.4))
        .on('pointerout', () => this.audioon.setAlpha(1))
        .on('pointerdown', () => {
            /////////////////music on/////////////////
        });

        this.audiooff = this.add.image(centerX + 200, centerY, 'audiooff')
        this.audiooff.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.audiooff.setAlpha(0.4))
        .on('pointerout', () => this.audiooff.setAlpha(1))
        .on('pointerdown', () => {
            ////////////////music off///////////////
        });
    }
}