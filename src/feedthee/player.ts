import { Actor, CollisionType, Color, Engine, Keys, vec } from "excalibur";

export class Player extends Actor {
    constructor() {
        super({
            pos: vec(100, 100), // Starting position of the player
            width: 64,
            height: 64,
            color: Color.Yellow,
            collisionType: CollisionType.Active
        });
    }

    onInitialize(): void {
        // Initialize player specific properties or animations here        
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

        let maxVelocity = 200;
        // const maxSpeed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale; // Scale down the velocity to maxVelocity
        }

        // this.vel.x = clamp(this.vel.x, -100, 100); // Limit horizontal speed
        // this.vel.y = clamp(this.vel.y, -100, 100); // Limit vertical speed

        if(moveY === false) {
            this.vel.y = 0; // Stop moving if no button is pressed
        }
        if(moveX === false) {
            this.vel.x = 0; // Stop moving if no button is pressed
        }
    }
}