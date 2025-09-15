import {
    Actor,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    Keys,
    Label,
    Side,
    vec,
} from "excalibur";

export class Player extends Actor {

    lastSpeed = vec(0, 0);

    playerLabel: Label | undefined;

    engineRef: Engine | undefined;

    constructor(name: string = 'player') {
        super({
            pos: vec(100, 100), // Starting position of the player
            width: 64,
            height: 64,
            color: Color.Yellow,
            collisionType: CollisionType.Active,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize player specific properties or animations here
        this.engineRef = engine;
        console.log(this)

        const playerLabel = new Label({
            text: 'Player',
            pos: vec(0, -45),
            color: Color.Black,
            // size: 14,
            // fontFamily: 'Arial',
            z: 1
        });
        this.playerLabel = playerLabel;
        this.updatePlayerLabel('Player');
        this.addChild(playerLabel);
    }

    updatePlayerLabel(text: string) {
        if (this.playerLabel) {
            this.playerLabel.text = text;
            const playerLabelWidth = this.playerLabel.getTextWidth();
            this.playerLabel.pos.x = - playerLabelWidth / 2;

            // Remove the label text after a short time
            this.engineRef?.clock.schedule(() => {
                if (this.playerLabel) {
                    this.playerLabel.text = 'Player';
                    const playerLabelWidth = this.playerLabel.getTextWidth();
                    this.playerLabel.pos.x = - playerLabelWidth / 2;
                }
            }, 300);
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
    }

    onCollisionEnd(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision end events here
    }

    onPostUpdate(engine: Engine) {

        let moveX = false
        let moveY = false

        if (
            engine.input.keyboard.isHeld(Keys.W) ||
            engine.input.keyboard.isHeld(Keys.Up)
        ) {
            this.vel.y += -10; // Move up
            moveY = true;
        }

        if (
            engine.input.keyboard.isHeld(Keys.S) ||
            engine.input.keyboard.isHeld(Keys.Down)
        ) {
            this.vel.y += 10; // Move down
            moveY = true;
        }

        if (
            engine.input.keyboard.isHeld(Keys.A) ||
            engine.input.keyboard.isHeld(Keys.Left)
        ) {
            this.vel.x += -10; // Move left
            moveX = true;
        }

        if (
            engine.input.keyboard.isHeld(Keys.D) ||
            engine.input.keyboard.isHeld(Keys.Right)
        ) {
            this.vel.x += 10; // Move right
            moveX = true;
        }

        let maxVelocity = 400;
        // const maxSpeed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale; // Scale down the velocity to maxVelocity
        }

        // this.vel.x = clamp(this.vel.x, -400, 400); // Limit horizontal speed
        // this.vel.y = clamp(this.vel.y, -400, 400); // Limit vertical speed

        if (moveY === false) {
            this.vel.y *= 0.9; // Stop moving if no button is pressed
        }
        if (moveX === false) {
            this.vel.x *= 0.9; // Stop moving if no button is pressed
        }

        this.lastSpeed = vec(this.vel.x, this.vel.y);
    }

}