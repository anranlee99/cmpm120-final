import 'phaser';

import resume from './assets/resume.png';
import settings from './assets/settings.png';
import quit from './assets/quit.png';
import mapbut from './assets/mapbut.png';

export default class Pause extends Phaser.Scene {
    pauseText!: Phaser.GameObjects.Text
    resume!: Phaser.GameObjects.Image
    settings!: Phaser.GameObjects.Image
    quit!: Phaser.GameObjects.Image
    mapbut!: Phaser.GameObjects.Image

    constructor() {
        super('pause');
    }
    preload() {
        this.load.image('resume', resume);
        this.load.image('settings', settings);
        this.load.image('quit', quit);
        this.load.image('mapbut', mapbut);
    }
    create() {
        this.scene.bringToTop();
        this.cameras.main.setBackgroundColor('#36454f');
        this.pauseText = this.add.text(
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
            this.scene.stop();
            let sceneToResume = this.scene.manager.getScenes(false).find((s) => s.scene.isPaused())
            sceneToResume!.scene.resume();
        });
        this.resume.setScale(.8)

        //////////////////add audio scene///////////////////
        this.settings = this.add.image(centerX, centerY + 300, 'settings')
        this.settings.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.settings.setAlpha(0.4))
        .on('pointerout', () => this.settings.setAlpha(1))
        .on('pointerdown', () => {
            this.scene.run('settings');
        });

        this.quit = this.add.image(centerX, centerY, 'quit')
        this.quit.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.quit.setAlpha(0.4))
        .on('pointerout', () => this.quit.setAlpha(1))
        .on('pointerdown', () => {
            let sceneStack = this.scene.manager.getScenes(false, true)
            
            this.scene.stop(sceneStack[0]);
            this.scene.stop(sceneStack[1]);
            this.scene.start('title');
            
        });

        this.mapbut = this.add.image(centerX, centerY - 300, 'mapbut')
        this.mapbut.setScale(3)
        .setInteractive()
        .on('pointerover', () => this.mapbut.setAlpha(0.4))
        .on('pointerout', () => this.mapbut.setAlpha(1))
        .on('pointerdown', () => {
            let sceneStack = this.scene.manager.getScenes(false, true)
            this.scene.stop(sceneStack[0]);
            this.scene.stop(sceneStack[1]);
            this.scene.start('map');
        });
    }
}
