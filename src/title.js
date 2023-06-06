class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('title', 'title.png');
    }
    create() {
        this.cameras.main.setBackgroundColor('#1D4625');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.title = this.add.image(centerX, centerY - 100, 'title');
        this.title.setScale(3);

        const playText = this.add.text(centerX - 150, centerY + 300, 'PLAY', { fontSize: '80px', fill: '#fff' });
        //playText.setDepth(1);
        playText.setInteractive();
        playText.on('pointerover', () => {
            playText.setStyle({ fill: '#ff0' });
        });
        playText.on('pointerout', () => {
            playText.setStyle({ fill: '#fff' });
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