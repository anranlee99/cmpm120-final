class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('resume', 'resume.png');
        this.load.image('settings', 'settings.png');
        this.load.image('quit', 'quit.png');
        this.load.image('mapbut', 'mapbut.png');
    }
    create() {
        this.cameras.main.setBackgroundColor('#36454f');
        this.textObject0 = this.add.text(
            50, //x
            50,//y
            "pause", //text
            {
                font: "20px Impact",
                color: "#FFFFFF",
                align: "center"
            } //style
        );
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.resume = this.add.image(centerX + 900, centerY - 500, 'resume')
        .setInteractive()
        .on('pointerover', () => this.resume.setAlpha(0.4))
        .on('pointerout', () => this.resume.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start(previousScene);
        });
        this.resume.setScale(.8)

        //////////////////add audio scene///////////////////
        this.settings = this.add.image(centerX, centerY + 300, 'settings')
        this.settings.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.settings.setAlpha(0.4))
        .on('pointerout', () => this.settings.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('settings');
        });

        this.quit = this.add.image(centerX, centerY, 'quit')
        this.quit.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.quit.setAlpha(0.4))
        .on('pointerout', () => this.quit.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('title');
        });

        this.mapbut = this.add.image(centerX, centerY - 300, 'mapbut')
        this.mapbut.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.mapbut.setAlpha(0.4))
        .on('pointerout', () => this.mapbut.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.start('map');
        });
    }
}