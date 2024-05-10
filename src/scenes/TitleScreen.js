class TitleScreen extends Phaser.Scene {
    constructor() {
        super("TitleScreen");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bg_green", "bg_green.png");
    }

    create() {
        let background = this.add.image(0, 0, "bg_green").setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        let titleText = this.add.text(400, 150, `Dealers Duel!`, {
            fontSize: "48px",
            fill: "#fff",
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titleText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500, 
            yoyo: true, 
            repeat: -1, 
            ease: "Sine.easeInOut",
        });

        this.add.text(280, 350, `Press S to Start`, {
            fontSize: "24px",
            fill: "#fff",
        });
        this.add.text(190, 370, `Press C for Credits & Controls`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.creditsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        //for start
        this.startKey.on("down", () => {
            this.scene.start("GameFile");
        });
        // for credits
        this.creditsKey.on("down", () => {
            this.scene.start("CreditsControls");
        });
    }
}
