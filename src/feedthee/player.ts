import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Keys, Side, vec } from "excalibur";
import { Enemy } from "./enemy";

export class Player extends Actor {

    lastSpeed = vec(0,0);

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

    onInitialize(): void {
        // Initialize player specific properties or animations here   
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
        if (other.owner instanceof Enemy && self.owner instanceof Player) {
            console.log('Player collided with enemy!');
            console.log(other.owner.vel);
            console.log(self.owner.vel);
            // Simple knockback effect
            other.owner.setVelocity(this.lastSpeed.x, this.lastSpeed.y);

            // other.owner.body.applyImpulse(contact.colliderB.center, vec(this.lastSpeed.x * 2, this.lastSpeed.y * 2));

        }
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

        // this.vel.x = clamp(this.vel.x, -100, 100); // Limit horizontal speed
        // this.vel.y = clamp(this.vel.y, -100, 100); // Limit vertical speed

        if (moveY === false) {
            this.vel.y *= 0.9; // Stop moving if no button is pressed
        }
        if (moveX === false) {
            this.vel.x *= 0.9; // Stop moving if no button is pressed
        }

        this.lastSpeed = vec(this.vel.x, this.vel.y);
    }

}