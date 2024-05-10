class CreditsControls extends Phaser.Scene {
    constructor() {
        super("CreditsControls");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bg_green", "bg_green.png");
    }

    create() {
        let background = this.add.image(0, 0, "bg_green").setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        // Add credits text
        this.add.text(150, 100, `Credits`, {
            fontSize: "32px",
            fill: "#fff",
        });

        this.add.text(150, 150, `Made by Nolan Jensen for CMPM 120`, {
            fontSize: "24px",
            fill: "#fff",
        });

        // Add controls information
        this.add.text(150, 250, `Controls`, {
            fontSize: "32px",
            fill: "#fff",
        });

        this.add.text(150, 300, `A: Move Left`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.add.text(150, 350, `D: Move Right`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.add.text(150, 400, `Space: Fire`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.add.text(150, 450, `Press R to Return to Start`, {
            fontSize: "18px",
            fill: "#fff",
        });

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.returnKey.on("down", () => {
            this.scene.start("TitleScreen");
        });
    }
}
