class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        this.score = data.score;
        this.highScore = data.highScore;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bg_green", "bg_green.png");
    }

    create() {
        let background = this.add.image(0, 0, "bg_green").setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        this.add.text(280, 150, `Game Over!`, {
            fontSize: "32px",
            fill: "#fff",
        });

        this.add.text(280, 200, `Your Score: ${this.score}`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.add.text(280, 250, `High Score: ${this.highScore}`, {
            fontSize: "24px",
            fill: "#fff",
        });

        this.add.text(280, 350, `Press R to Restart`, {
            fontSize: "18px",
            fill: "#fff",
        });

        this.add.text(280, 400, `Press C for Credits & Controls`, {
            fontSize: "18px",
            fill: "#fff",
        });

        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.creditsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // for restart
        this.restartKey.on("down", () => {
            this.scene.start("GameFile");
        });

        // for credits
        this.creditsKey.on("down", () => {
            this.scene.start("CreditsControls");
        });
    }
}
