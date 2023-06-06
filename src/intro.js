class Intro extends Phaser.Scene {
    constructor() {
        super('Intro');
    }
    preload(){

    }
    create(){
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX - 700, centerY - 200, "Brayden Smith, Aly Cerutti,\nAaron Lee, Akash Basu,\nand Connor Green\npresent").setFontSize(80);
        // this.add.text(200, 100, "Aly Cerutti,").setFontSize(30);
        // this.add.text(210, 150, "Aaron Lee,").setFontSize(30);
        // this.add.text(205, 200, "Akash Basu,").setFontSize(30);
        // this.add.text(150, 250, "and Connor Green").setFontSize(30);
        // this.add.text(250, 300, "present").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('title'));
        this.cameras.main.fadeIn(5000);
        this.time.addEvent({
            delay: 8000, 
            loop:false,
            callback: () => {
                this.scene.start("title")
            }
        })
    }
    update(){
    }
}