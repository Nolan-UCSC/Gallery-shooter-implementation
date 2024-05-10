//the base of this code is from https://github.com/JimWhiteheadUCSC/BulletTime/tree/master/src/Scenes
//it has since been modifed from the orginal state with my code
class MainGame extends Phaser.Scene {
    constructor() {
        super("GameFile");

        // Initialize a class variable "my" which is an object.
        this.my = { sprite: {}, text: {}, initialY: {} };

        // Create a property inside "sprite" named "bullet".
        this.my.sprite.bullet = [];
        this.maxBullets = 1;
        // High score variable
        this.highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
    }

    init() {
        // Reset score and cards whenever this scene is initialized
        this.myScore = 0;
        this.myCards = 52;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bg_green", "bg_green.png");
        this.load.image("hand", "Hand.png");
        this.load.image("wchip", "whitechip.png");
        this.load.image("rchip", "redchip.png");
        this.load.image("bchip", "bluechip.png");
        this.load.image("gchip", "greenchip.png");

        this.load.spritesheet("cards", "cards.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.image("whitePuff00", "coin_21.png");
        this.load.image("whitePuff01", "coin_01.png");
        this.load.image("whitePuff02", "coin_06.png");
        this.load.image("whitePuff03", "coin_11.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.audio("chipsound", "chipsHandle6.ogg");
        this.load.audio("cardsound", "cardOpenPackage1.ogg")
    }

    create() {
        let my = this.my;

        my.sprite.background = this.add.image(0, 0, "bg_green").setOrigin(0, 0);
        my.sprite.background.displayWidth = this.scale.width;
        my.sprite.background.displayHeight = this.scale.height;

        my.sprite.hand = this.add.sprite(this.scale.width / 2, this.scale.height - 40, "hand");
        my.sprite.hand.setScale(2);

        my.sprite.wchip = this.add.sprite(this.scale.width / 2, 200, "wchip").setScale(0.25);
        my.sprite.rchip = this.add.sprite(this.scale.width / 2, 150, "rchip").setScale(0.25);
        my.sprite.bchip = this.add.sprite(this.scale.width / 2, 100, "bchip").setScale(0.25);
        my.sprite.gchip = this.add.sprite(this.scale.width / 2, 50, "gchip").setScale(0.25);

        // Store initial y-coordinates for each chip
        my.initialY.wchip = my.sprite.wchip.y;
        my.initialY.rchip = my.sprite.rchip.y;
        my.initialY.bchip = my.sprite.bchip.y;
        my.initialY.gchip = my.sprite.gchip.y;

        my.sprite.wchip.scorePoints = 5;
        my.sprite.rchip.scorePoints = 10;
        my.sprite.bchip.scorePoints = 25;
        my.sprite.gchip.scorePoints = 100;

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff03" },
            ],
            frameRate: 8,
            repeat: 2,
            hideOnComplete: true
        });

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        my.text.score = this.add.bitmapText(550, 0, "rocketSquare", "Score " + this.myScore);
        my.text.myCards = this.add.bitmapText(230, 0, "rocketSquare", "Cards Left " + this.myCards);

        this.add.text(10, 5, "Dealers Duel!", {
            fontFamily: "Times, serif",
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            if (my.sprite.hand.x > my.sprite.hand.displayWidth / 2) {
                my.sprite.hand.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            if (my.sprite.hand.x < this.scale.width - my.sprite.hand.displayWidth / 2) {
                my.sprite.hand.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                const randomFrame = Math.floor(Math.random() * 52);
                my.sprite.bullet.push(
                    this.add.sprite(
                        my.sprite.hand.x,
                        my.sprite.hand.y - my.sprite.hand.displayHeight / 2,
                        "cards",
                        randomFrame
                    ).setScale(2)
                );
                this.sound.play("cardsound", { volume: 1 });

                this.myCards--;
                this.updateScore();

                if (this.myCards <= 0) {
                    if (this.myScore > this.highScore) {
                        this.highScore = this.myScore;
                        localStorage.setItem("highScore", this.highScore);
                    }
                    this.scene.start("GameOver", { score: this.myScore, highScore: this.highScore });
                }       
            }
        }

        // Make chips slowly move down
        let chipSpeed = 0.5;
        my.sprite.wchip.y += chipSpeed;
        my.sprite.rchip.y += chipSpeed;
        my.sprite.bchip.y += chipSpeed;
        my.sprite.gchip.y += chipSpeed;

        my.sprite.bullet = my.sprite.bullet.filter(bullet => bullet.y > -bullet.displayHeight / 2);

        // Check for collision with the wchip and reset it after hit
        this.checkChipCollision("wchip");

        // Check for collision with the rchip and reset it after hit
        this.checkChipCollision("rchip");

        // Check for collision with the bchip and reset it after hit
        this.checkChipCollision("bchip");

        // Check for collision with the gchip and reset it after hit
        this.checkChipCollision("gchip");

        // Move all the bullets
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
    }

    // Function to check for chip collision and reset the chip
    checkChipCollision(chipName) {
        let my = this.my;
        let chip = my.sprite[chipName];

        for (let bullet of my.sprite.bullet) {
            if (this.collides(chip, bullet)) {
                // Start the puff animation
                this.puff = this.add.sprite(chip.x, chip.y, "whitePuff03").setScale(0.25).play("puff");

                // Clear out the bullet
                bullet.y = -100;

                // Make the chip invisible
                chip.visible = false;

                // Update the score
                this.myScore += chip.scorePoints;
                this.updateScore();

                // Play sound
                this.sound.play("chipsound", { volume: 1 });

                // Reset chip to the original y-coordinate and set a new random x-coordinate
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    chip.x = Math.random() * this.scale.width;
                    chip.y = my.initialY[chipName];
                    chip.visible = true;
                }, this);
            }
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        return (
            Math.abs(a.x - b.x) <= a.displayWidth / 2 + b.displayWidth / 2 &&
            Math.abs(a.y - b.y) <= a.displayHeight / 2 + b.displayHeight / 2
        );
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
        my.text.myCards.setText("Cards Left " + this.myCards);
    }
}
 